<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class track_intern_member extends Model
{
    protected $fillable = [
        'track_intern_id',
        'name',
        'nim',
        'major',
        'university',
        'work_place',
        'job_desk',
        'image',
    ];

    public function trackIntern()
    {
        return $this->belongsTo(track_intern::class);
    }
}
