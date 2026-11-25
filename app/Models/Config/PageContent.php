<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    /** Content sections editable from the CMS. */
    public const KEYS = ['about_page', 'home_about', 'company_stats'];

    protected $fillable = [
        'key',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public static function get(string $key): array
    {
        return static::where('key', $key)->first()?->content ?? [];
    }
}
