<?php

namespace App\Models\Visual;

use App\Concerns\HasImages;
use App\Concerns\HasVideos;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Gallery extends Model
{
    use HasFactory, HasImages, HasVideos;

    protected $fillable = ['type'];

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable', 'imageable_type', 'imageable_id', 'id');
    }

    public function videos(): MorphMany
    {
        return $this->morphMany(Video::class, 'videoable', 'videoable_type', 'videoable_id', 'id');
    }
}
