<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'result_id',
        'exam_code',
        'student_name',
        'score',
        'max_score',
        'status_text',
        'reading_score',
        'listening_score',
        'writing_score',
        'speaking_score',
        'tab_switch_count',
        'ai_feedback',
        'description',
        'time_ago',
        'submitted_at',
    ];

    protected $casts = [
        'score' => 'float',
        'max_score' => 'float',
        'reading_score' => 'float',
        'listening_score' => 'float',
        'writing_score' => 'float',
        'speaking_score' => 'float',
        'tab_switch_count' => 'integer',
        'submitted_at' => 'datetime',
    ];
}
