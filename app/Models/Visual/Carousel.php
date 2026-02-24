<?php

namespace App\Models\Visual;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    use HasFactory;
    private $path = 'storage/home/carousel/';

    protected function image() : Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->path.$value,
            set: fn($value) => $value,
        );
    }
}
