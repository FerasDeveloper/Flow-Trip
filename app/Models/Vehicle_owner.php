<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle_owner extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function owner(){
      return $this->belongsTo(Owner::class);
    }

    public function vehicle(){
      return $this->hasMany(Vehicle::class);
    }
}
