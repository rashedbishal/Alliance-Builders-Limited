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
        Schema::create('career_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_image')->nullable();
            $table->string('heading')->nullable();
            $table->text('subtitle')->nullable();
            $table->text('no_openings_message')->nullable();
            $table->string('default_email')->nullable();
            $table->timestamps();
        });

        // Seed the singleton row so the public Career page renders with
        // formal default copy before an admin edits it from the CMS.
        DB::table('career_settings')->insert([
            'id' => 1,
            'hero_image' => null,
            'heading' => 'Build Your Career With Us',
            'subtitle' => 'Join a team that shapes skylines and builds lasting communities. Explore our current openings and become part of Alliance Builders Limited.',
            'no_openings_message' => 'There are currently no open positions. However, we are always interested in hearing from talented professionals. Please submit your application below and we will contact you when a suitable opportunity becomes available.',
            'default_email' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('career_settings');
    }
};
