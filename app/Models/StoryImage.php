<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoryImage extends Model
{
    protected $fillable = ['story_id', 'image_path'];

    public function story()
    {
        return $this->belongsTo(Story::class);
    }
}
