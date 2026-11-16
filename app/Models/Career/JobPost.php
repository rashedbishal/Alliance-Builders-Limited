<?php

namespace App\Models\Career;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPost extends Model
{
    public const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

    protected $fillable = [
        'title',
        'department',
        'location',
        'job_type',
        'vacancies',
        'experience',
        'salary',
        'deadline',
        'description',
        'notification_email',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date:Y-m-d',
            'is_active' => 'boolean',
            'vacancies' => 'integer',
        ];
    }

    /**
     * Posts visible on the public Career page: switched on and either
     * without a deadline or with a deadline that is today or later.
     */
    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(fn (Builder $q) => $q->whereNull('deadline')->orWhereDate('deadline', '>=', today()));
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
