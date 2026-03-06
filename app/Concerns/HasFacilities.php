<?php

namespace App\Concerns;

trait HasFacilities
{
    public static function bootHasFacilities()
    {
        static::deleting(function ($model) {
            $model->facilities()->detach();
        });
    }
}
