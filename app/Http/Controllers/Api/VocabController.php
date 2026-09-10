<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vocabulary;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VocabController extends Controller
{
    public function index()
    {
        $vocabs = Vocabulary::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $vocabs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'word' => 'required|string',
            'article' => 'nullable|string',
            'plural' => 'nullable|string',
            'pos' => 'required|string',
            'phonetic' => 'nullable|string',
            'meaning_vi' => 'required|string',
            'example_de' => 'required|string',
            'example_vi' => 'required|string',
            'topic' => 'required|string',
        ]);

        $vocab = Vocabulary::create([
            'vocab_id' => 'v-'.Str::lower(Str::random(6)),
            'word' => $validated['word'],
            'article' => $validated['article'] ?? null,
            'plural' => $validated['plural'] ?? null,
            'pos' => $validated['pos'],
            'phonetic' => $validated['phonetic'] ?? null,
            'meaning_vi' => $validated['meaning_vi'],
            'example_de' => $validated['example_de'],
            'example_vi' => $validated['example_vi'],
            'topic' => $validated['topic'],
            'status' => 'learning',
            'is_favorite' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm từ vựng thành công!',
            'data' => $vocab,
        ]);
    }

    public function toggleFavorite($id)
    {
        $vocab = Vocabulary::findOrFail($id);
        $vocab->is_favorite = ! $vocab->is_favorite;
        $vocab->save();

        return response()->json([
            'success' => true,
            'data' => $vocab,
        ]);
    }

    public function update(Request $request, $id)
    {
        $vocab = Vocabulary::where('id', $id)->orWhere('vocab_id', $id)->firstOrFail();

        $validated = $request->validate([
            'word' => 'sometimes|required|string',
            'article' => 'nullable|string',
            'plural' => 'nullable|string',
            'pos' => 'sometimes|required|string',
            'phonetic' => 'nullable|string',
            'meaning_vi' => 'sometimes|required|string',
            'example_de' => 'sometimes|required|string',
            'example_vi' => 'sometimes|required|string',
            'topic' => 'sometimes|required|string',
            'status' => 'nullable|string',
        ]);

        $vocab->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật từ vựng thành công!',
            'data' => $vocab,
        ]);
    }

    public function destroy($id)
    {
        $vocab = Vocabulary::where('id', $id)->orWhere('vocab_id', $id)->first();
        if ($vocab) {
            $vocab->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa từ vựng khỏi CSDL!',
        ]);
    }
}
