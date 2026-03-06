<?php

namespace App\Concerns;

trait HasImage
{
    protected static function bootHasImage()
    {
        static::deleting(function ($model) {
            if ($model->image) {
                $model->image->delete();
            }
        });
    }
}
