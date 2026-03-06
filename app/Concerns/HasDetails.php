<?php

namespace App\Concerns;

trait HasDetails
{
    protected static function bootHasDetails()
    {
        static::deleting(function ($model) {
            if ($model->details) {
                $model->details->delete();
            }
        });
    }
}
