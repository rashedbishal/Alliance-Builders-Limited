<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('content');
            $table->timestamps();
        });

        // Replace the placeholder copy that was hardcoded in About.tsx,
        // AboutSection.tsx and SisterCompanies.tsx with Alliance's own
        // details, so the live site shows it without manual CMS entry.
        // Project counts come from the live portfolio (Nov 2026); the
        // team size is an estimate to be confirmed from the CMS.
        $sections = [
            'company_stats' => [
                // Shared by the About page and the home About section.
                'stats' => [
                    ['value' => '13+', 'label' => 'Years of Experience'],
                    ['value' => '9', 'label' => 'Projects Handed Over'],
                    ['value' => '15', 'label' => 'Ongoing Projects'],
                    ['value' => '6', 'label' => 'Sister Concerns'],
                ],
                // Home sister-companies block.
                'group_stats' => [
                    ['value' => '6', 'label' => 'Sister Companies'],
                    ['value' => '25+', 'label' => 'Projects Executed'],
                    ['value' => '15', 'label' => 'Ongoing Projects'],
                    ['value' => '100+', 'label' => 'Dedicated Team'],
                ],
            ],
            'about_page' => [
                'hero_title' => 'Building Dreams, One Home At A Time',
                'hero_subtitle' => 'Since 2013, Alliance Builders Ltd. has been developing quality residential and commercial buildings across Dhaka, with a focus on sound construction, transparent dealings and on-time handover.',
                'hero_credentials' => 'Since 2013 · REHAB Member · ISO 9001:2015 Certified',
                'story_heading' => 'More Than a Decade of Building Trust',
                'story_paragraphs' => [
                    'Alliance Builders Ltd. began its journey in 2013 with a simple goal: to build homes that families can rely on for generations. From our office in Mirpur, Dhaka, we have grown into a REHAB member developer with an ISO 9001:2015 certified quality management system.',
                    'We work closely with landowners and buyers at every stage, from land development and design to construction and handover. Today, with 9 projects handed over and 15 under construction, our focus remains the same: quality, transparency and keeping our word.',
                ],
                'years_value' => '13+',
                'years_label' => 'Years of Experience',
                'values_heading' => 'What Drives Us Forward',
                'values_intro' => 'Our core values shape every project we build and every relationship we keep.',
                'values' => [
                    ['title' => 'Quality', 'description' => 'Sound engineering and quality materials in every building.'],
                    ['title' => 'Transparency', 'description' => 'Clear agreements and honest communication with landowners and buyers.'],
                    ['title' => 'Commitment', 'description' => 'Delivering what we promise, on time.'],
                ],
                'md_title' => 'Managing Director',
                'md_name' => '',
                'md_summary' => 'Under the leadership of our Managing Director, Alliance Builders Ltd. has grown steadily since 2013, guided by a commitment to quality construction, transparent dealings and long-term relationships with landowners and clients.',
                'md_image' => null,
                'cta_heading' => 'Ready to Start Your Journey?',
                'cta_text' => "Let's find your next home together. Our team is ready to help you every step of the way.",
            ],
            'home_about' => [
                'heading' => 'About Alliance Builders Ltd.',
                'intro' => 'Alliance Builders Ltd. is a Dhaka-based real estate developer delivering residential and commercial projects since 2013, built on quality construction and transparent dealings.',
                'services' => [
                    ['title' => 'Property Development', 'description' => 'End-to-end development from land to handover.'],
                    ['title' => 'Landowner Partnership', 'description' => 'Fair joint-venture terms and clear agreements for landowners.'],
                    ['title' => 'Customer Support', 'description' => 'Dedicated support from booking through handover.'],
                    ['title' => 'Legal Compliance', 'description' => 'Proper documentation and approvals for secure transactions.'],
                ],
                'why_heading' => 'Why Choose Alliance Builders Ltd.?',
                'why_text' => 'Quality construction, transparent dealings and on-time handover have made us a trusted developer for landowners and homebuyers in Dhaka.',
                'features' => [
                    ['stat' => 'REHAB', 'title' => 'REHAB Member', 'description' => 'Registered with the Real Estate & Housing Association of Bangladesh.'],
                    ['stat' => 'ISO 9001', 'title' => 'ISO 9001:2015 Certified', 'description' => 'A certified quality management system.'],
                    ['stat' => '13+ Years', 'title' => 'Since 2013', 'description' => 'Developing in Dhaka since 2013.'],
                    ['stat' => '25 Projects', 'title' => 'Proven Portfolio', 'description' => 'Handed over, ongoing and upcoming.'],
                ],
                'cta_heading' => 'Ready to Find Your Dream Property?',
                'cta_text' => 'Find your next home with Alliance Builders Ltd.',
            ],
        ];

        $now = now();

        foreach ($sections as $key => $content) {
            DB::table('page_contents')->insert([
                'key' => $key,
                'content' => json_encode($content),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};
