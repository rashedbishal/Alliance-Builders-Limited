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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('header_phone')->nullable();
            $table->string('footer_phone')->nullable();
            $table->string('footer_email')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('messenger_link')->nullable();
            $table->timestamps();
        });

        // Seed the singleton row with the values that were previously
        // hardcoded in the Navbar/Footer/FloatingMessageButton components,
        // so the live site keeps showing the same contact details until
        // an admin edits them from the CMS.
        DB::table('site_settings')->insert([
            'id' => 1,
            'header_phone' => '+8801928568853',
            'footer_phone' => '+8801928568853',
            'footer_email' => 'asad@alliancebuildersltd.org',
            'whatsapp_number' => '+8801928568853',
            'messenger_link' => 'alliancebuilderslimited',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
