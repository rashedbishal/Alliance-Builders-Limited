<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Details extends Model
{
    use HasFactory;
    public function detailable() : MorphTo
    {
        return $this->morphTo('detailable', 'detailable_type', 'detailable_id', 'project_id');
    }
}
