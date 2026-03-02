<?php

namespace App\Concerns;

trait HasVideo
{
    protected static function bootHasVideo()
    {
        static::deleting(function ($model) {
            if ($model?->video) {
                $model->video->delete();
            }
        });
    }
}
