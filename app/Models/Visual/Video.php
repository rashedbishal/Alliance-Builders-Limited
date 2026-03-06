<?php

namespace App\Models\Visual;

use App\Models\Properties\Project;
use App\Models\Releases\MediaCoverage;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Video extends Model
{
    use HasFactory;

    protected function path(): Attribute
    {
        if (! is_null($this->videoable_type)) {
            $type = match ($this->videoable_type) {
                'App\Models\Visual\Gallery' => 'gallery',
                'App\Models\Releases\MediaCoverage' => 'media',
                'App\Models\Releases\Popup' => 'popup',
                'App\Models\Properties\Project' => 'project',
            };

            if ($type == 'gallery') {
                switch ($this->videoable_id) {
                    case 1:
                        $path = 'storage/video/project-handover/';
                        break;
                    case 2:
                        $path = 'storage/video/project-inauguration/';
                        break;
                    case 3:
                        $path = 'storage/video/construction-images/';
                        break;
                    case 4:
                        $path = 'storage/video/event-activity/';
                        break;
                    default:
                        abort(503);
                }
            } elseif ($type == 'project') {
                $path = 'storage/video/properties/';
            } elseif ($type == 'media') {
                $path = 'images/media coverage/';
            } elseif ($type == 'popup') {
                $path = 'images/popup/';
            }
        }

        return Attribute::make(
            get: fn ($value) => $value ? asset($path . $value) : null,
            set: fn ($value) => $value,
        );
    }

    public function gallery(): MorphTo
    {
        return $this->morphTo(Gallery::class, 'videoable_type', 'videoable_id', 'id');
    }

    public function mediaCoverage(): MorphTo
    {
        return $this->morphTo(MediaCoverage::class, 'videoable_type', 'videoable_id', 'id');
    }

    public function project(): MorphTo
    {
        return $this->morphTo(Project::class, 'videoable_type', 'videoable_id', 'project_id');
    }
}
