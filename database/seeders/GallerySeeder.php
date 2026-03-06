<?php

namespace Database\Seeders;

use App\Models\Visual\Gallery;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'type' => 'Project Handover',

            ],
            [
                'type' => 'Project Inauguration',

            ],
            [
                'type' => 'Construction Images',

            ],
            [
                'type' => 'Events & Activities',

            ],
        ];

        foreach ($types as $type) {
            Gallery::firstOrCreate(['type' => $type['type']], $type);
        }
    }
}
