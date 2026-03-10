<?php

namespace App\Http\Controllers;

use App\Models\Config\Location;
use App\Models\Config\ProjectType;
use App\Models\Config\Tag;
use App\Models\Config\Facility;
use App\Models\Inquiry\Contact;
use App\Models\Properties\Project;
use App\Models\Releases\MediaCoverage;
use App\Models\Visual\Carousel;
use App\Models\Visual\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PageController extends Controller
{
    public function home()
    {
        $carousels = Carousel::select('id', 'property_name', 'description', 'image')->get();
        $locations = Location::select('id', 'name')->get();
        $projectTypes = ProjectType::select('id', 'name')->get();
        $tags = Tag::select('id', 'name')->get();
        $projects = Project::with('projectType', 'tags', 'details', 'image', 'location')->where('isFeatured', true)->select('id', 'name', 'address', 'floors', 'size', 'project_id', 'project_type_id', 'location_id', 'slug')->get();

        return Inertia::render('Home', ['carousels' => $carousels, 'locations' => $locations, 'projectTypes' => $projectTypes, 'tags' => $tags, 'projects' => $projects]);
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function services()
    {
        return Inertia::render('Services');
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function directors()
    {
        return Inertia::render('Directors');
    }

    public function directorDetails($id)
    {
        return Inertia::render('DirectorDetails', [
            'id' => $id,
        ]);
    }

    public function managingDirector()
    {
        return Inertia::render('ManagingDirector');
    }

    public function media()
    {
        $contents = MediaCoverage::with('image')->select('id', 'media_title', 'media_type', 'news_hyperlink', 'isFeatured', DB::raw('DATE(created_at) as created_date'))->get();

        return Inertia::render('Media', ['contents' => $contents]);
    }

    public function gallery()
    {
        $galleries = Gallery::with('images', 'videos')->select('id', 'type')->get();

        return Inertia::render('Gallery', ['galleries' => $galleries]);
    }

    public function properties()
    {
        $projectTypes = ProjectType::select('id', 'name')->get();
        $projects = Project::with('projectType', 'tags', 'details', 'image', 'location')->select('id', 'name', 'address', 'floors', 'size', 'project_id', 'project_type_id', 'location_id', 'slug')->get();

        return Inertia::render('Properties', ['projects' => $projects, 'projectTypes' => $projectTypes]);
    }

    public function propertyDetails(Project $project)
    {
        $projectDetails = Project::with('tags', 'details', 'projectImages', 'facilities', 'location')->where('id', $project->id)->first();

        return Inertia::render('PropertyDetails', [
            'projectDetails' => $projectDetails,
            'allFacilities' => Facility::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function hotelDetails(Project $project)
    {
        // Ensure this is a hotel/resort project
        abort_unless($project->project_type_id === 4, 404);

        $projectDetails = Project::with('tags', 'details', 'projectImages', 'facilities', 'location')
            ->where('id', $project->id)
            ->first();

        return Inertia::render('HotelDetails', [
            'projectDetails' => $projectDetails,
            'allFacilities' => Facility::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function storeContact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'message' => 'required|string|max:5000',
        ]);

        Contact::create($request->only('name', 'email', 'phone', 'message'));

        // Returning back with no redirect keeps Inertia on the same page.
        // The React component handles the success popup itself.
        return back();
    }
}
