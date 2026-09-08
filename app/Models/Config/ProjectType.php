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

    /**
     * The 'properties/...' storage subfolder for this type's thumbnail/gallery
     * images. Matched by name rather than a hardcoded id, since the id is just
     * whatever order rows happened to be inserted in and isn't guaranteed to
     * stay 1=Handover, 2=Ongoing, 3=Upcoming, 4=Hotels across environments.
     */
    public function storageFolder(): string
    {
        $name = strtolower($this->name ?? '');

        return match (true) {
            str_contains($name, 'handover') => 'properties/handoverProject',
            str_contains($name, 'ongoing') => 'properties/ongoingProject',
            str_contains($name, 'upcoming') => 'properties/upcomingProject',
            str_contains($name, 'hotel') => 'properties/hotelsResorts',
            default => 'properties/projectImages',
        };
    }
}
