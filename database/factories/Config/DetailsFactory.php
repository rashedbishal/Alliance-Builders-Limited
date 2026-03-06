<?php

namespace Database\Factories\Config;

use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Config\Details>
 */
class DetailsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'apartment_size'      => $this->faker->numberBetween(600, 4000),
            'bedroom'             => $this->faker->numberBetween(1, 6),
            'bathroom'            => $this->faker->numberBetween(1, 4),
            'balcony'             => $this->faker->numberBetween(0, 3),
            'kitchen'             => $this->faker->numberBetween(1, 2),
            'living_dining'       => $this->faker->numberBetween(1, 2),
            'parking'             => $this->faker->numberBetween(0, 3),
            'garage_no'           => $this->faker->optional()->numberBetween(1, 4),
            'garage_size'         => $this->faker->optional()->numberBetween(100, 500),
            'apartment_direction' => $this->faker->randomElement(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']),
            'youtube_video_id'    => $this->faker->optional()->regexify('[A-Za-z0-9_\-]{11}'),
            'detailable_id'       => null, // Will be set by forProject() or in seeder
            'detailable_type'     => \App\Models\Properties\Project::class,
        ];
    }

    public function forProject(\App\Models\Properties\Project $project): static
    {
        return $this->state(fn(array $attributes) => [
            'detailable_id'   => $project->project_id,
            'detailable_type' => \App\Models\Properties\Project::class,
        ]);
    }
}
