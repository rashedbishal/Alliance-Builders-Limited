<?php

namespace Database\Factories\Visual;

use App\Models\Visual\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visual\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'path'           => $this->faker->numerify('video-###') . '.mp4',
            'title'          => $this->faker->optional()->sentence(4),
            'description'    => $this->faker->optional()->sentence(),
            'videoable_id'   => null, // Will be set by forGallery() or other methods
            'videoable_type' => Gallery::class,
        ];
    }

    public function forGallery(Gallery $gallery): static
    {
        return $this->state(fn(array $attributes) => [
            'videoable_id'   => $gallery->id,
            'videoable_type' => Gallery::class,
        ]);
    }

    public function forMediaCoverage(\App\Models\Releases\MediaCoverage $mediaCoverage): static
    {
        return $this->state(fn(array $attributes) => [
            'videoable_id'   => $mediaCoverage->id,
            'videoable_type' => \App\Models\Releases\MediaCoverage::class,
        ]);
    }

    public function forPopup(\App\Models\Releases\Popup $popup): static
    {
        return $this->state(fn(array $attributes) => [
            'videoable_id'   => $popup->id,
            'videoable_type' => \App\Models\Releases\Popup::class,
        ]);
    }

    public function forProject(\App\Models\Properties\Project $project): static
    {
        return $this->state(fn(array $attributes) => [
            'videoable_id'   => $project->project_id,
            'videoable_type' => \App\Models\Properties\Project::class,
        ]);
    }
}
