<?php

namespace App\Models\Visual;

use App\Models\Properties\Project;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    use HasFactory;

    protected $fillable = ['property_name', 'description', 'image', 'project_id'];

    private $path = '/storage/home/carousel/';

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? asset('storage/home/carousel/'.$value) : null,
            set: fn ($value) => $value,
        );
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
