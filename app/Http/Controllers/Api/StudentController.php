<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Get list of all students (registered users + existing student records).
     */
    public function index()
    {
        $users = User::where('is_admin', false)->orderBy('id', 'desc')->get();

        $students = $users->map(function ($user, $index) {
            $statusLabel = match ($user->approval_status) {
                'approved' => 'Đã duyệt',
                'rejected' => 'Từ chối',
                default => 'Chờ duyệt',
            };

            return [
                'id' => $user->id,
                'student_id' => 'STD-'.str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'class_name' => 'TELC B2-K26',
                'avatar_url' => $user->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                'target_score' => 300,
                'current_score' => 240,
                'status' => $statusLabel,
                'approval_status' => $user->approval_status ?? 'pending',
                'email_verified_at' => $user->email_verified_at,
                'target_exam_date' => $user->created_at ? $user->created_at->format('Y-m-d') : now()->format('Y-m-d'),
            ];
        });

        // Fallback to sample students table if no registered users exist
        if ($students->isEmpty()) {
            $sampleStudents = Student::orderBy('id', 'desc')->get()->map(function ($s) {
                return [
                    'id' => $s->id,
                    'student_id' => $s->student_id,
                    'name' => $s->name,
                    'email' => $s->email,
                    'username' => explode('@', $s->email ?? 'student')[0],
                    'class_name' => $s->class_name,
                    'avatar_url' => $s->avatar_url,
                    'target_score' => $s->target_score,
                    'current_score' => $s->current_score,
                    'status' => 'Đã duyệt',
                    'approval_status' => 'approved',
                    'target_exam_date' => $s->target_exam_date,
                ];
            });
            $students = $sampleStudents;
        }

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    /**
     * Admin update approval status for a student account.
     */
    public function updateStatus(Request $request, $id)
    {
        $status = strtolower(trim((string) $request->input('status', '')));
        if (! in_array($status, ['approved', 'rejected', 'pending'])) {
            return response()->json([
                'success' => false,
                'message' => 'Trạng thái xét duyệt không hợp lệ. Chỉ chấp nhận: approved, rejected, pending',
            ], 422);
        }

        $user = User::find($id);

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thông tin học viên.',
            ], 404);
        }

        $user->approval_status = $status;
        $user->save();

        $statusText = match ($status) {
            'approved' => 'ĐÃ DUYỆT (Học viên được phép truy cập học)',
            'rejected' => 'TỪ CHỐI (Đã chặn quyền truy cập)',
            default => 'CHỜ DUYỆT',
        };

        return response()->json([
            'success' => true,
            'message' => "Đã cập nhật trạng thái học viên {$user->name} thành: {$statusText}",
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'approval_status' => $user->approval_status,
            ],
        ]);
    }
}
