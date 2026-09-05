<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_code',
        'title',
        'duration_minutes',
        'level',
        'description',
        'total_questions',
        'total_score',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
