<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ExamController extends Controller
{
    /**
     * Get all active exams.
     */
    public function index()
    {
        $exams = Exam::where('is_active', true)->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $exams,
        ]);
    }

    /**
     * Get questions for an exam or all questions.
     */
    public function getQuestions(Request $request, $examCode = null)
    {
        $query = Question::query();
        if ($examCode) {
            $query->where('exam_code', $examCode);
        }
        $questions = $query->orderBy('question_number', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $questions,
        ]);
    }

    /**
     * Get exam results feed.
     */
    public function getResults()
    {
        $results = ExamResult::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }

    /**
     * Submit an exam attempt and save scores / anti-cheat logs.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'exam_code' => 'required|string',
            'student_name' => 'required|string',
            'score' => 'required|numeric',
            'max_score' => 'nullable|numeric',
            'status_text' => 'required|string',
            'reading_score' => 'nullable|numeric',
            'listening_score' => 'nullable|numeric',
            'writing_score' => 'nullable|numeric',
            'speaking_score' => 'nullable|numeric',
            'tab_switch_count' => 'nullable|integer',
            'ai_feedback' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $result = ExamResult::create([
            'result_id' => 'RES-'.Str::upper(Str::random(6)),
            'exam_code' => $validated['exam_code'],
            'student_name' => $validated['student_name'],
            'score' => $validated['score'],
            'max_score' => $validated['max_score'] ?? 300,
            'status_text' => $validated['status_text'],
            'reading_score' => $validated['reading_score'] ?? 0,
            'listening_score' => $validated['listening_score'] ?? 0,
            'writing_score' => $validated['writing_score'] ?? 0,
            'speaking_score' => $validated['speaking_score'] ?? 0,
            'tab_switch_count' => $validated['tab_switch_count'] ?? 0,
            'ai_feedback' => $validated['ai_feedback'] ?? null,
            'description' => $validated['description'] ?? 'Hoàn thành bài thi thử TELC B2',
            'time_ago' => 'Vừa xong',
            'submitted_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lưu kết quả bài thi thành công!',
            'data' => $result,
        ]);
    }
}
