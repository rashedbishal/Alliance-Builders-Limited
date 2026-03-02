<?php

namespace App\Models\Properties;

use App\Models\Config\Details;
use App\Models\Config\Facility;
use App\Models\Config\Location;
use App\Models\Config\Metadata;
use App\Models\Config\ProjectType;
use App\Models\Config\Tag;
use App\Models\Visual\Image;
use App\Models\Visual\ProjectImage;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'google_map_url',
        'floors',
        'size',
        'description',
        'price',
        'construction_start_date',
        'handover_date',
        'isFeatured',
        'project_id',
    ];

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

    protected function slug(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value,
            set: fn ($value) => Str::slug($value),
        );
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->whereRaw("REPLACE(LOWER(name), ' ', '-') = ?", [$value])->firstOrFail();
    }

    public function projectType(): BelongsTo
    {
        return $this->belongsTo(ProjectType::class, 'project_type_id', 'id');
    }

    public function projectImages(): hasMany
    {
        return $this->hasMany(ProjectImage::class, 'project_id', 'project_id');
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable', 'imageable_type', 'imageable_id', 'project_id');
    }

    public function video(): MorphOne
    {
        return $this->morphOne(Image::class, 'videoable', 'videoable_type', 'videoable_id', 'project_id');
    }

    public function details(): MorphOne
    {
        return $this->morphOne(Details::class, 'detailable', 'detailable_type', 'detailable_id', 'project_id');
    }

    public function facilities(): MorphToMany
    {
        return $this->morphToMany(Facility::class, 'facilitable', 'facilitable', 'facilitable_id', 'facility_id', 'project_id', 'id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable', 'taggable', 'taggable_id', 'tag_id', 'project_id', 'id');
    }

    public function locations(): MorphToMany
    {
        return $this->morphToMany(Location::class, 'locationable', 'locationable', 'locationable_id', 'location_id', 'project_id', 'id');
    }

    public function metadata(): MorphMany
    {
        return $this->morphMany(Metadata::class, 'metadatable', 'metadatable_type', 'metadatable_id', 'project_id');
    }
}
