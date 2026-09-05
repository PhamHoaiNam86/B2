<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vocabulary extends Model
{
    use HasFactory;

    protected $fillable = [
        'vocab_id',
        'word',
        'article',
        'plural',
        'pos',
        'phonetic',
        'meaning_vi',
        'example_de',
        'example_vi',
        'topic',
        'status',
        'is_favorite',
    ];

    protected $casts = [
        'is_favorite' => 'boolean',
    ];
}
