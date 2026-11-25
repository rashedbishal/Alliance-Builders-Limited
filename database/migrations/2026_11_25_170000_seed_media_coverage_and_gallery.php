<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    private const MEDIA_TYPE = 'App\Models\Releases\MediaCoverage';

    private const GALLERY_TYPE = 'App\Models\Visual\Gallery';

    /**
     * Run the migrations.
     *
     * Images ship in the repo under database/seed-assets/ (the deploy does
     * not sync storage/), and are copied to the public disk here using the
     * same folders the CMS uploads to.
     */
    public function up(): void
    {
        $this->removeTestMediaEntry();
        $this->seedMediaCoverage();
        $this->seedGallery();
    }

    /**
     * The live site had one leftover test entry ("a" / "t" / https://a.b).
     */
    private function removeTestMediaEntry(): void
    {
        $ids = DB::table('media_coverages')
            ->where('media_title', 'a')
            ->where('media_type', 't')
            ->where('news_hyperlink', 'https://a.b')
            ->pluck('id');

        foreach ($ids as $id) {
            $images = DB::table('images')
                ->where('imageable_type', self::MEDIA_TYPE)
                ->where('imageable_id', (string) $id);

            foreach ($images->pluck('path') as $path) {
                Storage::disk('public')->delete('media/'.$path);
            }

            $images->delete();
            DB::table('media_coverages')->where('id', $id)->delete();
        }
    }

    /**
     * Media coverage previously listed on Alliance's old website, plus two
     * Jana News articles. Headlines and dates are taken from each source.
     */
    private function seedMediaCoverage(): void
    {
        $items = [
            ['Nagorik TV', 'TV Channel', "কক্সবাজারে এলায়েন্স বিল্ডার্সের 'জানা দ্যা ডাভ' হোটেল উদ্বোধন", 'https://www.youtube.com/watch?v=Nq_chSKCTa8', '2025-08-10', 'seed-nagorik-tv-jana-the-dove.webp', true],
            ['Jana News', 'Online News', 'কক্সবাজারে Hotel Jana The Dove এর সেলস কার্যক্রমের উদ্বোধন', 'https://jananews24.com/%e0%a6%95%e0%a6%95%e0%a7%8d%e0%a6%b8%e0%a6%ac%e0%a6%be%e0%a6%9c%e0%a6%be%e0%a6%b0%e0%a7%87-hotel-jana-the-dove-%e0%a6%8f%e0%a6%b0-%e0%a6%b8%e0%a7%87%e0%a6%b2%e0%a6%b8-%e0%a6%95%e0%a6%be%e0%a6%b0/', '2025-08-10', 'seed-jananews-jana-the-dove-sales.webp', false],
            ['SA TV', 'TV Channel', "কক্সবাজারে হোটেল 'জানা দ্যা ডাব' হবে নিম্ন ও মধ্যবিত্তের ঠিকানা-আসাদুজ্জামান", 'https://www.youtube.com/watch?v=akkhFlsooKw', '2025-08-10', 'seed-satv-jana-the-dove.webp', false],
            ['Banglavision', 'TV Channel', 'এলায়েন্স গ্রুপের বর্ষাকালীন একক আবাসন মেলা শুরু', 'https://www.youtube.com/watch?v=wk97Nb-uY38', '2025-07-19', 'seed-banglavision-housing-fair.webp', false],
            ['SA TV', 'TV Channel', 'এলায়েন্স গ্রুপের বর্ষাকালীন একক আবাসন মেলা শুরু', 'https://www.youtube.com/watch?v=Hh5t-ikt8b8', '2025-07-19', 'seed-satv-housing-fair.webp', false],
            ['Nagorik TV', 'TV Channel', 'এলায়েন্স গ্রুপের বর্ষাকালীন একক আবাসন মেলা শুরু', 'https://www.youtube.com/watch?v=VRJJzSXWToM', '2025-07-18', 'seed-nagorik-tv-housing-fair.webp', false],
            ['Global TV', 'TV Media', 'Alliance Builders Ltd. on Global TV', 'https://www.facebook.com/globaltelevisionnews/videos/1232850438046660/', '2025-05-16', 'seed-global-tv.webp', false],
            ['Jana News', 'Online News', 'কুয়াকাটায় এলায়েন্স বিল্ডার্সের নতুন প্রকল্প হোটেল জানা -০১ এর নির্মান কাজের উদ্বোধন ২৫ এপ্রিল', 'https://jananews24.com/%e0%a6%95%e0%a7%81%e0%a6%af%e0%a6%bc%e0%a6%be%e0%a6%95%e0%a6%be%e0%a6%9f%e0%a6%be%e0%a6%af%e0%a6%bc-%e0%a6%8f%e0%a6%b2%e0%a6%be%e0%a6%af%e0%a6%bc%e0%a7%87%e0%a6%a8%e0%a7%8d%e0%a6%b8-%e0%a6%ac%e0%a6%bf/', '2025-04-23', 'seed-jananews-hotel-jana-01.webp', false],
            ['Desher Potro', 'Newspaper', 'অ্যালায়েন্স বিল্ডার্সের উদ্যোগে চলছে একক আবাসন মেলা', 'https://www.desherpotro.com/%E0%A6%85%E0%A6%AF%E0%A6%B2%E0%A6%AF%E0%A6%A8%E0%A6%B8-%E0%A6%AC%E0%A6%B2%E0%A6%A1%E0%A6%B0%E0%A6%B8%E0%A6%B0-%E0%A6%89%E0%A6%A6%E0%A6%AF%E0%A6%97-%E0%A6%9A%E0%A6%B2%E0%A6%9B-%E0%A6%8F%E0%A6%95%E0%A6%95-%E0%A6%86%E0%A6%AC%E0%A6%B8%E0%A6%A8-%E0%A6%AE%E0%A6%B2', '2024-10-05', 'seed-desherpotro.webp', false],
            // The original article now returns 404; this is its archived copy.
            ['The Daily Nawroj', 'Newspaper', 'অ্যালায়েন্স বিল্ডার্সের আবাসন মেলা উদ্বোধন', 'https://web.archive.org/web/20250624140051/https://nawroj.com.bd/%E0%A6%85%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%B8-%E0%A6%AC%E0%A6%BF%E0%A6%B2%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%B8%E0%A7%87/', '2024-10-05', 'seed-nawroj.webp', false],
        ];

        $hasFeatured = DB::table('media_coverages')->where('isFeatured', true)->exists();

        foreach ($items as [$outlet, $type, $headline, $link, $date, $image, $featured]) {
            // Skip coverage that already exists (e.g. added from the CMS).
            if (DB::table('media_coverages')->where('news_hyperlink', $link)->exists()) {
                continue;
            }

            $mediaId = DB::table('media_coverages')->insertGetId([
                'media_title' => $headline,
                'media_type' => $outlet.' · '.$type,
                'news_hyperlink' => $link,
                // Keep an admin-chosen featured item if there already is one.
                'isFeatured' => $featured && ! $hasFeatured,
                'created_at' => $date.' 12:00:00',
                'updated_at' => now(),
            ]);

            $this->attachImage('media', $image, self::MEDIA_TYPE, $mediaId);
        }
    }

    /**
     * Alliance's own project renderings: handed-over projects in
     * "Project Handover" (1) and ongoing projects in "Construction
     * Images" (3).
     */
    private function seedGallery(): void
    {
        foreach ([1 => 'Project Handover', 2 => 'Project Inauguration', 3 => 'Construction Images', 4 => 'Events & Activities'] as $id => $type) {
            if (! DB::table('galleries')->where('id', $id)->exists()) {
                DB::table('galleries')->insert(['id' => $id, 'type' => $type]);
            }
        }

        $handover = [
            'Alliance Bilkis' => 'seed-alliance-bilkis.webp',
            'Alliance Bonolota' => 'seed-alliance-bonolota.webp',
            'Alliance Kashem Neer' => 'seed-alliance-kashem-neer.webp',
            'Alliance Lily' => 'seed-alliance-lily.webp',
            'Alliance Moshafor' => 'seed-alliance-moshafor.webp',
            'Alliance Patoyari' => 'seed-alliance-patoyari.webp',
            'Bijoy 71' => 'seed-bijoy-71.webp',
            'Gardenia' => 'seed-gardenia.webp',
            'Mira Mahal' => 'seed-mira-mahal.webp',
        ];

        $ongoing = [
            'Abdul Khaleke Residents' => 'seed-abdul-khaleke-residents.webp',
            'Alliance Angina' => 'seed-alliance-angina.webp',
            'Alliance Bhai Bhai Tower' => 'seed-alliance-bhai-bhai-tower.webp',
            'Alliance Chairman Monjil' => 'seed-alliance-chairman-monjil.webp',
            'Alliance Hope' => 'seed-alliance-hope.webp',
            'Anwara Monjil' => 'seed-anwara-monjil.webp',
            'Blissful Breeze' => 'seed-blissful-breeze.webp',
            'Dhupchaya' => 'seed-dhupchaya.webp',
            'Dil Mohammad Tower' => 'seed-dil-mohammad-tower.webp',
            'Hamid Villa' => 'seed-hamid-villa.webp',
            'Jahan Villa' => 'seed-jahan-villa.webp',
            'Jahanara Monjil' => 'seed-jahanara-monjil.webp',
            'Laila Monjil' => 'seed-laila-monjil.webp',
            'Shopno Bilash' => 'seed-shopno-bilash.webp',
            'Shopnoneer Muktijoddha Commender Mojibur Rahman Tower' => 'seed-shopnoneer-muktijoddha-commender-mojibur-rahman-tower.webp',
        ];

        foreach ($handover as $title => $file) {
            $this->attachImage('gallery/project-handover', $file, self::GALLERY_TYPE, 1, $title, 'Handed-over project by Alliance Builders Ltd. (architectural view)');
        }

        foreach ($ongoing as $title => $file) {
            $this->attachImage('gallery/construction-images', $file, self::GALLERY_TYPE, 3, $title, 'Ongoing project, under construction (architectural view)');
        }
    }

    /**
     * Copy a seed asset to the public disk and create its image row,
     * unless that file is already attached.
     */
    private function attachImage(string $folder, string $file, string $type, int $ownerId, ?string $title = null, ?string $description = null): void
    {
        $exists = DB::table('images')
            ->where('imageable_type', $type)
            ->where('imageable_id', (string) $ownerId)
            ->where('path', $file)
            ->exists();

        if ($exists) {
            return;
        }

        $source = database_path('seed-assets/'.$folder.'/'.$file);

        if (! is_file($source)) {
            return;
        }

        if (! Storage::disk('public')->exists($folder.'/'.$file)) {
            Storage::disk('public')->put($folder.'/'.$file, file_get_contents($source));
        }

        DB::table('images')->insert([
            'path' => $file,
            'title' => $title,
            'description' => $description,
            'imageable_id' => (string) $ownerId,
            'imageable_type' => $type,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
