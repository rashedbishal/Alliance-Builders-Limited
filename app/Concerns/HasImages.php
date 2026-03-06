<?php

namespace App\Concerns;

trait HasImages
{
    public static function bootHasImages()
    {
        static::deleting(function ($model) {
            $model->images()->each(function ($image) {
                $image->delete();
            });
        });
    }
}
