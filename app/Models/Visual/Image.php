<?php

namespace App\Models\Visual;

use App\Models\Properties\Project;
use App\Models\Releases\MediaCoverage;
use App\Models\Releases\Popup;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Image extends Model
{
    use HasFactory;

    protected function path(): Attribute
    {
        if (! is_null($this->imageable_type)) {
            $type = match ($this->imageable_type) {
                'App\Models\Visual\Gallery' => 'gallery',
                'App\Models\Releases\MediaCoverage' => 'media',
                'App\Models\Releases\Popup' => 'popup',
                'App\Models\Properties\Project' => 'project',
            };

            if ($type == 'gallery') {
                switch ($this->imageable_id) {
                    case 1:
                        $path = 'storage/gallery/project-handover/';
                        break;
                    case 2:
                        $path = 'storage/gallery/project-inauguration/';
                        break;
                    case 3:
                        $path = 'storage/gallery/construction-images/';
                        break;
                    case 4:
                        $path = 'storage/gallery/event-activity/';
                        break;
                    default:
                        abort(503);
                }
            } elseif ($type == 'project') {
                $path = 'storage/properties/propertyThumbs/';
            } elseif ($type == 'media') {
                $path = 'storage/media/';
            } elseif ($type == 'popup') {
                $path = 'storage/popup/';
            }
        }

        return Attribute::make(
            get: fn ($value) => $value ? asset($path.$value) : null,
            set: fn ($value) => $value,
        );
    }

    public function gallery(): MorphTo
    {
        return $this->morphTo(Gallery::class, 'imageable_type', 'imageable_id', 'id');
    }

    public function mediaCoverage(): MorphTo
    {
        return $this->morphTo(MediaCoverage::class, 'imageable_type', 'imageable_id', 'id');
    }

    public function project(): MorphTo
    {
        return $this->morphTo(Project::class, 'imageable_type', 'imageable_id', 'project_id');
    }
}
