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
        $row = DB::table('page_contents')->where('key', 'about_page')->first();

        if (! $row) {
            return;
        }

        $content = json_decode($row->content, true);

        // Only fill the name if it hasn't already been set from the CMS.
        if (! empty($content['md_name'])) {
            return;
        }

        $content['md_name'] = 'Md Asaduzzaman';

        DB::table('page_contents')->where('key', 'about_page')->update([
            'content' => json_encode($content),
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
