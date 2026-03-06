<?php

namespace Database\Factories\Visual;

use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visual\ProjectImage>
 */
class ProjectImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'image'      => $this->faker->numerify('project-image-###') . '.jpg',
            'project_id' => null, // Will be set by forProject() or in seeder
        ];
    }

    public function forProject(\App\Models\Properties\Project $project): static
    {
        return $this->state(fn(array $attributes) => [
            'project_id' => $project->project_id,
        ]);
    }
}
