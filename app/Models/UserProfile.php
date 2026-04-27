<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable=[
        'user_id',
        'nama',
        'status',
        'foto_profile',
        'description_profile',
        'team',
        'role'
    ];

    protected $table='users_profile';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
