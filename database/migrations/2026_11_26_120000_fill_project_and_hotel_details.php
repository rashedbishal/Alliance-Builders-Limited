<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const PROJECT_TYPE = 'App\Models\Properties\Project';

    /**
     * Run the migrations.
     *
     * Fills in project details that were never entered on the live site.
     * Only empty columns are written and nothing is removed, except on the
     * two placeholder hotels (see convertSampleHotels()). Every value fits
     * the CMS validation rules so admins can re-save any project.
     *
     * Sources: Alliance's previous website (alliancebuildersltd.com, 2025,
     * and alliancebuildersltd.org, 2022, via the Wayback Machine), the
     * Hotel Jana investment site (invest.alliancebuildersltd.org) and Jana
     * News coverage. Where a source lists several unit types, the integer
     * fields hold the largest unit and the description states the range.
     */
    public function up(): void
    {
        $this->convertSampleHotels();

        foreach ($this->projects() as $projectId => $data) {
            $this->fillProject($projectId, $data);
        }

        $this->fillGenericDescriptions();
    }

    /**
     * Per-project data, keyed by the stable project_id.
     */
    private function projects(): array
    {
        $oldSiteFacilities = [
            'CCTV Camera', 'Fire Extinguisher', 'Generator', 'Gym', 'Kids Zone', 'Lift',
            'Prayer Room', 'Rooftop Garden', 'Submersible Pump', 'Substation', 'TV Cable',
            'Walkway', 'WiFi', 'Window Coverings', 'Community Hall', 'Rooftop Sitting Arrangement',
        ];

        return [
            // Alliance Angina (ongoing)
            'aa' => [
                'project' => [
                    'address' => '1183/1B, 1186, 1187/4, East Monipur, Mirpur, Dhaka',
                    'google_map_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.491483681447!2d90.3695716!3d23.801116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1068ffe8c4d%3A0x9725d1034e81da2f!2sAlliance%20Angina%20(1183%2C%20Middle%20Monipur)!5e0!3m2!1sen!2sbd!4v1745220259989!5m2!1sen!2sbd',
                    'description' => 'Ongoing residential project at East Monipur, Mirpur, offering 2–3 bedroom apartments of 1,175–1,250 sq ft with lift, generator, substation, CCTV, gym, kids zone, prayer room and a rooftop garden with seating.',
                ],
                'details' => [
                    'apartment_size' => '1250', 'bedroom' => '3', 'bathroom' => '3', 'balcony' => '3',
                    'living_dining' => 'Yes', 'parking' => 'No', 'garage_no' => '1', 'garage_size' => '120',
                    'apartment_direction' => 'North',
                ],
                'facilities' => $oldSiteFacilities,
            ],

            // Alliance Bhai Bhai Tower
            'abb' => [
                'project' => [
                    'address' => 'House 14 (Old 82), Arab Ali Member Road, Dia Bari, Uttara, Dhaka',
                    'google_map_url' => 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3648.4963203332604!2d90.36700499999999!3d23.872013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDUyJzE5LjMiTiA5MMKwMjInMDEuMiJF!5e0!3m2!1sen!2sbd!4v1745127040752!5m2!1sen!2sbd',
                    'description' => 'Residential tower at Dia Bari, Uttara, with north-south facing 3-bedroom apartments of 1,363–1,422 sq ft, car parking, lift, generator, substation, CCTV, prayer room, kids zone and a rooftop garden.',
                ],
                'details' => [
                    'apartment_size' => '1422', 'bedroom' => '3', 'bathroom' => '3', 'balcony' => '3',
                    'living_dining' => 'Yes', 'parking' => 'Available', 'garage_no' => '4', 'garage_size' => '120',
                ],
                'facilities' => array_values(array_diff($oldSiteFacilities, ['Gym', 'Submersible Pump'])),
            ],

            // Alliance Dhupchaya
            'dh' => [
                'project' => [
                    'address' => 'House 222, 212/1/1, West Kazipara, Mirpur, Dhaka',
                    'google_map_url' => 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3650.5144990970043!2d90.375107!3d23.800297000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDQ4JzAxLjEiTiA5MMKwMjInMzAuNCJF!5e0!3m2!1sen!2sbd!4v1745127201018!5m2!1sen!2sbd',
                    'description' => 'Residential project at West Kazipara, Mirpur, with 2–4 bedroom apartments from 820 to 1,628 sq ft facing east, west and south, plus car parking, lift, generator, gym, CCTV and a rooftop garden.',
                ],
                'details' => [
                    'apartment_size' => '1628', 'bedroom' => '4', 'bathroom' => '4', 'balcony' => '3',
                    'living_dining' => 'Yes', 'parking' => 'Available', 'garage_no' => '1', 'garage_size' => '120',
                ],
                'facilities' => $oldSiteFacilities,
            ],

            // Alliance Dil Mohammad Tower
            'dm' => [
                'project' => [
                    'address' => 'House 1179, East Monipur, Mirpur, Dhaka-1216',
                    'google_map_url' => 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d912.622938365883!2d90.3685028!3d23.8011064!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c11101eac349%3A0x6c67c5a9681dcd82!2sAlliance%20Dil%20Mohammad%20Tower!5e0!3m2!1sen!2sbd!4v1745219065740!5m2!1sen!2sbd',
                    'description' => 'Large residential tower at East Monipur, Mirpur, with north-south facing apartments from 1,020 to 2,640 sq ft (2–5 bedrooms), 50 car parking spaces, lift, generator, substation, gym, CCTV and a rooftop garden.',
                ],
                'details' => [
                    'apartment_size' => '2640', 'bedroom' => '5', 'bathroom' => '3', 'balcony' => '3',
                    'living_dining' => 'Yes', 'parking' => 'Available', 'garage_no' => '50', 'garage_size' => '120',
                    'youtube_video_id' => 'qMMcgiRVYbQ',
                ],
                'facilities' => $oldSiteFacilities,
            ],

            // Laila Monjil
            'lm' => [
                'project' => [
                    'address' => 'House 24, Horirampur, Section 1, Mirpur, Dhaka',
                    'description' => 'Ongoing residential project at Horirampur, Mirpur Section 1, with 2–3 bedroom apartments of 770, 1,200 and 1,220 sq ft, car parking, lift, generator, CCTV, gym and a rooftop garden.',
                ],
                'details' => [
                    'apartment_size' => '1220', 'bedroom' => '3', 'bathroom' => '3', 'balcony' => '3',
                    'living_dining' => 'Yes', 'parking' => 'Available', 'garage_no' => '1', 'garage_size' => '120',
                ],
                'facilities' => $oldSiteFacilities,
            ],

            // Bijoy 71 (listed as "Bijay 71" / "Alliance Bijoy Ekattur" on the old sites)
            'b7' => [
                'project' => [
                    'address' => 'House 2 & 3, Lane 01, Block F, Pallabi, Mirpur, Dhaka',
                    'description' => 'Residential project at Block F, Pallabi, Mirpur, near Pallabi Post Office, with south-facing apartments from 830 to 1,695 sq ft (2–4 bedrooms), car parking, lift, generator, intercom and CCTV.',
                ],
                'details' => [
                    'apartment_size' => '1695', 'bedroom' => '4', 'bathroom' => '5', 'balcony' => '4',
                    'kitchen' => 'Yes', 'living_dining' => 'Yes', 'parking' => 'Available', 'garage_no' => '1',
                    'garage_size' => '120', 'apartment_direction' => 'South',
                ],
                'facilities' => array_merge($oldSiteFacilities, ['Intercom']),
            ],

            // Alliance Patoyari ("Patoyari Villa" / "Patowary Villa" on the old sites)
            'ap' => [
                'project' => [
                    'address' => 'House 560, Middle Monipur, Mirpur, Dhaka-1216',
                    'floors' => 'G+8',
                    'handover_date' => '2024-03-06',
                    'description' => 'Nine-storey residential building at Middle Monipur, Mirpur, near the metro rail, with north- and south-facing apartments of 924 sq ft (2 bed) and 1,372–1,400 sq ft (3 bed). Handed over in March 2024.',
                ],
                'details' => [
                    'apartment_size' => '1400', 'bedroom' => '3', 'bathroom' => '3', 'balcony' => '2',
                    'kitchen' => 'Yes', 'living_dining' => 'Yes',
                ],
                'facilities' => ['Generator', 'Intercom', 'Security & Reception'],
            ],

            // Mira Mahal ("Mira Mohol" on the 2025 site)
            'mi' => [
                'project' => [
                    'address' => 'House 83, Janata Road, Moddho Pirerbag, Mirpur, Dhaka-1216',
                    'floors' => 'G+8',
                    'handover_date' => '2024-06-02',
                    'description' => 'Nine-storey residential building at Janata Road, Mirpur, with studio (525 sq ft), 2-bedroom (850–940 sq ft) and 3-bedroom (1,425–1,450 sq ft) apartments and a rooftop garden. Handed over in June 2024.',
                ],
                'details' => [
                    'apartment_size' => '1450', 'bedroom' => '3', 'bathroom' => '3', 'balcony' => '3',
                    'kitchen' => 'Yes', 'living_dining' => 'Yes',
                ],
                'facilities' => ['Generator', 'Intercom', 'Security & Reception', 'Rooftop Garden'],
            ],

            // Alliance Kashem Neer
            'ak' => [
                'project' => [
                    'address' => '76/3, Middle Pirerbag, Mirpur, Dhaka-1216',
                    'description' => 'North-facing residential project at Middle Pirerbag, Mirpur, near the metro rail, with 700 sq ft (2 bed) and 1,400 sq ft (3 bed) apartments, generator, intercom and a staffed security reception.',
                ],
                'details' => [
                    'apartment_size' => '1400', 'bedroom' => '3', 'bathroom' => '3', 'balcony' => '2',
                    'kitchen' => 'Yes', 'living_dining' => 'Yes', 'apartment_direction' => 'North',
                ],
                'facilities' => ['Generator', 'Intercom', 'Security & Reception'],
            ],

            // Alliance Lily
            'al' => [
                'project' => [
                    'address' => 'House 01 & 02, Lane 01, Block D, Mirpur-12, Dhaka',
                    'description' => 'Corner-plot residential building at Block D, Mirpur-12, open on three sides beside a 60-ft road, with apartments of 750 to 1,500 sq ft (up to 4 bedrooms), lift, generator and intercom.',
                ],
                'details' => [
                    'apartment_size' => '1500', 'bedroom' => '4', 'bathroom' => '3', 'balcony' => '2',
                    'living_dining' => 'Yes',
                ],
                'facilities' => ['Generator', 'Intercom', 'Lift'],
            ],

            // Alliance Bonolota
            'abo' => [
                'project' => [
                    'address' => 'House 43-45, Lane 05, Block D, Section 12, Mirpur, Dhaka',
                    'floors' => 'G+7',
                    'handover_date' => '2019-03-30',
                    'description' => 'Eight-storey residential building at Block D, Section 12, Mirpur, handed over to its owners on 30 March 2019.',
                ],
            ],

            // Gardenia
            'ga' => [
                'project' => [
                    'address' => 'House 17 & 19, Lane 31, Block D, Section 12, Mirpur, Dhaka',
                    'floors' => 'G+7',
                    'handover_date' => '2019-03-30',
                    'description' => 'Eight-storey residential building at Lane 31, Block D, Section 12, Mirpur, handed over to its owners on 30 March 2019.',
                ],
            ],

            // Alliance Bilkis
            'ab' => [
                'project' => [
                    'address' => 'House 117/2, East Ahmednagar, Mirpur-1, Dhaka-1216',
                    'description' => 'Completed residential building at East Ahmednagar, Mirpur-1, by Alliance Builders Ltd. All apartments have been sold.',
                ],
            ],

            // Alliance Moshafor ("Alliance Mosaraf Villa" on the 2022 site)
            'am' => [
                'project' => [
                    'address' => 'Senpara Porbata, Mirpur-10, Dhaka-1216',
                    'description' => 'Completed residential building at Senpara Porbata, Mirpur-10, by Alliance Builders Ltd. All apartments have been sold.',
                ],
            ],

            // Jahan Villa (from a brokerage listing)
            'jv' => [
                'project' => [
                    'address' => 'House 408, South Monipur, Mirpur, Dhaka',
                    'description' => 'Ongoing residential project at South Monipur, Mirpur, with apartments of 1,175–1,200 sq ft. Contact our sales team for layouts, prices and booking.',
                ],
                'details' => [
                    'apartment_size' => '1200',
                ],
            ],

            // Hotel Jana Kuakata (converted from "Sample Hotel 2")
            'sh2' => [
                'project' => [
                    'address' => 'Kuakata, Patuakhali',
                    'google_map_url' => 'https://maps.google.com/maps?q=Kuakata%20Sea%20Beach%2C%20Patuakhali&output=embed',
                    'floors' => 'G+11',
                    'price' => 400000,
                    'construction_start_date' => '2025-04-25',
                    'description' => 'Hotel Jana Kuakata is a five-star hotel at the heart of Kuakata, planned with 264 rooms over 12 floors (subject to final specification) and built jointly with Sagor Kanya Resort. Own a share from BDT 400,000 and earn annual profit plus shareholder privileges.',
                    'surroundings' => 'Kuakata, known as Sagor Kanya (Daughter of the Sea), is one of the rare beaches where you can watch both sunrise and sunset over the Bay of Bengal. Fatrar Char mangrove forest, Gangamati reserve forest, the Rakhine villages and the Buddhist temples of Kuakata are all within easy reach.',
                ],
                'details' => [
                    'youtube_video_id' => 'OQ6oYAF_X4o',
                ],
                'facilities' => ['Swimming Pool', 'Restaurant', 'Ayurvedic Spa', 'In-room Dining'],
                'thumbnail' => 'seed-hotel-jana-kuakata-thumbnail.webp',
                'images' => [
                    'seed-hotel-jana-kuakata-facade-west.webp',
                    'seed-hotel-jana-kuakata-entrance.webp',
                    'seed-hotel-jana-kuakata-aerial-pool.webp',
                    'seed-hotel-jana-kuakata-facade-east.webp',
                    'seed-hotel-jana-lobby.webp',
                ],
            ],

            // Hotel Jana The Dove (converted from "Sample Hotel")
            'abl-292' => [
                'project' => [
                    'address' => "964 North Kolatoli (near Dolphin Mor), Cox's Bazar",
                    'google_map_url' => 'https://maps.google.com/maps?q=Dolphin%20Mor%2C%20Kolatoli%2C%20Cox%27s%20Bazar&output=embed',
                    'price' => 400000,
                    'description' => "Hotel Jana The Dove is a four-star hotel at North Kolatoli, Cox's Bazar, developed with Dove Housing Ltd. as Alliance Group's 110th project. Shares are BDT 400,000 each, payable in instalments, with annual profit and shareholder privileges.",
                    'surroundings' => "Hotel Jana The Dove stands at 964 North Kolatoli, near Dolphin Mor, a short walk from the Kolatoli and Sugandha beach points on the world's longest natural sea beach. Marine Drive, Himchari National Park and Inani Beach are a scenic drive along the coast, and the town's restaurants and markets are close by.",
                ],
                'details' => [
                    'youtube_video_id' => 'dAWP64KJwM4',
                ],
                'facilities' => ['Swimming Pool', 'Restaurant', 'Ayurvedic Spa', 'In-room Dining'],
                'thumbnail' => 'seed-hotel-jana-the-dove-thumbnail.webp',
                'images' => [
                    'seed-hotel-jana-the-dove-seafront.webp',
                    'seed-hotel-jana-the-dove-rooftop-pool.webp',
                    'seed-hotel-jana-the-dove-dusk.webp',
                    'seed-hotel-jana-the-dove-sunset.webp',
                    'seed-hotel-jana-the-dove-pool-deck.webp',
                    'seed-hotel-jana-the-dove-night.webp',
                ],
            ],
        ];
    }

    /**
     * The live site's two hotels are placeholders ("Sample Hotel" in
     * Chittagong, "Sample Hotel 2" in Barishal) whose image files no
     * longer exist. Rename them to the real hotels and drop only the image
     * rows whose files are missing. Skipped once an admin has renamed them.
     */
    private function convertSampleHotels(): void
    {
        $hotels = [
            'sh2' => 'Hotel Jana Kuakata',
            'abl-292' => 'Hotel Jana The Dove',
        ];

        foreach ($hotels as $projectId => $name) {
            $project = DB::table('projects')->where('project_id', $projectId)->first();

            if (! $project || ! Str::startsWith($project->name, 'Sample Hotel')) {
                continue;
            }

            DB::table('projects')->where('id', $project->id)->update([
                'name' => $name,
                'slug' => Str::slug($name),
                'updated_at' => now(),
            ]);

            $disk = Storage::disk('public');

            DB::table('project_images')
                ->where('project_id', $projectId)
                ->get(['id', 'image'])
                ->reject(fn ($row) => $disk->exists('properties/hotelsResorts/'.$row->image))
                ->each(fn ($row) => DB::table('project_images')->where('id', $row->id)->delete());

            DB::table('images')
                ->where('imageable_type', self::PROJECT_TYPE)
                ->where('imageable_id', $projectId)
                ->get(['id', 'path'])
                ->reject(fn ($row) => $disk->exists('properties/propertyThumbs/'.$row->path))
                ->each(fn ($row) => DB::table('images')->where('id', $row->id)->delete());
        }
    }

    private function fillProject(string $projectId, array $data): void
    {
        $project = DB::table('projects')->where('project_id', $projectId)->first();

        if (! $project) {
            return;
        }

        $this->fillEmptyColumns('projects', ['id' => $project->id], (array) $project, $data['project'] ?? []);

        if (! empty($data['details'])) {
            $this->fillDetails($projectId, $data['details']);
        }

        foreach ($data['facilities'] ?? [] as $facility) {
            $this->attachFacility($projectId, $facility);
        }

        if (! empty($data['thumbnail'])) {
            $this->attachThumbnail($projectId, $data['thumbnail']);
        }

        foreach ($data['images'] ?? [] as $file) {
            $this->attachProjectImage($projectId, $file);
        }
    }

    /**
     * Write only the given columns that are currently null or blank.
     */
    private function fillEmptyColumns(string $table, array $key, array $current, array $values): void
    {
        $updates = [];

        foreach ($values as $column => $value) {
            if (! isset($current[$column]) || trim((string) $current[$column]) === '') {
                $updates[$column] = $value;
            }
        }

        if ($updates) {
            $updates['updated_at'] = now();
            DB::table($table)->where($key)->update($updates);
        }
    }

    private function fillDetails(string $projectId, array $values): void
    {
        $details = DB::table('details')
            ->where('detailable_type', self::PROJECT_TYPE)
            ->where('detailable_id', $projectId)
            ->first();

        if ($details) {
            $this->fillEmptyColumns('details', ['id' => $details->id], (array) $details, $values);

            return;
        }

        DB::table('details')->insert(array_merge($values, [
            'detailable_id' => $projectId,
            'detailable_type' => self::PROJECT_TYPE,
            'created_at' => now(),
            'updated_at' => now(),
        ]));
    }

    private function attachFacility(string $projectId, string $name): void
    {
        $facilityId = DB::table('facilities')->where('name', $name)->value('id')
            ?? DB::table('facilities')->insertGetId(['name' => $name, 'created_at' => now(), 'updated_at' => now()]);

        $exists = DB::table('facilitable')
            ->where('facility_id', $facilityId)
            ->where('facilitable_id', $projectId)
            ->exists();

        if (! $exists) {
            DB::table('facilitable')->insert([
                'facility_id' => $facilityId,
                'facilitable_id' => $projectId,
                'facilitable_type' => self::PROJECT_TYPE,
            ]);
        }
    }

    /**
     * The thumbnail is a morphOne, so add one only if there is none.
     */
    private function attachThumbnail(string $projectId, string $file): void
    {
        $hasThumbnail = DB::table('images')
            ->where('imageable_type', self::PROJECT_TYPE)
            ->where('imageable_id', $projectId)
            ->exists();

        if ($hasThumbnail || ! $this->copySeedAsset('properties/propertyThumbs', $file)) {
            return;
        }

        DB::table('images')->insert([
            'path' => $file,
            'imageable_id' => $projectId,
            'imageable_type' => self::PROJECT_TYPE,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function attachProjectImage(string $projectId, string $file): void
    {
        $exists = DB::table('project_images')
            ->where('project_id', $projectId)
            ->where('image', $file)
            ->exists();

        if ($exists || ! $this->copySeedAsset('properties/hotelsResorts', $file)) {
            return;
        }

        DB::table('project_images')->insert([
            'image' => $file,
            'project_id' => $projectId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Copy a file from database/seed-assets/ to the same public-disk
     * folder the CMS uploads to (the deploy does not sync storage/).
     */
    private function copySeedAsset(string $folder, string $file): bool
    {
        $source = database_path('seed-assets/'.$folder.'/'.$file);

        if (! is_file($source)) {
            return false;
        }

        if (! Storage::disk('public')->exists($folder.'/'.$file)) {
            Storage::disk('public')->put($folder.'/'.$file, file_get_contents($source));
        }

        return true;
    }

    /**
     * Projects with no source data anywhere get a short, factual
     * description based on their status, and nothing else.
     */
    private function fillGenericDescriptions(): void
    {
        $projectIds = ['akh', 'ah', 'bb', 'hv', 'jm', 'sb', 'rv', 'ac', 'amo', 'smcmrt'];

        foreach (DB::table('projects')->whereIn('project_id', $projectIds)->get() as $project) {
            // The name is left out: several live names have inconsistent
            // casing, and the page already shows the name as its title.
            $status = match ((int) $project->project_type_id) {
                1 => 'Completed',
                3 => 'Upcoming',
                default => 'Ongoing',
            };

            $closing = (int) $project->project_type_id === 3
                ? 'Contact our sales team for apartment sizes, prices and early booking.'
                : 'Contact our sales team for apartment sizes, prices and booking details.';

            $this->fillEmptyColumns('projects', ['id' => $project->id], (array) $project, [
                'description' => "{$status} residential project by Alliance Builders Ltd. in Dhaka. {$closing}",
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
