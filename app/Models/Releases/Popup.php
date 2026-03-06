<?php

namespace App\Models\Releases;

use App\Models\Visual\Image;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Popup extends Model
{
    use HasFactory;

    protected function imagePath(): Attribute
    {

        $path = 'storage/popup/';
        return Attribute::make(
            get: fn ($value) => $value ? asset($path.$value) : null,
            set: fn ($value) => $value,
        );
    }

    public function image(): \Illuminate\Database\Eloquent\Relations\MorphOne
    {
        return $this->morphOne(Image::class, 'imageable', 'imageable_type', 'imageable_id', 'id');
    }
}
