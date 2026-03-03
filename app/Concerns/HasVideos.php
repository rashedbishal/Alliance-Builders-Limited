<?php

namespace App\Concerns;

trait HasVideos
{
    public static function bootHasVideos(): void
    {
        static::deleting(function ($model) {
            $model->videos()->each(function ($video) {
                $video->delete();
            });
        });
    }
}
