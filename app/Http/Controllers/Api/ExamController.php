<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Question;
use App\Models\Vocabulary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ExamController extends Controller
{
    /**
     * Get all active exams.
     */
    public function index()
    {
        $exams = Exam::orderBy('id', 'asc')->get();

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
            'student_name' => 'nullable|string',
            'score' => 'nullable|numeric',
            'max_score' => 'nullable|numeric',
            'status_text' => 'nullable|string',
            'reading_score' => 'nullable|numeric',
            'listening_score' => 'nullable|numeric',
            'writing_score' => 'nullable|numeric',
            'speaking_score' => 'nullable|numeric',
            'tab_switch_count' => 'nullable|integer',
            'ai_feedback' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $reading = $validated['reading_score'] ?? 0;
        $listening = $validated['listening_score'] ?? 0;
        $writing = $validated['writing_score'] ?? 0;
        $speaking = $validated['speaking_score'] ?? 0;

        $totalScore = $validated['score'] ?? ($reading + $listening + $writing + $speaking);
        if ($totalScore == 0 && ($reading > 0 || $listening > 0)) {
            $totalScore = $reading + $listening + $writing + $speaking;
        }

        $maxScore = $validated['max_score'] ?? 300;
        $statusText = $validated['status_text'] ?? ($totalScore >= ($maxScore * 0.6) ? 'Đạt chuẩn' : 'Chưa đạt');

        $resultData = [
            'result_id' => 'RES-'.Str::upper(Str::random(6)),
            'exam_code' => $validated['exam_code'],
            'student_name' => $validated['student_name'] ?? 'Học Viên B2',
            'score' => $totalScore,
            'max_score' => $maxScore,
            'status_text' => $statusText,
        ];

        if (Schema::hasColumn('exam_results', 'reading_score')) {
            $resultData['reading_score'] = $validated['reading_score'] ?? 0;
        }
        if (Schema::hasColumn('exam_results', 'listening_score')) {
            $resultData['listening_score'] = $validated['listening_score'] ?? 0;
        }
        if (Schema::hasColumn('exam_results', 'writing_score')) {
            $resultData['writing_score'] = $validated['writing_score'] ?? 0;
        }
        if (Schema::hasColumn('exam_results', 'speaking_score')) {
            $resultData['speaking_score'] = $validated['speaking_score'] ?? 0;
        }
        if (Schema::hasColumn('exam_results', 'tab_switch_count')) {
            $resultData['tab_switch_count'] = $validated['tab_switch_count'] ?? 0;
        }
        if (Schema::hasColumn('exam_results', 'ai_feedback')) {
            $resultData['ai_feedback'] = $validated['ai_feedback'] ?? null;
        }
        if (Schema::hasColumn('exam_results', 'description')) {
            $resultData['description'] = $validated['description'] ?? 'Hoàn thành bài thi thử TELC B2';
        }
        if (Schema::hasColumn('exam_results', 'time_ago')) {
            $resultData['time_ago'] = 'Vừa xong';
        }
        if (Schema::hasColumn('exam_results', 'submitted_at')) {
            $resultData['submitted_at'] = now();
        }

        $result = ExamResult::create($resultData);

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
            'provider' => 'nullable|string',
            'duration_minutes' => 'nullable|integer',
            'description' => 'nullable|string',
            'total_questions' => 'nullable|integer',
            'questions' => 'nullable|array',
            'sections' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            $provider = $request->input('provider');
            if (! $provider) {
                $rawName = strtoupper($validated['name'] ?? '');
                $rawLevel = strtoupper($validated['level'] ?? '');
                $provider = (str_contains($rawName, 'GOETHE') || str_contains($rawLevel, 'GOETHE')) ? 'GOETHE' : 'TELC';
            }

            $examData = [
                'name' => $validated['name'],
                'level' => $validated['level'] ?? 'TELC B2',
                'duration_minutes' => $validated['duration_minutes'] ?? 90,
                'description' => $validated['description'] ?? '',
                'total_questions' => $validated['total_questions'] ?? (isset($validated['questions']) ? count($validated['questions']) : 0),
                'target_score' => 225,
                'pass_rate' => '88%',
                'is_active' => true,
            ];

            if (Schema::hasColumn('exams', 'provider')) {
                $examData['provider'] = $provider;
            }
            if (Schema::hasColumn('exams', 'sections_json')) {
                $examData['sections_json'] = $validated['sections'] ?? null;
            }

            $targetCode = $validated['exam_code'];
            if (Exam::where('exam_code', $targetCode)->exists()) {
                $targetCode = $targetCode.'-'.Str::lower(Str::random(4));
            }

            $exam = Exam::create(array_merge($examData, ['exam_code' => $targetCode]));

            if (! empty($exam->exam_code) && isset($validated['questions']) && is_array($validated['questions'])) {
                Question::where('exam_code', $exam->exam_code)->delete();

                $hasType = Schema::hasColumn('questions', 'type');
                $hasAudioUrl = Schema::hasColumn('questions', 'audio_url');
                $hasImageUrl = Schema::hasColumn('questions', 'image_url');

                foreach ($validated['questions'] as $index => $q) {
                    $options = isset($q['options']) && is_array($q['options']) ? array_map(function ($opt, $optIdx) {
                        $isCorrect = isset($opt['isCorrect']) && ($opt['isCorrect'] === true || $opt['isCorrect'] === 'true' || $opt['isCorrect'] === 1 || $opt['isCorrect'] === '1');
                        $letter = chr(65 + $optIdx);

                        return [
                            'id' => $opt['id'] ?? ('opt-'.($optIdx + 1)),
                            'text' => $opt['text'] ?? '',
                            'isCorrect' => $isCorrect,
                            'letter' => $letter,
                        ];
                    }, $q['options'], array_keys($q['options'])) : [];

                    $correctOpt = null;
                    foreach ($options as $opt) {
                        if (! empty($opt['isCorrect'])) {
                            $correctOpt = $opt['id'];
                            break;
                        }
                    }

                    if (! $correctOpt) {
                        $passedCorrect = $q['correctOptionId'] ?? $q['correct_option_id'] ?? null;
                        if ($passedCorrect) {
                            foreach ($options as &$opt) {
                                if (strtoupper((string) $opt['id']) === strtoupper((string) $passedCorrect) || strtoupper((string) $opt['letter']) === strtoupper((string) $passedCorrect)) {
                                    $opt['isCorrect'] = true;
                                    $correctOpt = $opt['id'];
                                    break;
                                }
                            }
                        }
                    }

                    if (! $correctOpt && ! empty($options)) {
                        $options[0]['isCorrect'] = true;
                        $correctOpt = $options[0]['id'];
                    }

                    $title = ! empty($q['title']) ? $q['title'] : (! empty($q['questionText']) ? $q['questionText'] : ('Câu '.($index + 1)));

                    $rawSubSection = $q['subSection'] ?? $q['sub_section'] ?? '';
                    $rawContext = $q['contextText'] ?? $q['context_text'] ?? null;

                    if (mb_strlen($rawSubSection) > 240) {
                        if (empty($rawContext)) {
                            $rawContext = $rawSubSection;
                        } else {
                            $rawContext = $rawSubSection."\n\n".$rawContext;
                        }
                        $rawSubSection = mb_substr($rawSubSection, 0, 240);
                    }

                    $questionData = [
                        'exam_code' => $exam->exam_code,
                        'section' => $q['section'] ?? 'Phần 1',
                        'sub_section' => $rawSubSection,
                        'question_number' => $index + 1,
                        'title' => $title,
                        'context_text' => $rawContext,
                        'options_json' => $options,
                        'correct_option_id' => $correctOpt,
                        'explanation' => $q['explanation'] ?? null,
                    ];

                    if ($hasType) {
                        $questionData['type'] = $q['type'] ?? 'choice';
                    }
                    if ($hasAudioUrl) {
                        $questionData['audio_url'] = $q['audioUrl'] ?? $q['audio_url'] ?? null;
                    }
                    if ($hasImageUrl) {
                        $questionData['image_url'] = $q['imageUrl'] ?? $q['image_url'] ?? null;
                    }

                    Question::create($questionData);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tạo bộ đề thi thành công trong CSDL!',
                'data' => $exam,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Lỗi lưu CSDL: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing exam in SQL DB.
     */
    public function update(Request $request, $id)
    {
        $examCode = $request->input('exam_code', $id);
        $exam = Exam::where('id', $id)
            ->orWhere('exam_code', $id)
            ->orWhere('exam_code', $examCode)
            ->first();

        $validated = $request->validate([
            'exam_code' => 'nullable|string',
            'name' => 'sometimes|required|string',
            'level' => 'nullable|string',
            'provider' => 'nullable|string',
            'duration_minutes' => 'nullable|integer',
            'description' => 'nullable|string',
            'total_questions' => 'nullable|integer',
            'questions' => 'nullable|array',
            'sections' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            $hasProviderCol = Schema::hasColumn('exams', 'provider');
            $hasSectionsCol = Schema::hasColumn('exams', 'sections_json');

            if (! $exam) {
                $rawName = strtoupper($validated['name'] ?? 'Đề thi mới');
                $rawLevel = strtoupper($validated['level'] ?? 'TELC B2');
                $provider = $validated['provider'] ?? ((str_contains($rawName, 'GOETHE') || str_contains($rawLevel, 'GOETHE')) ? 'GOETHE' : 'TELC');

                $createData = [
                    'exam_code' => $validated['exam_code'] ?? $examCode,
                    'name' => $validated['name'] ?? 'Đề thi mới',
                    'level' => $validated['level'] ?? 'TELC B2',
                    'duration_minutes' => $validated['duration_minutes'] ?? 90,
                    'description' => $validated['description'] ?? '',
                    'total_questions' => $validated['total_questions'] ?? (isset($validated['questions']) ? count($validated['questions']) : 0),
                    'target_score' => 225,
                    'pass_rate' => '88%',
                    'is_active' => true,
                ];

                if ($hasProviderCol) {
                    $createData['provider'] = $provider;
                }
                if ($hasSectionsCol) {
                    $createData['sections_json'] = $validated['sections'] ?? null;
                }

                $exam = Exam::create($createData);
            }

            if (isset($validated['name'])) {
                $exam->name = $validated['name'];
            }
            if (isset($validated['level'])) {
                $exam->level = $validated['level'];
            }
            if ($hasProviderCol) {
                if ($request->has('provider')) {
                    $exam->provider = $request->input('provider');
                } elseif (isset($validated['name']) || isset($validated['level'])) {
                    $rawName = strtoupper($exam->name);
                    $rawLevel = strtoupper($exam->level);
                    if (str_contains($rawName, 'GOETHE') || str_contains($rawLevel, 'GOETHE')) {
                        $exam->provider = 'GOETHE';
                    }
                }
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
            if (isset($validated['sections']) && $hasSectionsCol) {
                $exam->sections_json = $validated['sections'];
            }

            $exam->save();

            if (! empty($exam->exam_code) && isset($validated['questions']) && is_array($validated['questions'])) {
                Question::where('exam_code', $exam->exam_code)->delete();

                $hasType = Schema::hasColumn('questions', 'type');
                $hasAudioUrl = Schema::hasColumn('questions', 'audio_url');
                $hasImageUrl = Schema::hasColumn('questions', 'image_url');

                foreach ($validated['questions'] as $index => $q) {
                    $options = isset($q['options']) && is_array($q['options']) ? array_map(function ($opt, $optIdx) {
                        $isCorrect = isset($opt['isCorrect']) && ($opt['isCorrect'] === true || $opt['isCorrect'] === 'true' || $opt['isCorrect'] === 1 || $opt['isCorrect'] === '1');
                        $letter = chr(65 + $optIdx);

                        return [
                            'id' => $opt['id'] ?? ('opt-'.($optIdx + 1)),
                            'text' => $opt['text'] ?? '',
                            'isCorrect' => $isCorrect,
                            'letter' => $letter,
                        ];
                    }, $q['options'], array_keys($q['options'])) : [];

                    $correctOpt = null;
                    foreach ($options as $opt) {
                        if (! empty($opt['isCorrect'])) {
                            $correctOpt = $opt['id'];
                            break;
                        }
                    }

                    if (! $correctOpt) {
                        $passedCorrect = $q['correctOptionId'] ?? $q['correct_option_id'] ?? null;
                        if ($passedCorrect) {
                            foreach ($options as &$opt) {
                                if (strtoupper((string) $opt['id']) === strtoupper((string) $passedCorrect) || strtoupper((string) $opt['letter']) === strtoupper((string) $passedCorrect)) {
                                    $opt['isCorrect'] = true;
                                    $correctOpt = $opt['id'];
                                    break;
                                }
                            }
                        }
                    }

                    if (! $correctOpt && ! empty($options)) {
                        $options[0]['isCorrect'] = true;
                        $correctOpt = $options[0]['id'];
                    }

                    $title = ! empty($q['title']) ? $q['title'] : (! empty($q['questionText']) ? $q['questionText'] : ('Câu '.($index + 1)));

                    $rawSubSection = $q['subSection'] ?? $q['sub_section'] ?? '';
                    $rawContext = $q['contextText'] ?? $q['context_text'] ?? null;

                    if (mb_strlen($rawSubSection) > 240) {
                        if (empty($rawContext)) {
                            $rawContext = $rawSubSection;
                        } else {
                            $rawContext = $rawSubSection."\n\n".$rawContext;
                        }
                        $rawSubSection = mb_substr($rawSubSection, 0, 240);
                    }

                    $questionData = [
                        'exam_code' => $exam->exam_code,
                        'section' => $q['section'] ?? 'Phần 1',
                        'sub_section' => $rawSubSection,
                        'question_number' => $index + 1,
                        'title' => $title,
                        'context_text' => $rawContext,
                        'options_json' => $options,
                        'correct_option_id' => $correctOpt,
                        'explanation' => $q['explanation'] ?? null,
                    ];

                    if ($hasType) {
                        $questionData['type'] = $q['type'] ?? 'choice';
                    }
                    if ($hasAudioUrl) {
                        $questionData['audio_url'] = $q['audioUrl'] ?? $q['audio_url'] ?? null;
                    }
                    if ($hasImageUrl) {
                        $questionData['image_url'] = $q['imageUrl'] ?? $q['image_url'] ?? null;
                    }

                    Question::create($questionData);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật đề thi thành công!',
                'data' => $exam,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Lỗi cập nhật CSDL: '.$e->getMessage(),
            ], 500);
        }
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

    /**
     * Upload an audio MP3 file and return public URL.
     */
    public function uploadAudio(Request $request)
    {
        if (! $request->hasFile('audio')) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể nhận file âm thanh. Dung lượng file có thể vượt quá giới hạn tải lên của máy chủ (upload_max_filesize). Vui lòng nén file MP3 dưới 30MB.',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'audio' => 'required|file|mimes:mp3,wav,ogg,m4a,aac,mp4|max:30720',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'File âm thanh không hợp lệ (hỗ trợ MP3, WAV, OGG, M4A, AAC) hoặc vượt quá 30MB.',
            ], 422);
        }

        $file = $request->file('audio');
        $fileName = time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

        $destinationPath = public_path('uploads/audios');
        if (! file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $file->move($destinationPath, $fileName);
        $audioUrl = '/uploads/audios/'.$fileName;

        return response()->json([
            'success' => true,
            'message' => 'Tải file âm thanh lên thành công!',
            'url' => $audioUrl,
        ]);
    }

    /**
     * Upload an image file for section banner or questions.
     */
    public function uploadImage(Request $request)
    {
        if (! $request->hasFile('image')) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể nhận file hình ảnh. Dung lượng file có thể vượt quá giới hạn tải lên của máy chủ.',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|file|mimes:jpg,jpeg,png,webp,gif,svg|max:15360',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'File hình ảnh không hợp lệ (hỗ trợ JPG, PNG, WEBP, GIF, SVG) hoặc vượt quá 15MB.',
            ], 422);
        }

        $file = $request->file('image');
        $fileName = time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

        $destinationPath = public_path('uploads/images');
        if (! file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $file->move($destinationPath, $fileName);
        $imageUrl = '/uploads/images/'.$fileName;

        return response()->json([
            'success' => true,
            'message' => 'Tải ảnh banner phần thi lên thành công!',
            'url' => $imageUrl,
        ]);
    }

    /**
     * Translate German text to Vietnamese.
     */
    public function translate(Request $request)
    {
        $text = trim($request->input('q', ''));
        if (empty($text)) {
            return response()->json(['success' => false, 'translation' => '']);
        }

        // 1. Check DB vocabularies table
        try {
            $vocab = Vocabulary::whereRaw('LOWER(word) = ?', [mb_strtolower($text)])
                ->orWhereRaw('LOWER(CONCAT(COALESCE(article, ""), " ", word)) = ?', [mb_strtolower($text)])
                ->first();

            if ($vocab && ! empty($vocab->meaning_vi)) {
                return response()->json([
                    'success' => true,
                    'translation' => $vocab->meaning_vi,
                    'source' => 'db',
                ]);
            }
        } catch (\Throwable $e) {
        }

        // 2. Server-side Google Translate API call
        try {
            $url = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=de&tl=vi&q='.urlencode($text);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($ch);
            curl_close($ch);

            if ($response) {
                $data = json_decode($response, true);
                if (isset($data[0]) && is_array($data[0])) {
                    $translatedParts = array_map(function ($part) {
                        return $part[0] ?? '';
                    }, $data[0]);
                    $translatedText = trim(implode('', $translatedParts));
                    if (! empty($translatedText) && $translatedText !== $text) {
                        return response()->json([
                            'success' => true,
                            'translation' => $translatedText,
                            'source' => 'google',
                        ]);
                    }
                }
            }
        } catch (\Throwable $e) {
        }

        // 3. Fallback to MyMemory
        try {
            $url = 'https://api.mymemory.translated.net/get?q='.urlencode($text).'&langpair=de|vi';
            $res = @file_get_contents($url);
            if ($res) {
                $data = json_decode($res, true);
                $raw = $data['responseData']['translatedText'] ?? null;
                if ($raw && ! str_contains($raw, 'MYMEMORY') && ! str_contains($raw, 'quota')) {
                    return response()->json([
                        'success' => true,
                        'translation' => $raw,
                        'source' => 'mymemory',
                    ]);
                }
            }
        } catch (\Throwable $e) {
        }

        return response()->json([
            'success' => true,
            'translation' => 'Bản dịch: '.$text,
            'source' => 'fallback',
        ]);
    }
}
