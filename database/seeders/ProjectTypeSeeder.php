<?php

namespace Database\Seeders;

use App\Models\Config\ProjectType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Handover Project'],
            ['name' => 'Ongoing Project'],
            ['name' => 'Upcoming Project'],
            ['name' => 'Hotels & Resorts'],
        ];

        foreach ($types as $type) {
            ProjectType::firstOrCreate($type);
        }
    }
}
