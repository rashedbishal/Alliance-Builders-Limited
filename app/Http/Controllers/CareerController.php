<?php

namespace App\Http\Controllers;

use App\Mail\JobApplicationReceived;
use App\Models\Career\CareerSetting;
use App\Models\Career\JobApplication;
use App\Models\Career\JobPost;
use App\Services\ImageOptimizer;
use App\Services\RichTextSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CareerController extends Controller
{
    /** Max application submissions per IP per minute. */
    private const APPLY_MAX_ATTEMPTS = 5;

    /** CV upload limit in kilobytes (5 MB). */
    private const CV_MAX_KB = 5120;

    /** Career hero image limit in kilobytes, matches other CMS image uploads. */
    private const HERO_MAX_KB = 300;

    // ─────────────────────────────────────────────────────────────
    //  Public site
    // ─────────────────────────────────────────────────────────────

    public function index()
    {
        $settings = CareerSetting::current();

        return Inertia::render('Career', [
            'settings' => $settings->only(['hero_image', 'heading', 'subtitle', 'no_openings_message']),
            'jobs' => JobPost::open()
                ->latest()
                ->get(['id', 'title', 'department', 'location', 'job_type', 'vacancies', 'experience', 'salary', 'deadline', 'description', 'created_at']),
        ]);
    }

    public function apply(Request $request)
    {
        $rateKey = 'career-apply:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateKey, self::APPLY_MAX_ATTEMPTS)) {
            throw ValidationException::withMessages([
                'form' => 'Too many applications submitted. Please try again in '.RateLimiter::availableIn($rateKey).' seconds.',
            ]);
        }
        RateLimiter::hit($rateKey, 60);

        $validated = $request->validate([
            'job_post_id' => [
                'nullable',
                'integer',
                Rule::exists('job_posts', 'id')->where(fn ($q) => $q
                    ->where('is_active', true)
                    ->where(fn ($q) => $q->whereNull('deadline')->orWhereDate('deadline', '>=', today()))),
            ],
            'custom_position' => ['required_without:job_post_id', 'nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^01[3-9][0-9]{8}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'cv' => ['required', 'file', 'extensions:pdf,docx', 'mimes:pdf,docx', 'max:'.self::CV_MAX_KB],
        ], [
            'job_post_id.exists' => 'The selected position is no longer open. Please choose another.',
            'custom_position.required_without' => 'Please enter the position you are applying for.',
            'phone.regex' => 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).',
            'cv.extensions' => 'Your CV must be a PDF or DOCX file.',
            'cv.mimes' => 'Your CV must be a PDF or DOCX file.',
            'cv.max' => 'Your CV must not be larger than 5 MB.',
        ]);

        $jobPost = isset($validated['job_post_id']) ? JobPost::find($validated['job_post_id']) : null;

        $cvFile = $request->file('cv');
        $extension = strtolower($cvFile->getClientOriginalExtension());
        $storedName = 'cv-'.now()->format('YmdHis').'-'.Str::random(16).'.'.$extension;

        if (! Storage::disk('local')->putFileAs(JobApplication::CV_DIRECTORY, $cvFile, $storedName)) {
            throw ValidationException::withMessages([
                'cv' => 'We could not upload your CV. Please try again.',
            ]);
        }

        try {
            $application = JobApplication::create([
                'job_post_id' => $jobPost?->id,
                'job_title' => $jobPost?->title ?? trim($validated['custom_position']),
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'message' => $validated['message'],
                'cv_path' => $storedName,
                'cv_original_name' => Str::limit($cvFile->getClientOriginalName(), 250, ''),
            ]);
        } catch (\Throwable $e) {
            // Don't leave an orphaned CV on disk if the record failed to save.
            Storage::disk('local')->delete(JobApplication::CV_DIRECTORY.'/'.$storedName);
            throw $e;
        }

        // Listed job → its own notification email only (no fallback).
        // "Other"/custom position → the default careers email from Page Settings.
        $recipient = $jobPost
            ? $jobPost->notification_email
            : CareerSetting::current()->default_email;

        if ($recipient) {
            try {
                Mail::to($recipient)->send(new JobApplicationReceived($application));
            } catch (\Throwable $e) {
                // The application is already saved and visible in the CMS;
                // a mail failure must not fail the candidate's submission.
                Log::error('Career application email failed', [
                    'application_id' => $application->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return back();
    }

    // ─────────────────────────────────────────────────────────────
    //  CMS — Page Settings
    // ─────────────────────────────────────────────────────────────

    public function settings()
    {
        return Inertia::render('cms/career/Settings', [
            'settings' => CareerSetting::current(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'heading' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'no_openings_message' => ['nullable', 'string', 'max:2000'],
            'default_email' => ['nullable', 'email', 'max:255'],
            'hero_image' => ['nullable', 'file', 'mimes:webp', 'max:'.self::HERO_MAX_KB],
        ]);

        try {
            $settings = CareerSetting::current();
            $settings->fill($request->only(['heading', 'subtitle', 'no_openings_message', 'default_email']));

            if ($request->hasFile('hero_image')) {
                $imageFile = $request->file('hero_image');
                $previousImage = $settings->getRawOriginal('hero_image');
                $sanitizedName = 'career-hero-'.time().'-'.Str::random(8).'.'.$imageFile->getClientOriginalExtension();

                if (! ImageOptimizer::optimizeAndStore($imageFile, 'career', $sanitizedName, 'public', 1920, 80)) {
                    throw new \RuntimeException("Failed to store career hero image: {$sanitizedName}");
                }

                $settings->hero_image = $sanitizedName;

                if ($previousImage) {
                    Storage::disk('public')->delete('career/'.$previousImage);
                }
            }

            $settings->save();

            return redirect()->route('career-settings')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('career-settings')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function removeHeroImage()
    {
        $settings = CareerSetting::current();
        $previousImage = $settings->getRawOriginal('hero_image');

        if ($previousImage) {
            Storage::disk('public')->delete('career/'.$previousImage);
            $settings->hero_image = null;
            $settings->save();
        }

        return redirect()->route('career-settings')->with('success', 'Operation Successful');
    }

    // ─────────────────────────────────────────────────────────────
    //  CMS — Job Posts
    // ─────────────────────────────────────────────────────────────

    public function jobs()
    {
        return Inertia::render('cms/career/Jobs', [
            'jobs' => JobPost::withCount('applications')->latest()->get(),
            'jobTypes' => JobPost::JOB_TYPES,
        ]);
    }

    private function jobValidationRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'job_type' => ['required', 'string', Rule::in(JobPost::JOB_TYPES)],
            'vacancies' => ['required', 'integer', 'min:1', 'max:9999'],
            'experience' => ['required', 'string', 'max:255'],
            'salary' => ['required', 'string', 'max:255'],
            'deadline' => ['required', 'date'],
            'description' => ['required', 'string', 'max:100000'],
            'notification_email' => ['required', 'email', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    private function jobPayload(Request $request): array
    {
        $description = RichTextSanitizer::clean($request->input('description'));

        if (RichTextSanitizer::isBlank($description)) {
            throw ValidationException::withMessages([
                'description' => 'The job description field is required.',
            ]);
        }

        return array_merge(
            $request->only(['title', 'department', 'location', 'job_type', 'vacancies', 'experience', 'salary', 'deadline', 'notification_email']),
            [
                'description' => $description,
                'is_active' => $request->boolean('is_active'),
            ],
        );
    }

    public function storeJob(Request $request)
    {
        $request->validate($this->jobValidationRules());
        $payload = $this->jobPayload($request);

        try {
            JobPost::create($payload);

            return redirect()->route('career-jobs')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('career-jobs')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function updateJob(Request $request)
    {
        $request->validate(array_merge(
            ['job_post_id' => ['required', 'exists:job_posts,id']],
            $this->jobValidationRules(),
        ));
        $payload = $this->jobPayload($request);

        try {
            JobPost::findOrFail($request->input('job_post_id'))->update($payload);

            return redirect()->route('career-jobs')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('career-jobs')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function toggleJob(Request $request)
    {
        $request->validate(['job_post_id' => ['required', 'exists:job_posts,id']]);

        $job = JobPost::findOrFail($request->input('job_post_id'));
        $job->is_active = ! $job->is_active;
        $job->save();

        return redirect()->route('career-jobs')->with('success', $job->is_active ? 'Job post activated' : 'Job post deactivated');
    }

    public function destroyJob(Request $request)
    {
        $request->validate(['job_post_id' => ['required', 'exists:job_posts,id']]);

        try {
            // Applications are kept: the FK is nullOnDelete and each
            // application stores its own job_title snapshot.
            JobPost::findOrFail($request->input('job_post_id'))->delete();

            return redirect()->route('career-jobs')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('career-jobs')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  CMS — Applications
    // ─────────────────────────────────────────────────────────────

    public function applications()
    {
        return Inertia::render('cms/career/Applications', [
            'applications' => JobApplication::latest()->paginate(10),
        ]);
    }

    public function downloadCv(JobApplication $application)
    {
        $path = $application->cvStoragePath();

        abort_unless(Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->download($path, $application->cv_original_name);
    }

    public function destroyApplication(Request $request)
    {
        $request->validate(['application_id' => ['required', 'exists:job_applications,id']]);

        try {
            DB::transaction(function () use ($request) {
                $application = JobApplication::findOrFail($request->input('application_id'));
                $path = $application->cvStoragePath();

                $application->delete();

                // Remove the CV file; if it can't be removed, roll back so the
                // record and the file never get out of sync.
                $disk = Storage::disk('local');
                if ($disk->exists($path) && ! $disk->delete($path)) {
                    throw new \RuntimeException('Could not delete the CV file from storage.');
                }
            });

            return redirect()->back()->with('success', 'Application deleted');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }
}
