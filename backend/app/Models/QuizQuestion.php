<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'text_pt',
        'text_en',
        'options_pt',
        'options_en',
        'correct_index',
        'fact_pt',
        'fact_en',
        'source',
    ];

    protected $casts = [
        'options_pt' => 'array',
        'options_en' => 'array',
        'correct_index' => 'integer',
    ];
}
