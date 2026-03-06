<?php

namespace App\Models\Config;

use App\Concerns\HasProjects;
use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory, HasProjects;
    protected $fillable = ['name', 'description'];
    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected static function booted()
    {
        static::saving(function ($tag) {
            if ($tag->isDirty('name')) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    protected function slug() : Attribute
    {
        return Attribute::make(
            get: fn($value) => $value,
            set: fn($value) => Str::slug($value),
        );
    }
    public function resolveRouteBinding($value, $field = null)
    {
        return $this->whereRaw("REPLACE(LOWER(name), ' ', '-') = ?", [$value])->firstOrFail();
    }

    public function projects() : MorphToMany
    {
        return $this->morphedByMany(Project::class, 'taggable', 'taggable', 'tag_id', 'taggable_id', 'id', 'project_id');
    }

    public function metadata() : MorphMany
    {
        return $this->morphMany( Metadata::class, 'metadatable', 'metadatable_type', 'metadatable_id', 'id');
    }
}
