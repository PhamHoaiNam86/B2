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

    /**
     * Store a newly created exam and its questions in SQL DB.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_code' => 'required|string',
            'name' => 'required|string',
            'level' => 'nullable|string',
            'duration_minutes' => 'nullable|integer',
            'description' => 'nullable|string',
            'total_questions' => 'nullable|integer',
            'questions' => 'nullable|array',
        ]);

        $exam = Exam::create([
            'exam_code' => $validated['exam_code'],
            'title' => $validated['name'],
            'level' => $validated['level'] ?? 'TELC B2',
            'duration_minutes' => $validated['duration_minutes'] ?? 90,
            'description' => $validated['description'] ?? '',
            'total_questions' => $validated['total_questions'] ?? (isset($validated['questions']) ? count($validated['questions']) : 0),
            'total_score' => 300,
            'is_active' => true,
        ]);

        if (! empty($validated['questions'])) {
            foreach ($validated['questions'] as $index => $q) {
                $options = isset($q['options']) ? array_map(function ($opt) {
                    return [
                        'id' => $opt['id'] ?? Str::random(4),
                        'text' => $opt['text'] ?? '',
                        'isCorrect' => ! empty($opt['isCorrect']),
                    ];
                }, $q['options']) : [];

                $correctOpt = null;
                foreach ($options as $opt) {
                    if (! empty($opt['isCorrect'])) {
                        $correctOpt = $opt['id'];
                        break;
                    }
                }

                Question::create([
                    'exam_code' => $exam->exam_code,
                    'section' => $q['section'] ?? 'Leseverstehen',
                    'sub_section' => $q['subSection'] ?? 'Teil 1',
                    'question_number' => $index + 1,
                    'title' => $q['title'] ?? $q['questionText'] ?? ('Câu '.($index + 1)),
                    'context_text' => $q['contextText'] ?? null,
                    'options_json' => $options,
                    'correct_option_id' => $correctOpt ?? ($options[0]['id'] ?? 'a'),
                    'explanation' => $q['explanation'] ?? null,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Tạo bộ đề thi thành công trong CSDL!',
            'data' => $exam,
        ]);
    }

    /**
     * Update an existing exam in SQL DB.
     */
    public function update(Request $request, $id)
    {
        $exam = Exam::where('id', $id)->orWhere('exam_code', $id)->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'level' => 'nullable|string',
            'duration_minutes' => 'nullable|integer',
            'description' => 'nullable|string',
            'total_questions' => 'nullable|integer',
        ]);

        if (isset($validated['name'])) {
            $exam->title = $validated['name'];
        }
        if (isset($validated['level'])) {
            $exam->level = $validated['level'];
        }
        if (isset($validated['duration_minutes'])) {
            $exam->duration_minutes = $validated['duration_minutes'];
        }
        if (isset($validated['description'])) {
            $exam->description = $validated['description'];
        }
        if (isset($validated['total_questions'])) {
            $exam->total_questions = $validated['total_questions'];
        }

        $exam->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật đề thi thành công!',
            'data' => $exam,
        ]);
    }

    /**
     * Delete an exam and its questions from SQL DB.
     */
    public function destroy($id)
    {
        $exam = Exam::where('id', $id)->orWhere('exam_code', $id)->first();

        if ($exam) {
            Question::where('exam_code', $exam->exam_code)->delete();
            $exam->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa bộ đề thi khỏi CSDL SQL!',
        ]);
    }
}
