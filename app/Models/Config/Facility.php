<?php

namespace App\Models\Config;

use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Facility extends Model
{
    use HasFactory;
    public function projects(): MorphToMany
    {
        return $this->morphedByMany(Project::class, 'facilitable', 'facilitable', 'facility_id', 'facilitable_id', 'id', 'project_id');
    }
}
