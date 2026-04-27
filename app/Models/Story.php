<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    protected $fillable = ['title', 'description', 'time'];

    public function images()
    {
        return $this->hasMany(StoryImage::class);
    }
}
