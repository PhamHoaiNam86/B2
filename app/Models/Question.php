<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_code',
        'section',
        'sub_section',
        'question_number',
        'title',
        'context_text',
        'options_json',
        'correct_option_id',
        'explanation',
    ];

    protected $casts = [
        'options_json' => 'array',
    ];
}
