<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class track_intern extends Model
{
    protected $fillable = [
        'Batch',
        'start_date',
        'end_date',
        'achievement_title',
        'achievement_description',
    ];

    public function members()
    {
        return $this->hasMany(track_intern_member::class);
    }
}
