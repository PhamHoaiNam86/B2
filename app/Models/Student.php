<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'name',
        'email',
        'class_name',
        'avatar_url',
        'target_score',
        'current_score',
        'status',
        'target_exam_date',
    ];

    protected $casts = [
        'target_score' => 'float',
        'current_score' => 'float',
        'target_exam_date' => 'string',
    ];
}
