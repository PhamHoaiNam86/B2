<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_code',
        'name',
        'duration_minutes',
        'level',
        'description',
        'total_questions',
        'target_score',
        'pass_rate',
        'is_active',
        'sections_json',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sections_json' => 'array',
    ];
}
