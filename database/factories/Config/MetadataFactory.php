<?php

namespace Database\Factories\Config;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Config\Metadata>
 */
class MetadataFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'meta_description'                        => $this->faker->optional()->sentence(),
            'meta_keyword'                            => $this->faker->optional()->words(5, true),
            'meta_og_description'                     => $this->faker->optional()->sentence(),
            'meta_og_image'                           => $this->faker->optional()->imageUrl(1200, 630),
            'meta_twitter_description'                => $this->faker->optional()->sentence(),
            'meta_twitter_image'                      => $this->faker->optional()->imageUrl(1200, 600),
            'meta_twitter_image_alt'                  => $this->faker->optional()->sentence(4),
            'meta_apple_mobile_web_app_status_bar_style' => $this->faker->optional()->randomElement(['default', 'black', 'black-translucent']),
            'meta_apple_touch_icon'                   => $this->faker->optional()->imageUrl(180, 180),
            'metadatable_id'                          => null, // Will be set by forProject() or in seeder
            'metadatable_type'                        => \App\Models\Properties\Project::class,
        ];
    }

    public function forProject(\App\Models\Properties\Project $project): static
    {
        return $this->state(fn(array $attributes) => [
            'metadatable_id'   => $project->project_id,
            'metadatable_type' => \App\Models\Properties\Project::class,
        ]);
    }
}
