<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
{
    /** Slugs of the pages editable from the CMS, in display order. */
    public const SLUGS = ['privacy-policy', 'terms-of-service', 'refund-policy'];

    protected $fillable = [
        'slug',
        'title',
        'content',
    ];
}
