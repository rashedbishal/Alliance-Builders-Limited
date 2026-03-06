<?php

namespace App\Concerns;

trait HasMetadata
{
    public static function bootHasMetadata()
    {
        static::deleting(function ($model) {
            $model->metadata()->each(function ($meta) {
                $meta->delete();
            });
        });
    }
}
