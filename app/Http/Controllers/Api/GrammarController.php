<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GrammarTopic;

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
}
