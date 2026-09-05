<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrammarTopic extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic_id',
        'title',
        'level',
        'category',
        'summary',
        'content',
        'rule_points',
        'examples',
        'status',
        'progress',
        'score',
        'badge_label',
    ];

    protected $casts = [
        'rule_points' => 'array',
        'examples' => 'array',
        'score' => 'float',
        'progress' => 'integer',
    ];
}
