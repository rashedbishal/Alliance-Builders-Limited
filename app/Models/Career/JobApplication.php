<?php

namespace App\Models\Career;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    /**
     * CVs live on the private "local" disk (storage/app/private) under this
     * directory, so they are never reachable by public URL.
     */
    public const CV_DIRECTORY = 'career/cv';

    protected $fillable = [
        'job_post_id',
        'job_title',
        'name',
        'phone',
        'email',
        'message',
        'cv_path',
        'cv_original_name',
    ];

    protected $hidden = ['cv_path'];

    public function jobPost(): BelongsTo
    {
        return $this->belongsTo(JobPost::class);
    }

    public function cvStoragePath(): string
    {
        return self::CV_DIRECTORY.'/'.$this->cv_path;
    }
}
