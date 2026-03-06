<?php

namespace Database\Seeders;

use App\Models\Config\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'Luxury Apartments', 'description' => 'High-end luxury residential properties'],
            ['name' => 'Affordable Housing', 'description' => 'Budget-friendly residential options'],
            ['name' => 'Commercial Space', 'description' => 'Office and retail spaces'],
            ['name' => 'Waterfront Property', 'description' => 'Properties with water views'],
            ['name' => 'Green Building', 'description' => 'Eco-friendly and sustainable buildings'],
            ['name' => 'Smart Home', 'description' => 'Technology-enabled residences'],
            ['name' => 'Gated Community', 'description' => 'Secure residential communities'],
            ['name' => 'High Rise', 'description' => 'Tall building developments'],
            ['name' => 'Family Friendly', 'description' => 'Ideal for families with children'],
            ['name' => 'Investment Property', 'description' => 'Great for investment purposes'],
        ];

        foreach ($tags as $tag) {
            $tag['slug'] = Str::slug($tag['name']);
            Tag::firstOrCreate(['name' => $tag['name']], $tag);
        }
    }
}
