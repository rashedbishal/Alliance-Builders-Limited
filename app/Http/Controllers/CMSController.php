<?php

namespace App\Http\Controllers;

use App\Models\Config\Location;
use App\Models\Properties\Project;
use App\Models\Visual\Image;
use App\Models\Visual\ProjectImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CMSController extends Controller
{
    public function cImageUpdater(Request $request)
    {
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
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

                return redirect()->route('dashboard');
            } catch (\Exception $e) {
                dd($e);
            }
        }
    }

    public function projectSaver(Request $request)
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
            $project->project_id = $request->input('project_id');
            $project->save();

            $location = Location::findOrFail($request->input('location'));
            $location->projects()->save($project);

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
                        1 => 'properties/handoverProject',
                        2 => 'properties/ongoingProject',
                        3 => 'properties/upcomingProject',
                        4 => 'properties/HotelsResorts',
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

            return redirect()->back();
        } catch (\Exception $e) {
            dd($e);
        }
    }
}
