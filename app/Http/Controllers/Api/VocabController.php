<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vocabulary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VocabController extends Controller
{
    public function index(Request $request)
    {
        $query = Vocabulary::query();
        if ($request->has('level') && $request->level !== 'all') {
            $query->where('level', strtoupper($request->level));
        }
        $vocabs = $query->orderBy('id', 'desc')->get();

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
            'pos' => 'nullable|string',
            'phonetic' => 'nullable|string',
            'meaning_vi' => 'required|string',
            'example_de' => 'nullable|string',
            'example_vi' => 'nullable|string',
            'topic' => 'nullable|string',
            'level' => 'nullable|string',
        ]);

        $word = trim($validated['word']);
        $article = $validated['article'] ?? null;
        if (! $article) {
            $lowerWord = strtolower($word);
            if (str_starts_with($lowerWord, 'der ')) {
                $article = 'der';
                $word = trim(substr($word, 4));
            } elseif (str_starts_with($lowerWord, 'die ')) {
                $article = 'die';
                $word = trim(substr($word, 4));
            } elseif (str_starts_with($lowerWord, 'das ')) {
                $article = 'das';
                $word = trim(substr($word, 4));
            }
        }

        $pos = $validated['pos'] ?? ($article ? 'Nomen' : 'Wort');

        $vocab = Vocabulary::create([
            'vocab_id' => 'v-'.Str::lower(Str::random(6)),
            'word' => $word,
            'article' => $article,
            'plural' => $validated['plural'] ?? null,
            'pos' => $pos,
            'phonetic' => $validated['phonetic'] ?? null,
            'meaning_vi' => $validated['meaning_vi'],
            'example_de' => $validated['example_de'] ?? '',
            'example_vi' => $validated['example_vi'] ?? '',
            'topic' => $validated['topic'] ?? 'Chủ đề chung',
            'level' => strtoupper($validated['level'] ?? 'B2'),
            'status' => 'learning',
            'is_favorite' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm từ vựng thành công!',
            'data' => $vocab,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'level' => 'nullable|string',
            'topic' => 'nullable|string',
            'items' => 'required|array',
            'items.*.word' => 'required|string',
            'items.*.meaning_vi' => 'required|string',
            'items.*.article' => 'nullable|string',
            'items.*.plural' => 'nullable|string',
            'items.*.pos' => 'nullable|string',
            'items.*.phonetic' => 'nullable|string',
            'items.*.example_de' => 'nullable|string',
            'items.*.example_vi' => 'nullable|string',
            'items.*.level' => 'nullable|string',
            'items.*.topic' => 'nullable|string',
        ]);

        $defaultLevel = strtoupper($validated['level'] ?? 'B2');
        $defaultTopic = $validated['topic'] ?? 'Chủ đề chung';
        $created = [];

        DB::beginTransaction();
        try {
            foreach ($validated['items'] as $item) {
                $word = trim($item['word'] ?? '');
                if (! $word) {
                    continue;
                }

                $article = $item['article'] ?? null;
                if (! $article) {
                    $lowerWord = strtolower($word);
                    if (str_starts_with($lowerWord, 'der ')) {
                        $article = 'der';
                        $word = trim(substr($word, 4));
                    } elseif (str_starts_with($lowerWord, 'die ')) {
                        $article = 'die';
                        $word = trim(substr($word, 4));
                    } elseif (str_starts_with($lowerWord, 'das ')) {
                        $article = 'das';
                        $word = trim(substr($word, 4));
                    }
                }

                $pos = $item['pos'] ?? ($article ? 'Nomen' : 'Wort');

                $vocab = Vocabulary::create([
                    'vocab_id' => 'v-'.Str::lower(Str::random(6)),
                    'word' => $word,
                    'article' => $article,
                    'plural' => $item['plural'] ?? null,
                    'pos' => $pos,
                    'phonetic' => $item['phonetic'] ?? null,
                    'meaning_vi' => $item['meaning_vi'],
                    'example_de' => $item['example_de'] ?? '',
                    'example_vi' => $item['example_vi'] ?? '',
                    'topic' => $item['topic'] ?? $defaultTopic,
                    'level' => strtoupper($item['level'] ?? $defaultLevel),
                    'status' => 'learning',
                    'is_favorite' => false,
                ]);

                $created[] = $vocab;
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đã thêm thành công '.count($created).' từ vựng mới theo chủ đề!',
                'data' => $created,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Lỗi lưu từ vựng: '.$e->getMessage(),
            ], 500);
        }
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
            'level' => 'nullable|string',
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
