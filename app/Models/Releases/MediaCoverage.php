<?php

namespace App\Models\Releases;

use App\Concerns\HasImage;
use App\Concerns\HasVideo;
use App\Models\Visual\Image;
use App\Models\Visual\Video;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class MediaCoverage extends Model
{
    use HasFactory, HasImage;
    public function image() : MorphOne
    {
        return $this->morphOne( Image::class, 'imageable', 'imageable_type', 'imageable_id', 'id');
    }

    public function videos() : MorphMany
    {
        return $this->morphMany( Video::class, 'videoable', 'videoable_type', 'videoable_id', 'id');
    }
}
