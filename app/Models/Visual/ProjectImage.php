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
            $path = 'storage/'.$this->project->projectType->storageFolder().'/';
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
