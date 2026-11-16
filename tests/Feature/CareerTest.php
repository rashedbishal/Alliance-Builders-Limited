<?php

namespace Tests\Feature;

use App\Mail\JobApplicationReceived;
use App\Models\Career\CareerSetting;
use App\Models\Career\JobApplication;
use App\Models\Career\JobPost;
use App\Models\User;
use App\Services\RichTextSanitizer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CareerTest extends TestCase
{
    use RefreshDatabase;

    private const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
        Mail::fake();
        RateLimiter::clear('career-apply:127.0.0.1');
    }

    private function job(array $overrides = []): JobPost
    {
        return JobPost::create(array_merge([
            'title' => 'Site Engineer',
            'description' => '<p>Build things.</p>',
            'is_active' => true,
        ], $overrides));
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'job_post_id' => '',
            'custom_position' => '',
            'name' => 'Rahim Uddin',
            'phone' => '01712345678',
            'email' => 'rahim@example.com',
            'message' => 'I would like to apply.',
            'cv' => UploadedFile::fake()->create('my-cv.pdf', 200, 'application/pdf'),
        ], $overrides);
    }

    /** A complete, valid CMS job post form submission. */
    private function jobForm(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Accountant',
            'department' => 'Finance',
            'location' => 'Dhaka Head Office',
            'job_type' => 'Full-time',
            'vacancies' => 2,
            'experience' => '3-5 years',
            'salary' => 'Negotiable',
            'deadline' => today()->addWeek()->toDateString(),
            'description' => '<p>Keep the books.</p>',
            'notification_email' => 'hr@example.com',
            'is_active' => true,
        ], $overrides);
    }

    // ── Public page ────────────────────────────────────────────

    public function test_career_page_renders_and_is_not_swallowed_by_property_catch_all(): void
    {
        $this->get('/career')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Career')
                ->has('jobs', 0)
                ->where('settings.heading', 'Build Your Career With Us'));
    }

    public function test_only_active_and_unexpired_jobs_are_listed(): void
    {
        $open = $this->job(['title' => 'Open']);
        $this->job(['title' => 'No deadline', 'deadline' => null]);
        $this->job(['title' => 'Due today', 'deadline' => today()]);
        $this->job(['title' => 'Inactive', 'is_active' => false]);
        $this->job(['title' => 'Expired', 'deadline' => today()->subDay()]);

        $this->get('/career')->assertInertia(fn (Assert $page) => $page
            ->has('jobs', 3)
            ->where('jobs', fn ($jobs) => collect($jobs)->pluck('title')->sort()->values()->all() === ['Due today', 'No deadline', 'Open'])
            ->missing('jobs.0.notification_email'));
    }

    // ── Applying ───────────────────────────────────────────────

    public function test_application_for_listed_job_is_saved_and_emailed_to_job_email(): void
    {
        $job = $this->job(['notification_email' => 'hr@example.com']);

        $this->post('/career', $this->payload(['job_post_id' => $job->id]))
            ->assertSessionHasNoErrors();

        $application = JobApplication::sole();
        $this->assertSame($job->id, $application->job_post_id);
        $this->assertSame('Site Engineer', $application->job_title);
        $this->assertSame('my-cv.pdf', $application->cv_original_name);
        Storage::disk('local')->assertExists($application->cvStoragePath());
        Storage::disk('public')->assertDirectoryEmpty('/');

        Mail::assertSent(JobApplicationReceived::class, fn ($mail) => $mail->hasTo('hr@example.com')
            && $mail->application->is($application));
    }

    public function test_applicant_email_is_optional(): void
    {
        $job = $this->job(['notification_email' => 'hr@example.com']);

        $this->post('/career', $this->payload(['job_post_id' => $job->id, 'email' => '']))
            ->assertSessionHasNoErrors();

        $application = JobApplication::sole();
        $this->assertNull($application->email);
        Mail::assertSent(JobApplicationReceived::class, fn ($mail) => $mail->hasTo('hr@example.com')
            && $mail->replyTo === []);

        RateLimiter::clear('career-apply:127.0.0.1');
        $this->post('/career', $this->payload(['job_post_id' => $job->id, 'email' => 'not-an-email']))
            ->assertSessionHasErrors('email');
    }

    public function test_no_email_is_sent_when_job_has_no_notification_email(): void
    {
        CareerSetting::current()->update(['default_email' => 'careers@example.com']);
        $job = $this->job(['notification_email' => null]);

        $this->post('/career', $this->payload(['job_post_id' => $job->id]))
            ->assertSessionHasNoErrors();

        $this->assertSame(1, JobApplication::count());
        Mail::assertNothingSent();
    }

    public function test_custom_position_goes_to_default_email_when_set(): void
    {
        CareerSetting::current()->update(['default_email' => 'careers@example.com']);

        $this->post('/career', $this->payload(['custom_position' => 'Architect']))
            ->assertSessionHasNoErrors();

        $application = JobApplication::sole();
        $this->assertNull($application->job_post_id);
        $this->assertSame('Architect', $application->job_title);
        Mail::assertSent(JobApplicationReceived::class, fn ($mail) => $mail->hasTo('careers@example.com'));
    }

    public function test_custom_position_without_default_email_sends_nothing(): void
    {
        $this->post('/career', $this->payload(['custom_position' => 'Architect']))
            ->assertSessionHasNoErrors();

        $this->assertSame(1, JobApplication::count());
        Mail::assertNothingSent();
    }

    public function test_docx_cv_is_accepted(): void
    {
        $this->post('/career', $this->payload([
            'custom_position' => 'Accountant',
            'cv' => UploadedFile::fake()->create('cv.docx', 100, self::DOCX_MIME),
        ]))->assertSessionHasNoErrors();

        $this->assertStringEndsWith('.docx', JobApplication::sole()->cv_path);
    }

    public function test_position_is_required(): void
    {
        $this->post('/career', $this->payload())
            ->assertSessionHasErrors('custom_position');

        $this->assertSame(0, JobApplication::count());
    }

    public function test_cannot_apply_to_inactive_or_expired_job(): void
    {
        $inactive = $this->job(['is_active' => false]);
        $expired = $this->job(['deadline' => today()->subDay()]);

        $this->post('/career', $this->payload(['job_post_id' => $inactive->id]))
            ->assertSessionHasErrors('job_post_id');
        $this->post('/career', $this->payload(['job_post_id' => $expired->id]))
            ->assertSessionHasErrors('job_post_id');

        $this->assertSame(0, JobApplication::count());
    }

    public function test_phone_must_be_valid_bangladeshi_mobile(): void
    {
        foreach (['0171234567', '017123456789', '01212345678', '+8801712345678', '8801712345678', '0171234567a'] as $phone) {
            RateLimiter::clear('career-apply:127.0.0.1');
            $this->post('/career', $this->payload(['custom_position' => 'X', 'phone' => $phone]))
                ->assertSessionHasErrors('phone');
        }

        foreach (['01312345678', '01912345678'] as $phone) {
            RateLimiter::clear('career-apply:127.0.0.1');
            $this->post('/career', $this->payload(['custom_position' => 'X', 'phone' => $phone]))
                ->assertSessionHasNoErrors();
        }
    }

    public function test_cv_must_be_pdf_or_docx_and_at_most_5mb(): void
    {
        $bad = [
            UploadedFile::fake()->create('cv.doc', 100, 'application/msword'),
            UploadedFile::fake()->create('cv.txt', 100, 'text/plain'),
            UploadedFile::fake()->create('cv.png', 100, 'image/png'),
            // Right extension, wrong content type.
            UploadedFile::fake()->create('cv.pdf', 100, 'image/png'),
            UploadedFile::fake()->create('cv.pdf', 5121, 'application/pdf'),
        ];

        foreach ($bad as $file) {
            RateLimiter::clear('career-apply:127.0.0.1');
            $this->post('/career', $this->payload(['custom_position' => 'X', 'cv' => $file]))
                ->assertSessionHasErrors('cv');
        }

        $this->assertSame(0, JobApplication::count());
        $this->assertSame([], Storage::disk('local')->allFiles());
    }

    public function test_application_is_saved_even_if_mail_fails(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP down'));
        $job = $this->job(['notification_email' => 'hr@example.com']);

        $this->post('/career', $this->payload(['job_post_id' => $job->id]))
            ->assertSessionHasNoErrors();

        $this->assertSame(1, JobApplication::count());
    }

    public function test_applications_are_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->post('/career', $this->payload(['custom_position' => 'X']))
                ->assertSessionHasNoErrors();
        }

        $this->post('/career', $this->payload(['custom_position' => 'X']))
            ->assertSessionHasErrors('form');

        $this->assertSame(5, JobApplication::count());
    }

    // ── CMS ────────────────────────────────────────────────────

    public function test_cms_career_routes_require_authentication(): void
    {
        $this->get('/cms/career/settings')->assertRedirect(route('login'));
        $this->get('/cms/career/jobs')->assertRedirect(route('login'));
        $this->get('/cms/career/applications')->assertRedirect(route('login'));
        $this->post('/cms/career/jobs/store', [])->assertRedirect(route('login'));
        $this->post('/cms/career/applications/destroy', [])->assertRedirect(route('login'));
    }

    public function test_cv_download_requires_authentication(): void
    {
        $this->post('/career', $this->payload(['custom_position' => 'X']));
        $application = JobApplication::sole();

        $this->get(route('career-application-cv', $application))->assertRedirect(route('login'));

        $this->actingAs(User::factory()->create())
            ->get(route('career-application-cv', $application))
            ->assertOk()
            ->assertDownload('my-cv.pdf');
    }

    public function test_cms_pages_render(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get('/cms/career/settings')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('cms/career/Settings', false));
        $this->get('/cms/career/jobs')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('cms/career/Jobs', false));
        $this->get('/cms/career/applications')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('cms/career/Applications', false)
                ->missing('applications.data.0.cv_path'));
    }

    public function test_admin_can_create_job_and_description_is_sanitized(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('career-job-store'), $this->jobForm([
            'description' => '<h2>About</h2><p onclick="x()">Hi <strong>there</strong></p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://example.com">good</a>',
        ]))->assertSessionHasNoErrors()->assertRedirect(route('career-jobs'));

        $job = JobPost::sole();
        $this->assertStringNotContainsString('<script', $job->description);
        $this->assertStringNotContainsString('onclick', $job->description);
        $this->assertStringNotContainsString('javascript:', $job->description);
        $this->assertStringContainsString('<h2>About</h2>', $job->description);
        $this->assertStringContainsString('<strong>there</strong>', $job->description);
        $this->assertStringContainsString('href="https://example.com"', $job->description);
    }

    public function test_job_description_cannot_be_blank_html(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('career-job-store'), $this->jobForm([
            'description' => '<p></p><script>x</script>',
        ]))->assertSessionHasErrors('description');

        $this->assertSame(0, JobPost::count());
    }

    public function test_all_job_post_fields_are_required(): void
    {
        $this->actingAs(User::factory()->create());

        $fields = ['title', 'department', 'location', 'job_type', 'vacancies', 'experience', 'salary', 'deadline', 'description', 'notification_email'];

        $this->post(route('career-job-store'), array_fill_keys($fields, '') + ['is_active' => true])
            ->assertSessionHasErrors($fields);

        $this->assertSame(0, JobPost::count());
    }

    public function test_admin_can_update_and_toggle_job(): void
    {
        $this->actingAs(User::factory()->create());
        $job = $this->job();

        $this->post(route('career-job-update'), $this->jobForm([
            'job_post_id' => $job->id,
            'title' => 'Senior Site Engineer',
            'description' => '<p>Updated</p>',
        ]))->assertSessionHasNoErrors();
        $this->assertSame('Senior Site Engineer', $job->fresh()->title);

        $this->post(route('career-job-toggle'), ['job_post_id' => $job->id]);
        $this->assertFalse($job->fresh()->is_active);
    }

    public function test_deleting_job_keeps_its_applications(): void
    {
        $job = $this->job();
        $this->post('/career', $this->payload(['job_post_id' => $job->id]));
        $application = JobApplication::sole();

        $this->actingAs(User::factory()->create())
            ->post(route('career-job-destroy'), ['job_post_id' => $job->id])
            ->assertRedirect(route('career-jobs'));

        $this->assertSame(0, JobPost::count());
        $application->refresh();
        $this->assertNull($application->job_post_id);
        $this->assertSame('Site Engineer', $application->job_title);
        Storage::disk('local')->assertExists($application->cvStoragePath());
    }

    public function test_deleting_application_removes_cv_file(): void
    {
        $this->post('/career', $this->payload(['custom_position' => 'X']));
        $application = JobApplication::sole();
        $path = $application->cvStoragePath();
        Storage::disk('local')->assertExists($path);

        $this->actingAs(User::factory()->create())
            ->post(route('career-application-destroy'), ['application_id' => $application->id])
            ->assertSessionHas('success');

        $this->assertSame(0, JobApplication::count());
        Storage::disk('local')->assertMissing($path);
    }

    public function test_admin_can_update_settings_and_hero_image(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('career-settings-update'), [
            'heading' => 'Work With Us',
            'subtitle' => 'Intro',
            'no_openings_message' => 'Nothing right now.',
            'default_email' => 'careers@example.com',
            'hero_image' => UploadedFile::fake()->create('hero.webp', 100, 'image/webp'),
        ])->assertSessionHasNoErrors();

        $settings = CareerSetting::current();
        $this->assertSame('Work With Us', $settings->heading);
        $this->assertSame('careers@example.com', $settings->default_email);
        $stored = $settings->getRawOriginal('hero_image');
        $this->assertNotNull($stored);
        Storage::disk('public')->assertExists('career/'.$stored);

        $this->post(route('career-settings-update'), [
            'heading' => 'Work With Us',
            'hero_image' => UploadedFile::fake()->create('hero.jpg', 100, 'image/jpeg'),
        ])->assertSessionHasErrors('hero_image');

        $this->post(route('career-settings-remove-image'));
        $this->assertNull(CareerSetting::current()->getRawOriginal('hero_image'));
        Storage::disk('public')->assertMissing('career/'.$stored);
    }

    public function test_sanitizer_keeps_only_safe_color_and_font_size_styles(): void
    {
        $html = RichTextSanitizer::clean(
            '<h2><span style="color: #EF4444; font-size: 24px">Red</span></h2>'
            .'<p><span style="color: rgb(51, 95, 230)">Blue</span>'
            .'<span style="background:url(x); color: expression(alert(1)); font-size: 999px">bad</span>'
            .'<span style="position:fixed;top:0">fixed</span>'
            .'<p style="color: red">para</p>'
            .'<span onclick="a()" style="font-size: 14px">ok</span></p>'
        );

        $this->assertStringContainsString('<span style="color: #ef4444; font-size: 24px">Red</span>', $html);
        $this->assertStringContainsString('<span style="color: rgb(51, 95, 230)">Blue</span>', $html);
        $this->assertStringContainsString('<span>bad</span>', $html);
        $this->assertStringContainsString('<span>fixed</span>', $html);
        $this->assertStringContainsString('<span style="font-size: 14px">ok</span>', $html);
        foreach (['url(', 'expression', '999px', 'position', 'onclick', '<p style'] as $bad) {
            $this->assertStringNotContainsString($bad, $html);
        }
    }

    public function test_sanitizer_blank_detection(): void
    {
        $this->assertTrue(RichTextSanitizer::isBlank('<p></p>'));
        $this->assertTrue(RichTextSanitizer::isBlank('<p>&nbsp;</p>'));
        $this->assertFalse(RichTextSanitizer::isBlank('<p>Hello</p>'));
    }

    public function test_email_contains_candidate_details_and_cv_attachment(): void
    {
        $this->post('/career', $this->payload(['custom_position' => 'Architect']));
        $application = JobApplication::sole();

        $mailable = new JobApplicationReceived($application);
        $mailable->assertSeeInHtml('Rahim Uddin');
        $mailable->assertSeeInHtml('01712345678');
        $mailable->assertSeeInHtml('rahim@example.com');
        $mailable->assertSeeInHtml('Architect');
        $mailable->assertSeeInHtml('I would like to apply.');
        $mailable->assertHasReplyTo('rahim@example.com');
        $this->assertCount(1, $mailable->attachments());
    }
}
