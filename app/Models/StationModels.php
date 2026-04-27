<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StationModels extends Model
{
   protected $fillable=[
    'station_code',
    'station_name'
   ];

   protected $table='station_code';
}
