<?php

namespace Database\Factories\Properties;

use App\Models\Config\ProjectType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Properties\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);

        return [
            'name'                   => ucwords($name),
            'location'               => $this->faker->city(),
            'google_map_url'         => $this->faker->url(),
            'floors'                 => $this->faker->numberBetween(5, 40) . ' Floors',
            'size'                   => $this->faker->numberBetween(500, 5000) . ' sqft',
            'description'            => $this->faker->paragraphs(3, true),
            'surroundings'           => $this->faker->paragraph(),
            'price'                  => $this->faker->numberBetween(1000000, 50000000),
            'construction_start_date'=> $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'handover_date'          => $this->faker->dateTimeBetween('now', '+5 years')->format('Y-m-d'),
            'isFeatured'             => $this->faker->boolean(),
            'project_id'             => strtoupper(Str::random(4)) . '-' . $this->faker->unique()->numerify('####'),
            'project_type_id'        => ProjectType::inRandomOrder()->first()->id ?? 1,
            'slug'                  => Str::slug($name),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn(array $attributes) => [
            'isFeatured' => true,
        ]);
    }

    public function notFeatured(): static
    {
        return $this->state(fn(array $attributes) => [
            'isFeatured' => false,
        ]);
    }
}
