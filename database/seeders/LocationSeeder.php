<?php

namespace Database\Seeders;

use App\Models\Config\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            ['name' => 'Dhaka'],
            ['name' => 'Gulshan'],
            ['name' => 'Banani'],
            ['name' => 'Dhanmondi'],
            ['name' => 'Uttara'],
            ['name' => 'Mirpur'],
            ['name' => 'Bashundhara'],
            ['name' => 'Chittagong'],
            ['name' => 'Sylhet'],
            ['name' => 'Cox\'s Bazar'],
        ];

        foreach ($locations as $location) {
            Location::firstOrCreate($location);
        }
    }
}
