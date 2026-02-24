<?php

namespace App\Models\Config;

use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Metadata extends Model
{
    use HasFactory;
    public function project() : MorphTo
    {
        return $this->morphTo(Project::class, 'metadatable', 'metadatable_id', 'project_id');
    }

    public function tag() : MorphTo
    {
        return $this->morphTo(Project::class, 'metadatable', 'metadatable_id', 'id');
    }
}
