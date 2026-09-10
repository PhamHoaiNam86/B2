<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GrammarTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GrammarController extends Controller
{
    public function index()
    {
        $topics = GrammarTopic::orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $topics,
        ]);
    }

    public function completeTopic($id)
    {
        $topic = GrammarTopic::findOrFail($id);
        $topic->status = 'completed';
        $topic->badge_label = 'HOÀN THÀNH';
        $topic->score = 9.5;
        $topic->progress = 100;
        $topic->save();

        return response()->json([
            'success' => true,
            'message' => 'Đã hoàn thành bài học ngữ pháp!',
            'data' => $topic,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'level' => 'nullable|string',
            'category' => 'required|string',
            'summary' => 'required|string',
            'content' => 'nullable|string',
            'rule_points' => 'nullable|array',
            'examples' => 'nullable|array',
        ]);

        $topic = GrammarTopic::create([
            'topic_id' => 'g-'.Str::lower(Str::random(6)),
            'title' => $validated['title'],
            'level' => $validated['level'] ?? 'B2',
            'category' => $validated['category'],
            'summary' => $validated['summary'],
            'content' => $validated['content'] ?? $validated['summary'],
            'rule_points' => $validated['rule_points'] ?? [],
            'examples' => $validated['examples'] ?? [],
            'status' => 'in_progress',
            'progress' => 0,
            'score' => 0,
            'badge_label' => 'CẦN LUYỆN',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo chuyên đề ngữ pháp mới thành công!',
            'data' => $topic,
        ]);
    }

    public function update(Request $request, $id)
    {
        $topic = GrammarTopic::where('id', $id)->orWhere('topic_id', $id)->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'level' => 'nullable|string',
            'category' => 'sometimes|required|string',
            'summary' => 'sometimes|required|string',
            'content' => 'nullable|string',
            'rule_points' => 'nullable|array',
            'examples' => 'nullable|array',
        ]);

        $topic->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật chuyên đề ngữ pháp thành công!',
            'data' => $topic,
        ]);
    }

    public function destroy($id)
    {
        $topic = GrammarTopic::where('id', $id)->orWhere('topic_id', $id)->first();
        if ($topic) {
            $topic->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa chuyên đề ngữ pháp khỏi CSDL!',
        ]);
    }
}
