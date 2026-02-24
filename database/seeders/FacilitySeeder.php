<?php

namespace Database\Seeders;

use App\Models\Config\Facility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facilities = [
            ['name' => 'Swimming Pool'],
            ['name' => 'Gymnasium'],
            ['name' => 'Rooftop Garden'],
            ['name' => 'Children Playground'],
            ['name' => 'Community Hall'],
            ['name' => 'Power Backup'],
            ['name' => 'CCTV Surveillance'],
            ['name' => 'Intercom'],
            ['name' => 'Lift'],
            ['name' => 'Car Parking'],
            ['name' => 'Security Guard'],
            ['name' => 'Library'],
            ['name' => 'Cafeteria'],
            ['name' => 'Jogging Track'],
            ['name' => 'Badminton Court'],
            ['name' => 'Basketball Court'],
            ['name' => 'Indoor Games Room'],
            ['name' => 'Spa & Wellness Center'],
            ['name' => 'Steam Room'],
            ['name' => 'Conference Room'],
        ];

        foreach ($facilities as $facility) {
            Facility::firstOrCreate($facility);
        }
    }
}
