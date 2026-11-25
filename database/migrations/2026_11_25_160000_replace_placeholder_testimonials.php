<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove only the untouched EstateElite placeholders seeded by
        // 2026_11_02_120001_create_testimonials_table, so any testimonial
        // added or edited from the CMS is left alone.
        DB::table('testimonials')
            ->whereIn('name', ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Thompson', 'Lisa Wang'])
            ->where('quote', 'like', '%EstateElite%')
            ->delete();

        // Client reviews previously published on Alliance's own website
        // (the "Honest Reviews and Feedback" section of the old
        // alliancebuildersltd.org homepage). Only the misspelling
        // "Alience" was corrected. The old site showed no client photos,
        // so none are set; the section falls back to the initial letter.
        $reviews = [
            [
                'name' => 'Fatema Ezaz Enaya',
                'role' => 'Client',
                'property_type' => null,
                'quote' => 'From the first consultation to project handover, Alliance Builders Ltd. was outstanding. Their attention to detail and client care were exceptional. They built more than just a home—they built our trust.',
                'date' => '2018-08-29',
            ],
            [
                'name' => 'Nazma Akter',
                'role' => 'Client',
                'property_type' => null,
                'quote' => 'Alliance Builders Ltd. turned my dream home into reality with perfect timing and quality. Their professionalism and dedication truly impressed me. I highly recommend them without a second thought.',
                'date' => '2019-04-21',
            ],
            [
                'name' => 'Md. Mustaque Ahmed',
                'role' => 'Client',
                'property_type' => null,
                'quote' => 'Trust, quality, and reliability—Alliance Builders Ltd. delivers all three. They supported us in every step of the process. It’s more than a company; it’s a partner in dreams.',
                'date' => '2023-05-03',
            ],
            [
                'name' => 'S M Ashik Billa',
                'role' => 'Client',
                'property_type' => null,
                'quote' => 'I’ve worked with many developers, but Alliance Builders Ltd. stood out. Their design sense and construction standards are top-notch. They exceeded my expectations in every way.',
                'date' => '2024-09-22',
            ],
            [
                'name' => 'Sirajum Monira Moni',
                'role' => 'Flat Owner',
                'property_type' => 'Deen Mohammad Tower',
                'quote' => 'Buying a flat at Deen Mohammad Tower was one of my best decisions. Alliance Builders Ltd. never compromises on quality or commitment. Looking forward to working with them again in the future.',
                'date' => '2025-02-18',
            ],
        ];

        foreach ($reviews as $review) {
            // Skip if an admin already added this client's review.
            if (DB::table('testimonials')->where('name', $review['name'])->exists()) {
                continue;
            }

            DB::table('testimonials')->insert([
                'name' => $review['name'],
                'role' => $review['role'],
                'company' => null,
                'rating' => 5,
                'quote' => $review['quote'],
                'property_type' => $review['property_type'],
                'image' => null,
                // Keep the original review date for reference.
                'created_at' => $review['date'].' 00:00:00',
                'updated_at' => now(),
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
