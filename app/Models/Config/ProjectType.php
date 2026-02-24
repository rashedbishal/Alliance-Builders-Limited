<?php

namespace App\Models\Config;

use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectType extends Model
{
    use HasFactory;
    protected $fillable = ['name'];
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'project_type_id', 'id');
    }
}
