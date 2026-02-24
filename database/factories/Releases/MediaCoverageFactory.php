<?php

namespace Database\Factories\Releases;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Releases\MediaCoverage>
 */
class MediaCoverageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'media_title'    => $this->faker->sentence(5),
            'media_type'     => $this->faker->randomElement(['newspaper', 'online', 'tv', 'magazine', 'radio']),
            'news_hyperlink' => $this->faker->url(),
            'isFeatured'     => false,
        ];
    }
}
