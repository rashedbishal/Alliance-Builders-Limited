<?php

namespace Database\Factories\Visual;

use App\Models\Visual\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visual\Gallery>
 */
class GalleryFactory extends Factory
{
    protected $model = Gallery::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement([
                'Project Handover',
                'Project Inauguration',
                'Construction Images',
                'Events & Activities',
            ]),
        ];
    }
}
