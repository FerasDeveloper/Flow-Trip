<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Picture extends Model
{
    use HasFactory;
    
    protected $fillable = [
      'reference',
      'owner_id'
    ];

    public function Owner(){
      return $this->belongsToMany(Owner::class);
    }
}
