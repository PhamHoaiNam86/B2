<?php

use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\GrammarController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\VocabController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Exams & Results & Questions
    Route::get('/exams', [ExamController::class, 'index']);
    Route::get('/questions', [ExamController::class, 'getQuestions']);
    Route::get('/questions/{examCode}', [ExamController::class, 'getQuestions']);
    Route::get('/results', [ExamController::class, 'getResults']);
    Route::post('/exams/submit', [ExamController::class, 'submit']);

    // Vocabularies
    Route::get('/vocabs', [VocabController::class, 'index']);
    Route::post('/vocabs', [VocabController::class, 'store']);
    Route::patch('/vocabs/{id}/favorite', [VocabController::class, 'toggleFavorite']);

    // Grammar
    Route::get('/grammar', [GrammarController::class, 'index']);
    Route::post('/grammar/{id}/complete', [GrammarController::class, 'completeTopic']);

    // Students & Documents
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/docs', [DocumentController::class, 'index']);
});
