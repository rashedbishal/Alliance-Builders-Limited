<?php

namespace App\Models\Career;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class CareerSetting extends Model
{
    protected $fillable = [
        'hero_image',
        'heading',
        'subtitle',
        'no_openings_message',
        'default_email',
    ];

    /**
     * Singleton accessor — the migration seeds row id 1.
     */
    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }

    protected function heroImage(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? asset('storage/career/'.$value) : null,
            set: fn ($value) => $value,
        );
    }
}
