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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('trade_license_number')->nullable()->after('messenger_link');
        });

        // Seed the number from the DNCC E-Trade License so it shows on the
        // site until an admin edits it from the CMS.
        DB::table('site_settings')->where('id', 1)->update([
            'trade_license_number' => 'TRAD/DNCC/060686/2022',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn('trade_license_number');
        });
    }
};
