<?php

namespace Database\Seeders;

use App\Models\Visual\Carousel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CarouselSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carousels = [
            [
                'property_name' => 'Premium Residency',
                'description' => 'Luxury living at its finest',
                'image' => 'carousel-image-1.jpg',
            ],
            [
                'property_name' => 'Sky Tower',
                'description' => 'Touch the clouds with elegance',
                'image' => 'carousel-image-2.jpg',
            ],
            [
                'property_name' => 'Green Heights',
                'description' => 'Where nature meets modern living',
                'image' => 'carousel-image-3.jpg',
            ],
            [
                'property_name' => 'Royal Gardens',
                'description' => 'Experience royal lifestyle',
                'image' => 'carousel-image-4.jpg',
            ],
            [
                'property_name' => 'City Plaza',
                'description' => 'Prime location, prime lifestyle',
                'image' => 'carousel-image-5.jpg',
            ],
        ];

        foreach ($carousels as $carousel) {
            Carousel::firstOrCreate(['image' => $carousel['image']], $carousel);
        }
    }
}
