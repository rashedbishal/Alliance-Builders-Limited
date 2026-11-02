<?php

namespace App\Models\Visual;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'company',
        'rating',
        'quote',
        'property_type',
        'image',
    ];

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value
                ? (str_starts_with($value, 'http') ? $value : asset('storage/testimonials/'.$value))
                : null,
            set: fn ($value) => $value,
        );
    }
}
