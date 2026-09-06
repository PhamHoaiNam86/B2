<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'doc_id',
        'title',
        'type',
        'description',
        'is_premium',
        'badge',
        'download_url',
    ];

    protected $casts = [
        'is_premium' => 'boolean',
    ];
}
