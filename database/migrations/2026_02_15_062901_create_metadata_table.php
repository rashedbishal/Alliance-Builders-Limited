<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('metadata', function (Blueprint $table) {
            $table->id();
            $table->string('meta_description', 512)->nullable();
            $table->string('meta_keyword', 512)->nullable();
            $table->string('meta_og_description', 512)->nullable();
            $table->string('meta_og_image', 512)->nullable();
            $table->string('meta_twitter_description', 512)->nullable();
            $table->string('meta_twitter_image', 512)->nullable();
            $table->string('meta_twitter_image_alt', 512)->nullable();
            $table->string('meta_apple_mobile_web_app_status_bar_style')->nullable();
            $table->string('meta_apple_touch_icon')->nullable();
            $table->string('metadatable_id');
            $table->string('metadatable_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metadata');
    }
};
