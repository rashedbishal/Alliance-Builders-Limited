<?php

namespace Database\Seeders;

use App\Models\Config\Details;
use App\Models\Config\Facility;
use App\Models\Config\Location;
use App\Models\Config\Metadata;
use App\Models\Config\ProjectType;
use App\Models\Config\Tag;
use App\Models\Properties\Project;
use App\Models\Releases\MediaCoverage;
use App\Models\Releases\Popup;
use App\Models\User;
use App\Models\Visual\Carousel;
use App\Models\Visual\Gallery;
use App\Models\Visual\Image;
use App\Models\Visual\ProjectImage;
use App\Models\Visual\Video;
use Database\Factories\Config\ProjectTypeFactory;
use Database\Factories\Visual\CarouselFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed all fixed data using dedicated seeders
        $this->call([
            ProjectTypeSeeder::class,
            CarouselSeeder::class,
            FacilitySeeder::class,
            LocationSeeder::class,
            TagSeeder::class,
            GallerySeeder::class,
        ]);

        // 2. Get all fixed data for relationships
        $projectTypes = ProjectType::all();
        $tags         = Tag::all();
        $facilities   = Facility::all();
        $locations    = Location::all();
        $galleries    = Gallery::all();

        // 3. Seed galleries
        foreach ($galleries as $gallery) {
            Image::factory(5)->forGallery($gallery)->create();
            Video::factory(5)->forGallery($gallery)->create();
        }

        // 4. Seed media coverages with images
        $mediaCoverages = MediaCoverage::factory(5)->create();
        foreach ($mediaCoverages as $mediaCoverage) {
            Image::factory()->forMediaCoverage($mediaCoverage)->create();
            Video::factory()->forMediaCoverage($mediaCoverage)->create();
        }

        // 5. Seed popups with images
        $popups = Popup::factory(3)->create();
        foreach ($popups as $popup) {
            Image::factory(1)->forPopup($popup)->create();
            Video::factory(1)->forPopup($popup)->create();
        }

        // 6. Seed projects with all relationships
        $projects = Project::factory(10)
            ->recycle($projectTypes)
            ->create();

        foreach ($projects as $project) {
            // Project images (using ProjectImage model for specific project images)
            ProjectImage::factory(4)->forProject($project)->create();

            // Optional: Add polymorphic images to projects (if you want to use Image model too)
            Image::factory()->forProject($project)->create();

            Video::factory()->forProject($project)->create();

            // Details (one per project)
            Details::factory()->forProject($project)->create();

            // Metadata (one per project)
            Metadata::factory()->forProject($project)->create();

            // Attach tags (many-to-many)
            $project->tags()->attach(
                $tags->random(rand(2, 5))->pluck('id')
            );

            // Attach facilities (many-to-many)
            $project->facilities()->attach(
                $facilities->random(rand(3, 7))->pluck('id')
            );

            // Attach locations (many-to-many)
            $project->locations()->attach(
                $locations->random(rand(1, 3))->pluck('id')
            );
        }
    }
}
