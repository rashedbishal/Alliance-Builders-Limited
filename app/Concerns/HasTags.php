<?php

namespace App\Concerns;

trait HasTags
{
    public static function bootHasTags()
    {
        static::deleting(function ($model) {
            $model->tags()->detach();
        });
    }
}
