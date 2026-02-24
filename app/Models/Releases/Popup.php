<?php

namespace App\Models\Releases;

use App\Models\Visual\Image;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Popup extends Model
{
    use HasFactory;
    public function images() : MorphMany
    {
        return $this->morphMany( Image::class, 'imageable', 'imageable_type', 'imageable_id', 'id');
    }
}
