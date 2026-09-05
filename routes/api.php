<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\VocabController;
use App\Http\Controllers\Api\GrammarController;
use App\Http\Controllers\Api\StudentController;

Route::prefix('v1')->group(function () {
    // Exams & Results
    Route::get('/exams', [ExamController::class, 'index']);
    Route::get('/results', [ExamController::class, 'getResults']);
    Route::post('/exams/submit', [ExamController::class, 'submit']);

    // Vocabularies
    Route::get('/vocabs', [VocabController::class, 'index']);
    Route::post('/vocabs', [VocabController::class, 'store']);
    Route::patch('/vocabs/{id}/favorite', [VocabController::class, 'toggleFavorite']);

    // Grammar
    Route::get('/grammar', [GrammarController::class, 'index']);
    Route::post('/grammar/{id}/complete', [GrammarController::class, 'completeTopic']);

    // Students
    Route::get('/students', [StudentController::class, 'index']);
});
