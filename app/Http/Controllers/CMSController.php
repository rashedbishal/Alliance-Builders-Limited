<?php

namespace App\Http\Controllers;

use App\Models\Config\Details;
use App\Models\Config\Facility;
use App\Models\Config\LegalPage;
use App\Models\Config\Location;
use App\Models\Config\ProjectType;
use App\Models\Config\SiteSetting;
use App\Models\Config\Tag;
use App\Models\Inquiry\Contact;
use App\Models\Properties\Project;
use App\Models\Releases\MediaCoverage;
use App\Models\Releases\Popup;
use App\Models\Visual\Carousel;
use App\Models\Visual\Gallery;
use App\Models\Visual\Image;
use App\Models\Visual\ProjectImage;
use App\Models\Visual\Testimonial;
use App\Models\Visual\Video;
use App\Services\ImageOptimizer;
use App\Services\RichTextSanitizer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class CMSController extends Controller
{
    /**
     * Shared validation rules for project/unit-detail fields, enforced
     * server-side since the CMS form's own constraints (number ranges,
     * fixed direction dropdown, date ordering) can be bypassed client-side.
     */
    private function projectDetailValidationRules(): array
    {
        return [
            'price' => 'nullable|integer|min:0',
            'floors' => ['nullable', 'regex:/^G\+[0-9]{1,2}$/'],
            'size' => 'nullable|integer|min:100|max:50000',
            'apartment_size' => 'nullable|integer|min:100|max:50000',
            'garage_size' => 'nullable|integer|min:100|max:50000',
            'bedroom' => 'nullable|integer|min:0|max:10',
            'bathroom' => 'nullable|integer|min:1|max:10',
            'apartment_direction' => 'nullable|in:North,North-East,East,South-East,South,South-West,West,North-West',
            'construction_start_date' => 'nullable|date',
            'handover_date' => 'nullable|date|after:construction_start_date',
            'description' => 'nullable|string|max:300',
            'surroundings' => 'nullable|string|max:500',
            'google_map_url' => 'nullable|url|max:2048',
            'youtube_video_id' => ['nullable', 'regex:/^[A-Za-z0-9_-]{11}$/'],
        ];
    }

    private function projectDetailValidationMessages(): array
    {
        return [
            'floors.regex' => 'Please enter a valid number of floors (0-99).',
            'google_map_url.url' => 'Please enter a valid URL (e.g. https://maps.google.com/...).',
            'youtube_video_id.regex' => 'Please enter a valid YouTube video ID (11 characters, e.g. dQw4w9WgXcQ) — not a full URL.',
        ];
    }

    /**
     * The map/video fields are rendered directly into an <iframe> src on the
     * frontend, which only works with an embed-shaped URL: a normal
     * Google Maps share/place link (or a full YouTube watch/share URL, if
     * pasted instead of the bare video ID) silently fails to embed. Rewrite
     * both into the shape the frontend actually needs before validating.
     */
    private function normalizeMediaLinks(Request $request): void
    {
        $request->merge([
            'google_map_url' => $this->normalizeGoogleMapUrl($request->input('google_map_url')),
            'youtube_video_id' => $this->extractYoutubeId($request->input('youtube_video_id')),
        ]);
    }

    private function extractYoutubeId(?string $value): ?string
    {
        if (! $value) {
            return $value;
        }

        $value = trim($value);

        if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/', $value, $matches)) {
            return $matches[1];
        }

        return $value;
    }

    private function normalizeGoogleMapUrl(?string $value): ?string
    {
        if (! $value) {
            return $value;
        }

        $value = trim($value);

        if (str_contains($value, 'output=embed') || str_contains($value, '/maps/embed')) {
            return $value;
        }

        $resolved = $this->resolveShortenedMapUrl($value);

        if (
            preg_match('/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/', $resolved, $matches)
            || preg_match('/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/', $resolved, $matches)
            || preg_match('/@(-?\d+\.\d+),(-?\d+\.\d+)/', $resolved, $matches)
        ) {
            return "https://www.google.com/maps?q={$matches[1]},{$matches[2]}&output=embed";
        }

        return $value;
    }

    /**
     * A pasted maps.app.goo.gl / goo.gl short link carries no coordinates
     * in the URL itself - they only appear after following the redirect.
     * Resolve it server-side (restricted to Google's own short-link hosts)
     * so the coordinate extraction above has something to match against.
     */
    private function resolveShortenedMapUrl(string $url): string
    {
        $host = parse_url($url, PHP_URL_HOST) ?? '';

        if (! str_ends_with($host, 'goo.gl')) {
            return $url;
        }

        try {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_NOBODY => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_MAXREDIRS => 5,
                CURLOPT_TIMEOUT => 5,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_USERAGENT => 'Mozilla/5.0',
            ]);
            curl_exec($ch);
            $effectiveUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
            curl_close($ch);

            return $effectiveUrl ?: $url;
        } catch (\Throwable) {
            return $url;
        }
    }

    public function carousel()
    {
        //        return view('carousel.index');
        $carousels = Carousel::with('project:id,name,slug')->select('id', 'property_name', 'description', 'image', 'project_id')->get();
        $projects = Project::select('id', 'name', 'slug')->orderBy('name')->get();

        return Inertia::render('cms/carousel/Index', ['carousels' => $carousels, 'projects' => $projects]);
    }

    public function propertyAdd()
    {
        $types = ProjectType::select('id', 'name')->get();
        $locations = Location::select('id', 'name')->get();
        $facilities = Facility::select('id', 'name')->get();
        $tags = Tag::select('id', 'name')->get();

        //        return view('property.add', compact('types', 'locations', 'facilities', 'tags'));
        return Inertia::render('cms/property/Add', compact('types', 'locations', 'facilities', 'tags'));
    }

    public function propertyUpdate()
    {
        $types = ProjectType::select('id', 'name')->get();
        $locations = Location::select('id', 'name')->get();
        $facilities = Facility::select('id', 'name')->get();
        $tags = Tag::select('id', 'name')->get();
        $projects = Project::with('tags', 'details', 'projectImages', 'facilities', 'location')->get();

        //        return view('property.update', compact('types', 'locations', 'facilities', 'tags', 'projects'));
        return Inertia::render('cms/property/Update', compact('types', 'locations', 'facilities', 'tags'));
    }

    public function propertyByType(Request $request)
    {
        return Project::where('project_type_id', $request->type)
            ->select('id', 'name')
            ->get();
    }

    public function propertyData($id)
    {
        return Project::with('tags', 'details', 'projectImages', 'facilities', 'location', 'image')->where('id', $id)->first();
    }

    public function propertyRemove()
    {
        $types = ProjectType::select('id', 'name')->get();
        $projects = Project::with('tags', 'details', 'projectImages', 'facilities', 'location')->get();

        //        return view('property.remove', compact('types', 'projects'));
        return Inertia::render('cms/property/Remove', compact('types'));
    }

    public function mediaAdd()
    {
        //        return view('media.add');
        return Inertia::render('cms/media/Add');
    }

    public function mediaRemove()
    {
        $mediaItems = MediaCoverage::with('image')->paginate(7);

        //        return view('media.remove', compact('mediaItems'));
        return Inertia::render('cms/media/Remove', compact('mediaItems'));
    }

    public function mediaEdit()
    {
        $mediaItems = MediaCoverage::with('image')->select('id', 'media_title', 'media_type', 'news_hyperlink', 'isFeatured')->get();

        return Inertia::render('cms/media/Edit', compact('mediaItems'));
    }

    public function galleryAdd()
    {
        $types = Gallery::select('id', 'type')->get();

        //        return view('gallery.add', compact('types'));
        return Inertia::render('cms/gallery/Add', compact('types'));
    }

    public function galleryRemove()
    {
        $types = Gallery::with('images', 'videos')->select('id', 'type')->get();

        //        return view('gallery.remove', compact('types'));
        return Inertia::render('cms/gallery/Remove', compact('types'));
    }

    public function popupAdd()
    {
        $popup = Popup::findOrFail(1);

        //        return view('popup.index', compact('popup'));
        return Inertia::render('cms/popup/Index', compact('popup'));
    }

    public function updateCarousel(Request $request)
    {
        $request->validate([
            'image' => 'nullable|file|mimes:webp',
            'project_id' => 'nullable|exists:projects,id',
            'property_name' => 'required|string|max:100',
            'description' => 'required|string|max:150',
        ]);
        switch ($request->input('position')) {
            case '1':
                $carouselData = Carousel::findOrFail(1);
                break;
            case '2':
                $carouselData = Carousel::findOrFail(2);
                break;
            case '3':
                $carouselData = Carousel::findOrFail(3);
                break;
            case '4':
                $carouselData = Carousel::findOrFail(4);
                break;
            case '5':
                $carouselData = Carousel::findOrFail(5);
                break;
            default:
                abort(500);
        }

        $carouselData->property_name = trim($request->input('property_name'));
        $carouselData->description = trim($request->input('description'));
        $carouselData->project_id = $request->input('project_id') ? (int) $request->input('project_id') : null;
        $carouselData->save();

        try {

            if ($request->hasFile('image')) {
                $imageFile = $request->file('image');

                // Unique filename per upload so the CDN/browser cache can't keep
                // serving a previous image under the same URL.
                $sanitizedName = "carousel-image-{$request->input('position')}-".now()->timestamp.'-'.Str::random(8).'.'.$imageFile->getClientOriginalExtension();

                $previousImage = $carouselData->getRawOriginal('image');

                if (! ImageOptimizer::optimizeAndStore($imageFile, 'home/carousel', $sanitizedName, 'public', 1920, 80)) {
                    throw new \RuntimeException('Failed to store the uploaded image.');
                }

                if ($previousImage) {
                    Storage::disk('public')->delete("home/carousel/{$previousImage}");
                }

                // IMPORTANT: store only filename because model accessor adds the path
                $carouselData->image = $sanitizedName;
            }

            $carouselData->save();

            return redirect()->route('dashboard')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function saveProperty(Request $request)
    {
        $this->normalizeMediaLinks($request);

        $request->validate(array_merge([
            'thumbnail' => 'nullable|file|mimes:webp',
            'project_images.*' => 'nullable|file|mimes:webp',
        ], $this->projectDetailValidationRules()), $this->projectDetailValidationMessages());

        try {
            DB::transaction(function () use ($request) {
                $project = new Project;
                $project->name = $request->input('name');
                $project->address = $request->input('address');
                $project->google_map_url = $request->input('google_map_url');
                $project->price = $request->input('price');
                $project->size = $request->input('size');
                $project->floors = $request->input('floors');
                $project->construction_start_date = $request->input('construction_start_date');
                $project->handover_date = $request->input('handover_date');
                $project->isFeatured = $request->input('isFeatured');
                $project->description = $request->input('description');
                $project->surroundings = $request->input('surroundings');
                $project->project_type_id = $request->input('project_type_id');
                $project->location_id = $request->input('location_id');
                $project->project_id = $request->input('project_id');
                $project->project_type_id = $request->input('project_type_id');
                $project->save();

                $details = new Details;
                $details->apartment_size = $request->input('apartment_size');
                $details->bedroom = $request->input('bedroom');
                $details->bathroom = $request->input('bathroom');
                $details->balcony = $request->input('balcony');
                $details->kitchen = $request->input('kitchen');
                $details->living_dining = $request->input('living_dining');
                $details->parking = $request->input('parking');
                $details->garage_no = $request->input('garage_no');
                $details->garage_size = $request->input('garage_size');
                $details->apartment_direction = $request->input('apartment_direction');
                $details->youtube_video_id = $request->input('youtube_video_id');
                $project->details()->save($details);

                if ($request->has('facilities')) {
                    $project->facilities()->sync($request->facilities);
                }

                if ($request->has('tags')) {
                    $project->tags()->sync($request->tags);
                }

                if ($request->hasFile('thumbnail')) {
                    $imageFile = $request->file('thumbnail');
                    $sanitizedName = $project->slug.'-thumbnail-'.time().'-'.Str::random(8).'.'.$imageFile->getClientOriginalExtension();
                    if (! ImageOptimizer::optimizeAndStore($imageFile, 'properties/propertyThumbs', $sanitizedName, 'public', 1000, 80)) {
                        throw new \RuntimeException("Failed to store thumbnail image: {$sanitizedName}");
                    }

                    $image = new Image;
                    $image->path = $sanitizedName;
                    $image->project()->associate($project);
                    $image->save();
                }

                if ($request->hasFile('project_images')) {
                    foreach ($request->file('project_images') as $imageFile) {

                        // Unique name for each image to avoid conflicts
                        $sanitizedName = $project->slug.'-'.time().'-'.uniqid().'.'.
                            $imageFile->getClientOriginalExtension();

                        $storagePath = $project->projectType->storageFolder();
                        // Store in a separate folder (recommended)
                        if (! ImageOptimizer::optimizeAndStore($imageFile, $storagePath, $sanitizedName, 'public', 1920, 80)) {
                            throw new \RuntimeException("Failed to store project image: {$sanitizedName}");
                        }

                        // Save each image to Image model
                        $image = new ProjectImage;
                        $image->image = $sanitizedName;
                        $image->project()->associate($project);
                        $image->save();
                    }
                }
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function updateProperty(Request $request)
    {
        $this->normalizeMediaLinks($request);

        $request->validate(array_merge([
            'thumbnail' => 'nullable|file|mimes:webp',
            'project_images.*' => 'nullable|file|mimes:webp',
        ], $this->projectDetailValidationRules()), $this->projectDetailValidationMessages());

        try {
            DB::transaction(function () use ($request) {
                $project = Project::findOrFail($request->input('project_id_db'));
                $project->name = $request->input('name');
                $project->address = $request->input('address');
                $project->google_map_url = $request->input('google_map_url');
                $project->price = $request->input('price');
                $project->size = $request->input('size');
                $project->floors = $request->input('floors');
                $project->construction_start_date = $request->input('construction_start_date');
                $project->handover_date = $request->input('handover_date');
                $project->isFeatured = $request->input('isFeatured') ?? false;
                $project->description = $request->input('description');
                $project->surroundings = $request->input('surroundings');
                $project->project_type_id = $request->input('project_type_id');
                $project->location_id = $request->input('location_id');
                $project->project_id = $request->input('project_id');
                $project->save();
                $project->details->apartment_size = $request->input('apartment_size');
                $project->details->bedroom = $request->input('bedroom');
                $project->details->bathroom = $request->input('bathroom');
                $project->details->balcony = $request->input('balcony');
                $project->details->kitchen = $request->input('kitchen');
                $project->details->living_dining = $request->input('living_dining');
                $project->details->parking = $request->input('parking');
                $project->details->garage_no = $request->input('garage_no');
                $project->details->garage_size = $request->input('garage_size');
                $project->details->apartment_direction = $request->input('apartment_direction');
                $project->details->youtube_video_id = $request->input('youtube_video_id');
                $project->details->save();

                if ($request->has('facilities')) {
                    $project->facilities()->sync($request->facilities);
                }

                if ($request->has('tags')) {
                    $project->tags()->sync($request->tags);
                }

                if ($request->hasFile('thumbnail')) {

                    $previousThumbnail = $project->image?->getRawOriginal('path');

                    $imageFile = $request->file('thumbnail');
                    $sanitizedName = $project->slug.'-thumbnail-'.time().'-'.Str::random(8).'.'.$imageFile->getClientOriginalExtension();
                    if (! ImageOptimizer::optimizeAndStore($imageFile, 'properties/propertyThumbs', $sanitizedName, 'public', 1000, 80)) {
                        throw new \RuntimeException("Failed to store thumbnail image: {$sanitizedName}");
                    }

                    if ($previousThumbnail) {
                        Storage::disk('public')->delete("properties/propertyThumbs/{$previousThumbnail}");
                    }

                    $image = $project->image ?: new Image;
                    $image->path = $sanitizedName;
                    $image->project()->associate($project);
                    $image->save();
                }

                if ($request->hasFile('project_images')) {
                    foreach ($request->file('project_images') as $imageFile) {

                        // Unique name for each image to avoid conflicts
                        $sanitizedName = $project->slug.'-'.time().'-'.uniqid().'.'.
                            $imageFile->getClientOriginalExtension();

                        $storagePath = $project->projectType->storageFolder();
                        // Store in a separate folder (recommended)
                        if (! ImageOptimizer::optimizeAndStore($imageFile, $storagePath, $sanitizedName, 'public', 1920, 80)) {
                            throw new \RuntimeException("Failed to store project image: {$sanitizedName}");
                        }

                        // Save each image to Image model
                        $image = new ProjectImage;
                        $image->image = $sanitizedName;
                        $image->project()->associate($project);
                        $image->save();
                    }
                }
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }

    }

    public function destroyPropertyImage(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $image = ProjectImage::with('project.projectType')->findOrFail($request->input('image_id'));

                $storagePath = $image->project?->projectType?->storageFolder() ?? 'properties/projectImages';

                $filename = $image->getRawOriginal('image');

                if (Storage::disk('public')->exists($storagePath.'/'.$filename)) {
                    Storage::disk('public')->delete($storagePath.'/'.$filename);
                }

                $image->delete();
            });

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroyProperty(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $project = Project::with('projectType')->findOrFail($request->input('project_db_id'));
                if ($project->image && Storage::disk('public')->exists(path: 'properties/propertyThumbs'.'/'.$project->image->getRawOriginal('path'))) {
                    Storage::disk('public')->delete('properties/propertyThumbs'.'/'.$project->image->getRawOriginal('path'));
                }

                $storagePath = $project->projectType->storageFolder();

                foreach ($project->projectImages as $projectImage) {
                    if (Storage::disk('public')->exists(path: $storagePath.'/'.$projectImage->getRawOriginal('image'))) {
                        Storage::disk('public')->delete($storagePath.'/'.$projectImage->getRawOriginal('image'));
                    }
                }

                $project->delete();
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function saveMedia(Request $request)
    {
        $request->validate([
            'media_title' => 'required|string|max:255',
            'media_type' => 'required|string|max:255',
            'news_hyperlink' => 'required|string|max:1048|url',
            'image' => 'required|file|mimes:webp',
        ], [
            'media_title.required' => 'Please enter a media title.',
            'media_type.required' => 'Please enter a media type.',
            'news_hyperlink.required' => 'Please enter a news hyperlink.',
            'news_hyperlink.url' => 'Please enter a valid URL (e.g. https://example.com/article).',
            'image.required' => 'Please upload an image.',
            'image.mimes' => 'Only WEBP images are allowed.',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $isFeatured = (bool) $request->input('isFeatured');

                if ($isFeatured) {
                    MediaCoverage::where('isFeatured', true)->update(['isFeatured' => false]);
                }

                $media = new MediaCoverage;
                $media->media_title = $request->input('media_title');
                $media->media_type = $request->input('media_type');
                $media->news_hyperlink = $request->input('news_hyperlink');
                $media->isFeatured = $isFeatured;
                $media->save();

                if ($request->hasFile('image')) {
                    $imageFile = $request->file('image');
                    $sanitizedName = Str::slug($media->media_title).'-'.uniqid().'.'.$imageFile->getClientOriginalExtension();
                    ImageOptimizer::optimizeAndStore($imageFile, 'media', $sanitizedName, 'public', 1200, 80);

                    $image = new Image;
                    $image->path = $sanitizedName;
                    $image->project()->associate($media);
                    $image->save();
                }
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function updateMedia(Request $request)
    {
        $request->validate([
            'media_id' => 'required|exists:media_coverages,id',
            'media_title' => 'required|string|max:255',
            'media_type' => 'required|string|max:255',
            'news_hyperlink' => 'required|string|max:1048|url',
            'image' => 'nullable|file|mimes:webp',
        ], [
            'media_id.required' => 'Please select a media entry to edit.',
            'media_id.exists' => 'The selected media entry no longer exists.',
            'media_title.required' => 'Please enter a media title.',
            'media_type.required' => 'Please enter a media type.',
            'news_hyperlink.required' => 'Please enter a news hyperlink.',
            'news_hyperlink.url' => 'Please enter a valid URL (e.g. https://example.com/article).',
            'image.mimes' => 'Only WEBP images are allowed.',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $media = MediaCoverage::with('image')->findOrFail($request->input('media_id'));
                $isFeatured = (bool) $request->input('isFeatured');

                if ($isFeatured) {
                    MediaCoverage::where('isFeatured', true)->where('id', '!=', $media->id)->update(['isFeatured' => false]);
                }

                $media->media_title = $request->input('media_title');
                $media->media_type = $request->input('media_type');
                $media->news_hyperlink = $request->input('news_hyperlink');
                $media->isFeatured = $isFeatured;
                $media->save();

                if ($request->hasFile('image')) {
                    if ($media->image && Storage::disk('public')->exists('media/'.$media->image->getRawOriginal('path'))) {
                        Storage::disk('public')->delete('media/'.$media->image->getRawOriginal('path'));
                    }

                    $imageFile = $request->file('image');
                    $sanitizedName = Str::slug($media->media_title).'-'.uniqid().'.'.$imageFile->getClientOriginalExtension();
                    ImageOptimizer::optimizeAndStore($imageFile, 'media', $sanitizedName, 'public', 1200, 80);

                    if ($media->image) {
                        $media->image->path = $sanitizedName;
                        $media->image->save();
                    } else {
                        $image = new Image;
                        $image->path = $sanitizedName;
                        $image->project()->associate($media);
                        $image->save();
                    }
                }
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function destroyMedia(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $item = MediaCoverage::findOrFail($request->input('media_item_id'));

                if ($item->image && Storage::disk('public')->exists(path: 'media'.'/'.$item->image->getRawOriginal('path'))) {
                    Storage::disk('public')->delete('media'.'/'.$item->image->getRawOriginal('path'));
                }

                $item->delete();

            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function saveGallery(Request $request)
    {
        $request->validate([
            'gallery_type' => 'required|exists:galleries,id',
            'media_type' => 'required|in:1,2',
            'title' => 'required|string|max:64',
            'description' => 'nullable|string|max:512',
            'gallery_content' => $request->input('media_type') == '1'
                ? 'required|file|mimes:webp|max:300'
                : 'required|file|mimes:mp4,mov,avi|max:51200',
        ], [
            'gallery_type.required' => 'Please select a gallery type.',
            'gallery_type.exists' => 'The selected gallery type is invalid.',
            'media_type.required' => 'Please select a media type.',
            'media_type.in' => 'The selected media type is invalid.',
            'title.required' => 'Please enter a title.',
            'title.max' => 'Title must not exceed 64 characters.',
            'description.max' => 'Description must not exceed 512 characters.',
            'gallery_content.mimes' => $request->input('media_type') == '1'
                ? 'Only WEBP images are allowed.'
                : 'Only MP4, MOV, or AVI video files are allowed.',
            'gallery_content.max' => $request->input('media_type') == '1'
                ? 'Maximum allowed image size is 300KB.'
                : 'Maximum allowed video size is 50MB.',
        ]);

        try {
            DB::transaction(function () use ($request) {
                if ($request->hasFile('gallery_content')) {
                    $imageFile = $request->file('gallery_content');
                    $sanitizedName = uniqid().'.'.$imageFile->getClientOriginalExtension();

                    if ($request->input('media_type') == '1') {
                        $storagePath = match ($request->input('gallery_type')) {
                            '1' => 'gallery/project-handover',
                            '2' => 'gallery/project-inauguration',
                            '3' => 'gallery/construction-images',
                            '4' => 'gallery/event-activity',
                            default => 'properties/projectImages',
                        };
                        ImageOptimizer::optimizeAndStore($imageFile, $storagePath, $sanitizedName, 'public', 1920, 80);

                        $image = new Image;
                        $image->path = $sanitizedName;
                        $image->title = $request->input('title');
                        $image->description = $request->input('description');
                        $image->gallery()->associate(Gallery::findOrFail($request->input('gallery_type')));
                        $image->save();
                    } else {

                        $storagePath = match ($request->input('gallery_type')) {
                            '1' => 'video/project-handover',
                            '2' => 'video/project-inauguration',
                            '3' => 'video/construction-images',
                            '4' => 'video/event-activity',
                            default => 'properties/projectImages',
                        };
                        $imageFile->storeAs($storagePath, $sanitizedName, 'public');

                        $video = new Video;
                        $video->path = $sanitizedName;
                        $video->title = $request->input('title');
                        $video->description = $request->input('description');
                        $video->gallery()->associate(Gallery::findOrFail($request->input('gallery_type')));
                        $video->save();
                    }
                }
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function destroyGallery(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                if ($request->input('media_type') == '1') {
                    $image = Image::findOrFail($request->input('gallery_item_id'));
                    $storagePath = match ($image->gallery?->id) {
                        1 => 'gallery/project-handover',
                        2 => 'gallery/project-inauguration',
                        3 => 'gallery/construction-images',
                        4 => 'gallery/event-activity',
                        default => 'gallery/trash',
                    };

                    if (Storage::disk('public')->exists(path: $storagePath.'/'.$image->getRawOriginal('path'))) {
                        Storage::disk('public')->delete($storagePath.'/'.$image->getRawOriginal('path'));
                    }

                    $image->delete();

                } else {
                    $video = Video::findOrFail($request->input('gallery_item_id'));
                    $storagePath = match ($video->gallery?->id) {
                        1 => 'video/project-handover',
                        2 => 'video/project-inauguration',
                        3 => 'video/construction-images',
                        4 => 'video/event-activity',
                        default => 'video/trash',
                    };

                    if (Storage::disk('public')->exists(path: $storagePath.'/'.$video->getRawOriginal('path'))) {
                        Storage::disk('public')->delete($storagePath.'/'.$video->getRawOriginal('path'));
                    }

                    $video->delete();
                }
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function savePopup(Request $request)
    {
        $request->validate([
            'image' => 'nullable|file|mimes:webp',
        ]);

        try {
            DB::transaction(function () use ($request) {

                $popup = Popup::findOrFail(1);
                $popup->isEnabled = $request->input('isEnabled') ?? false;
                $popup->save();

                if ($request->hasFile('image')) {
                    $imageFile = $request->file('image');
                    $previousImage = $popup->getRawOriginal('imagePath');

                    $sanitizedName = 'popup-'.time().'-'.Str::random(8).'.'.$imageFile->getClientOriginalExtension();
                    if (! ImageOptimizer::optimizeAndStore($imageFile, 'popup', $sanitizedName, 'public', 1200, 80)) {
                        throw new \RuntimeException("Failed to store popup image: {$sanitizedName}");
                    }

                    if ($previousImage && Storage::disk('public')->exists('popup/'.$previousImage)) {
                        Storage::disk('public')->delete('popup/'.$previousImage);
                    }

                    $popup->imagePath = $sanitizedName;
                    $popup->save();
                }
            });

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function settingsIndex()
    {
        return Inertia::render('cms/settings/Index', [
            'settings' => SiteSetting::firstOrCreate(['id' => 1]),
            'admin' => [
                'email' => auth()->user()->email,
            ],
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'header_phone' => 'nullable|string|max:30',
            'footer_phone' => 'nullable|string|max:30',
            'footer_email' => 'nullable|email|max:255',
            'whatsapp_number' => 'nullable|string|max:30',
            'messenger_link' => 'nullable|string|max:255',
        ]);

        $settings = SiteSetting::firstOrCreate(['id' => 1]);
        $settings->update($request->only([
            'header_phone',
            'footer_phone',
            'footer_email',
            'whatsapp_number',
            'messenger_link',
        ]));

        return redirect()->route('settings-index')->with('success', 'Operation Successful');
    }

    public function updateAdminCredentials(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        $user->email = $request->input('email');

        if ($request->filled('password')) {
            $user->password = $request->input('password');
        }

        $user->save();

        return redirect()->route('settings-index')->with('success', 'Login credentials updated successfully.');
    }

    public function legalPagesIndex()
    {
        return Inertia::render('cms/legal/Index', [
            'pages' => LegalPage::whereIn('slug', LegalPage::SLUGS)
                ->get()
                ->sortBy(fn ($page) => array_search($page->slug, LegalPage::SLUGS))
                ->values(),
        ]);
    }

    public function updateLegalPage(Request $request, string $slug)
    {
        abort_unless(in_array($slug, LegalPage::SLUGS, true), 404);

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:100000'],
        ]);

        $content = RichTextSanitizer::clean($request->input('content'));

        if (RichTextSanitizer::isBlank($content)) {
            throw ValidationException::withMessages([
                'content' => 'The content field is required.',
            ]);
        }

        LegalPage::updateOrCreate(
            ['slug' => $slug],
            ['title' => $request->input('title'), 'content' => $content]
        );

        return redirect()->back()->with('success', 'Operation Successful');
    }

    public function testimonialIndex()
    {
        return Inertia::render('cms/testimonial/Index', [
            'testimonials' => Testimonial::orderBy('id')->get(),
        ]);
    }

    public function storeTestimonial(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'role' => 'nullable|string|max:100',
            'company' => 'nullable|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'quote' => 'required|string|max:1000',
            'property_type' => 'nullable|string|max:100',
            'image' => 'nullable|file|mimes:webp',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $testimonial = new Testimonial($request->only([
                    'name', 'role', 'company', 'rating', 'quote', 'property_type',
                ]));
                $testimonial->save();

                if ($request->hasFile('image')) {
                    $imageFile = $request->file('image');
                    $sanitizedName = 'testimonial-'.$testimonial->id.'-'.time().'-'.Str::random(8).'.'.$imageFile->getClientOriginalExtension();

                    if (! ImageOptimizer::optimizeAndStore($imageFile, 'testimonials', $sanitizedName, 'public', 600, 80)) {
                        throw new \RuntimeException("Failed to store testimonial image: {$sanitizedName}");
                    }

                    $testimonial->image = $sanitizedName;
                    $testimonial->save();
                }
            });

            return redirect()->route('testimonial-index')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('testimonial-index')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function updateTestimonial(Request $request)
    {
        $request->validate([
            'testimonial_id' => 'required|exists:testimonials,id',
            'name' => 'required|string|max:100',
            'role' => 'nullable|string|max:100',
            'company' => 'nullable|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'quote' => 'required|string|max:1000',
            'property_type' => 'nullable|string|max:100',
            'image' => 'nullable|file|mimes:webp',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $testimonial = Testimonial::findOrFail($request->input('testimonial_id'));
                $testimonial->fill($request->only([
                    'name', 'role', 'company', 'rating', 'quote', 'property_type',
                ]));
                $testimonial->save();

                if ($request->hasFile('image')) {
                    $imageFile = $request->file('image');
                    $previousImage = $testimonial->getRawOriginal('image');

                    $sanitizedName = 'testimonial-'.$testimonial->id.'-'.time().'-'.Str::random(8).'.'.$imageFile->getClientOriginalExtension();
                    if (! ImageOptimizer::optimizeAndStore($imageFile, 'testimonials', $sanitizedName, 'public', 600, 80)) {
                        throw new \RuntimeException("Failed to store testimonial image: {$sanitizedName}");
                    }

                    if ($previousImage && ! str_starts_with($previousImage, 'http')) {
                        Storage::disk('public')->delete('testimonials/'.$previousImage);
                    }

                    $testimonial->image = $sanitizedName;
                    $testimonial->save();
                }
            });

            return redirect()->route('testimonial-index')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('testimonial-index')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function destroyTestimonial(Request $request)
    {
        $request->validate([
            'testimonial_id' => 'required|exists:testimonials,id',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $testimonial = Testimonial::findOrFail($request->input('testimonial_id'));
                $previousImage = $testimonial->getRawOriginal('image');

                if ($previousImage && ! str_starts_with($previousImage, 'http')) {
                    Storage::disk('public')->delete('testimonials/'.$previousImage);
                }

                $testimonial->delete();
            });

            return redirect()->route('testimonial-index')->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            return redirect()->route('testimonial-index')->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function facilityAdd()
    {
        return Inertia::render('cms/facility/Add', [
            'facilities' => Facility::orderBy('name')->get(),
        ]);
    }

    public function facilityStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Facility::create(['name' => $request->name]);

        return redirect()->route('facility-add')
            ->with('success', 'Facility added successfully.');
    }

    public function facilityUpdate()
    {
        return Inertia::render('cms/facility/Update', [
            'facilities' => Facility::orderBy('name')->get(),
        ]);
    }

    public function facilityUpdateStore(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:facilities,id',
            'name' => 'required|string|max:255',
        ]);

        Facility::findOrFail($request->id)->update(['name' => $request->name]);

        return redirect()->route('facility-update')
            ->with('success', 'Facility updated successfully.');
    }

    public function facilityDelete()
    {
        return Inertia::render('cms/facility/Delete', [
            'facilities' => Facility::orderBy('name')->get(),
        ]);
    }

    public function facilityDestroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:facilities,id',
        ]);

        Facility::findOrFail($request->id)->delete();

        return redirect()->route('facility-delete')
            ->with('success', 'Facility deleted successfully.');
    }

    // ═══════════════════════════════════════════════════════════════
    // TAG CONFIG
    // ═══════════════════════════════════════════════════════════════

    public function tagAdd()
    {
        return Inertia::render('cms/tag/Add', [
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    public function tagStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
            'description' => 'nullable|string|max:1048',
        ]);

        Tag::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('tag-add')
            ->with('success', 'Tag added successfully.');
    }

    public function tagUpdate()
    {
        return Inertia::render('cms/tag/Update', [
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    public function tagUpdateStore(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:tags,id',
            'name' => 'required|string|max:255|unique:tags,name,'.$request->id,
            'description' => 'nullable|string|max:1048',
        ]);

        Tag::findOrFail($request->id)->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('tag-update')
            ->with('success', 'Tag updated successfully.');
    }

    public function tagDelete()
    {
        return Inertia::render('cms/tag/Delete', [
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    public function tagDestroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:tags,id',
        ]);

        Tag::findOrFail($request->id)->delete();

        return redirect()->route('tag-delete')
            ->with('success', 'Tag deleted successfully.');
    }

    public function feedbackIndex()
    {
        $feedbacks = Contact::latest()->paginate(5);

        return inertia('cms/contact/Feedback', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function feedbackDownload(Request $request)
    {
        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->from)->startOfDay();
        $to = Carbon::parse($request->to)->endOfDay();

        $rows = Contact::whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'phone', 'message', 'created_at']);

        // ── Build spreadsheet with PhpSpreadsheet (no extra package needed) ──
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Feedback');

        // Header row
        $headers = ['#', 'Name', 'Email', 'Phone', 'Message', 'Submitted At'];
        foreach ($headers as $col => $header) {
            $cell = chr(65 + $col).'1';
            $sheet->setCellValue($cell, $header);
            $sheet->getStyle($cell)->getFont()->setBold(true);
        }

        // Data rows
        foreach ($rows as $i => $row) {
            $r = $i + 2;
            $sheet->setCellValue("A{$r}", $i + 1);
            $sheet->setCellValue("B{$r}", $row->name);
            $sheet->setCellValue("C{$r}", $row->email);
            $sheet->setCellValue("D{$r}", $row->phone);
            $sheet->setCellValue("E{$r}", $row->message);
            $sheet->setCellValue("F{$r}", $row->created_at->format('d M Y, h:i A'));
        }

        // Auto-size columns
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $filename = 'feedback_'.$request->from.'_to_'.$request->to.'.xlsx';

        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
