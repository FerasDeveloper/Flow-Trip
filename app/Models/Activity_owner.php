<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity_owner extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function activity(){
      return $this->belongsTo(Activity::class);
    }
    public function Owner(){
      return $this->belongsTo(Owner::class);
    }
}
