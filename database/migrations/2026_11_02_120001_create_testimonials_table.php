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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->string('company')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('quote');
            $table->string('property_type')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // Carry over the testimonials that were previously hardcoded in
        // TestimonialsSection.tsx, so the homepage section isn't empty
        // right after this migration runs on the live site. Their photos
        // were external Unsplash URLs, stored here as-is; the Testimonial
        // model's accessor only rewrites bare filenames to a storage path.
        $now = now();
        DB::table('testimonials')->insert([
            [
                'name' => 'Sarah Johnson',
                'role' => 'Property Investor',
                'company' => 'Johnson Holdings',
                'rating' => 5,
                'quote' => "EstateElite transformed our investment portfolio completely. Their market insights and professional approach helped us identify premium properties that have appreciated significantly. The team's dedication to excellence is unmatched in the industry.",
                'property_type' => 'Commercial Investment',
                'image' => 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Michael Chen',
                'role' => 'Landowner',
                'company' => 'Chen Development Group',
                'rating' => 5,
                'quote' => 'Working with EstateElite on our land development project was exceptional. They understood our vision and delivered beyond expectations. The entire process was transparent, professional, and resulted in a remarkable development that exceeded our ROI projections.',
                'property_type' => 'Land Development',
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Emily Rodriguez',
                'role' => 'Home Buyer',
                'company' => 'Marketing Executive',
                'rating' => 5,
                'quote' => 'Finding our dream home seemed impossible until we met EstateElite. They listened to our needs, understood our budget, and presented options that perfectly matched our requirements. The buying process was smooth and stress-free.',
                'property_type' => 'Luxury Residence',
                'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'David Thompson',
                'role' => 'Business Owner',
                'company' => 'Thompson Enterprises',
                'rating' => 5,
                'quote' => 'EstateElite helped us secure the perfect commercial space for our expanding business. Their understanding of commercial real estate and negotiation skills saved us both time and money. Highly recommended for any business property needs.',
                'property_type' => 'Commercial Space',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Lisa Wang',
                'role' => 'Real Estate Developer',
                'company' => 'Wang Properties',
                'rating' => 5,
                'quote' => "As a fellow developer, I can appreciate quality work when I see it. EstateElite's attention to detail, innovative designs, and commitment to sustainability sets them apart. They've become our preferred partner for joint ventures.",
                'property_type' => 'Development Partnership',
                'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
