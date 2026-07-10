<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'nasa_type',
        'nasa_id',
        'title',
        'image_url',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}
