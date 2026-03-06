<?php

namespace App\Models\Visual;

use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectImage extends Model
{
    use HasFactory;

    protected function image(): Attribute
    {
        $path = null;
        if ($this->project()->exists()) {
            switch ($this->project->project_type_id) {
                case 1:
                    $path = 'storage/properties/handoverProject/';
                    break;
                case 2:
                    $path = 'storage/properties/ongoingProject/';
                    break;
                case 3:
                    $path = 'storage/properties/upcomingProject/';
                    break;
                case 4:
                    $path = 'storage/properties/hotelsResorts/';
                    break;
                default:
                    abort(503);
            }
        }

        return Attribute::make(
            get: fn ($value) => $path.$value,
            set: fn ($value) => $value,
        );

    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }
}
