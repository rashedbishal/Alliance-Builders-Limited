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
        Schema::create('details', function (Blueprint $table) {
            $table->id();
            $table->string('apartment_size')->nullable();
            $table->string('bedroom')->nullable();
            $table->string('bathroom')->nullable();
            $table->string('balcony')->nullable();
            $table->string('kitchen')->nullable();
            $table->string('living_dining')->nullable();
            $table->string('parking')->nullable();
            $table->string('garage_no')->nullable();
            $table->string('garage_size')->nullable();
            $table->string('apartment_direction')->nullable();
            $table->string('youtube_video_id')->nullable();
            $table->string('detailable_id');
            $table->string('detailable_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('details');
    }
};
