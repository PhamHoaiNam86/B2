<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::orderBy('id', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }
}
