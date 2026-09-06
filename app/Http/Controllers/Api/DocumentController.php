<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentMaterial;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $query = DocumentMaterial::query();
        if ($type) {
            $query->where('type', $type);
        }
        $docs = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $docs,
        ]);
    }
}
