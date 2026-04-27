<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = ['title', 'description'];

    public function images()
    {
        return $this->hasMany(WorkImage::class);
    }
}
