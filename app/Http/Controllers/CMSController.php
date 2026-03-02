<?php

namespace App\Http\Controllers;

use App\Models\Config\Details;
use App\Models\Config\Facility;
use App\Models\Config\Location;
use App\Models\Config\ProjectType;
use App\Models\Config\Tag;
use App\Models\Properties\Project;
use App\Models\Releases\MediaCoverage;
use App\Models\Visual\Carousel;
use App\Models\Visual\Gallery;
use App\Models\Visual\Image;
use App\Models\Visual\ProjectImage;
use App\Models\Visual\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CMSController extends Controller
{
    public function carousel()
    {
        return view('carousel.index');
    }

    public function projectAdd()
    {
        $types = ProjectType::select('id', 'name')->get();
        $locations = Location::select('id', 'name')->get();
        $facilities = Facility::select('id', 'name')->get();
        $tags = Tag::select('id', 'name')->get();

        return view('project.add', compact('types', 'locations', 'facilities', 'tags'));
    }

    public function projectUpdate()
    {
        $types = ProjectType::select('id', 'name')->get();
        $locations = Location::select('id', 'name')->get();
        $facilities = Facility::select('id', 'name')->get();
        $tags = Tag::select('id', 'name')->get();
        $projects = Project::with('tags', 'details', 'projectImages', 'facilities', 'location')->get();

        return view('project.update', compact('types', 'locations', 'facilities', 'tags', 'projects'));
    }

    public function projectByType(Request $request)
    {
        return Project::where('project_type_id', $request->type)
            ->select('id', 'name')
            ->get();
    }

    public function projectData($id)
    {
        return Project::findOrFail($id);
    }

    public function updateCarousel(Request $request)
    {
        $carouselData = '';
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

        $carouselData->property_name = $request->input('property_name') ?? ' ';
        $carouselData->description = $request->input('description') ?? ' ';
        $carouselData->save();

        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $request->validate([
                'image' => 'required|image|mimes:webp|max:250',
            ]);
            try {
                DB::transaction(function () use ($request, $imageFile) {
                    $sanitizedName = '';
                    switch ($request->input('position')) {
                        case '1':
                            $sanitizedName = 'carousel-image-1'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '2':
                            $sanitizedName = 'carousel-image-2'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '3':
                            $sanitizedName = 'carousel-image-3'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '4':
                            $sanitizedName = 'carousel-image-4'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '5':
                            $sanitizedName = 'carousel-image-5'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        default:
                            abort(500);
                    }

                    if (Storage::disk('public')->exists('home/carousel'.'/'.$sanitizedName)) {
                        Storage::disk('public')->delete('home/carousel'.'/'.$sanitizedName);
                    }

                    $imageFile->storeAs('home/carousel', $sanitizedName, 'public');
                });

                return redirect()->back()->with('success', 'Operation Successful');
            } catch (\Exception $e) {
                redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
            }
        }
    }

    public function saveProject(Request $request)
    {
        try {
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
                $sanitizedName = $project->slug.'-thumbnail.'.$imageFile->getClientOriginalExtension();
                $imageFile->storeAs('properties/propertyThumbs', $sanitizedName, 'public');

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

                    $storagePath = match ($project->project_type_id) {
                        '1' => 'properties/handoverProject',
                        '2' => 'properties/ongoingProject',
                        '3' => 'properties/upcomingProject',
                        '4' => 'properties/hotelsResorts',
                        default => 'properties/projectImages',
                    };
                    // Store in a separate folder (recommended)
                    $imageFile->storeAs($storagePath, $sanitizedName, 'public');

                    // Save each image to Image model
                    $image = new ProjectImage;
                    $image->image = $sanitizedName;
                    $image->project()->associate($project);
                    $image->save();
                }
            }

            return redirect()->back()->with('success', 'Operation Successful');
        } catch (\Exception $e) {
            redirect()->back()->with('error', 'Operation Failed: '.$e->getMessage());
        }
    }

    public function mediaSaver(Request $request)
    {
        $media = new MediaCoverage;
        $media->media_title = $request->input('media_title');
        $media->media_type = $request->input('media_type');
        $media->news_hyperlink = $request->input('news_hyperlink');
        $media->isFeatured = $request->input('isFeatured') ?? 0;
        $media->save();

        if ($request->hasFile('cover_image')) {
            $imageFile = $request->file('cover_image');
            $sanitizedName = Str::slug($media->media_title).'-thumbnail.'.$imageFile->getClientOriginalExtension();
            $imageFile->storeAs('media', $sanitizedName, 'public');

            $image = new Image;
            $image->path = $sanitizedName;
            $image->project()->associate($media);
            $image->save();
        }

        return redirect()->back();
    }

    public function gallerySaver(Request $request)
    {
        if ($request->hasFile('media_file')) {
            $imageFile = $request->file('media_file');
            $sanitizedName = uniqid().'.'.$imageFile->getClientOriginalExtension();

            if ($request->input('media_type') == '1') {
                $storagePath = match ($request->input('gallery_type')) {
                    '1' => 'gallery/project-handover',
                    '2' => 'gallery/project-inauguration',
                    '3' => 'gallery/construction-images',
                    '4' => 'gallery/event-activity',
                    default => 'properties/projectImages',
                };
                $imageFile->storeAs($storagePath, $sanitizedName, 'public');

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

        return redirect()->back();
    }
}
