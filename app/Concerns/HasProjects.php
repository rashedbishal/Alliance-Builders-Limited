<?php

namespace App\Concerns;

trait HasProjects
{
    protected static function bootProjects()
    {
        static::deleting(function ($model) {
            if ($model->image) {
                $model->projects->detach();
            }
        });
    }
}
