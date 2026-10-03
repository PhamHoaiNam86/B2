<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new student account and send 6-digit OTP email.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = mb_strtolower(trim($request->input('email')));
        $username = trim($request->input('username', ''));

        if (empty($username)) {
            $username = explode('@', $email)[0];
        }

        // Check if user already exists and is verified
        $existingUser = User::where('email', $email)->orWhere('username', $username)->first();
        if ($existingUser && ! empty($existingUser->email_verified_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Địa chỉ Email hoặc Tên đăng nhập này đã được đăng ký tài khoản trên hệ thống.',
            ], 422);
        }

        // Generate random 6-digit OTP
        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $otpExpiresAt = now()->addMinutes(10);
        $isAdmin = str_contains(mb_strtolower($email), 'admin') || str_contains(mb_strtolower($username), 'admin');

        if ($existingUser) {
            $user = $existingUser;
            $user->name = $request->input('name');
            $user->password = Hash::make($request->input('password'));
            $user->otp_code = $otpCode;
            $user->otp_expires_at = $otpExpiresAt;
            $user->is_admin = $isAdmin;
            $user->save();
        } else {
            $user = User::create([
                'name' => $request->input('name'),
                'username' => $username,
                'email' => $email,
                'password' => Hash::make($request->input('password')),
                'otp_code' => $otpCode,
                'otp_expires_at' => $otpExpiresAt,
                'is_admin' => $isAdmin,
            ]);
        }

        // Send OTP Email to student
        $mailSent = $this->sendOtpEmail($user->email, $user->name, $otpCode);

        return response()->json([
            'success' => true,
            'message' => 'Mã xác thực OTP 6 số đã được gửi tới email '.$user->email.'. Vui lòng kiểm tra hòm thư!',
            'email' => $user->email,
            'mail_sent' => $mailSent,
            'otp_code' => $otpCode, // For fast demo / testing fallback
        ]);
    }

    /**
     * Verify 6-digit OTP code submitted by student.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'otp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập đầy đủ địa chỉ Email và mã OTP 6 số.',
            ], 422);
        }

        $email = mb_strtolower(trim($request->input('email')));
        $submittedOtp = trim((string) $request->input('otp'));

        $user = User::where('email', $email)->first();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thông tin đăng ký của email này.',
            ], 404);
        }

        // Check if OTP matches
        if (empty($user->otp_code) || $user->otp_code !== $submittedOtp) {
            return response()->json([
                'success' => false,
                'message' => 'Mã OTP không chính xác. Vui lòng kiểm tra lại email và nhập chính xác 6 chữ số!',
            ], 422);
        }

        // Check if OTP is expired
        if ($user->otp_expires_at && now()->gt($user->otp_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Mã OTP này đã hết hạn (sau 10 phút). Vui lòng bấm "Gửi lại mã OTP" để nhận mã mới!',
            ], 422);
        }

        // OTP Valid! Mark email as verified and clear OTP code
        $user->email_verified_at = now();
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        $role = $user->is_admin ? 'admin' : 'student';

        return response()->json([
            'success' => true,
            'message' => 'Xác thực mã OTP thành công! Đang đăng nhập vào hệ thống...',
            'role' => $role,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $role,
            ],
        ]);
    }

    /**
     * Resend a new 6-digit OTP code to student email.
     */
    public function resendOtp(Request $request)
    {
        $email = mb_strtolower(trim($request->input('email', '')));
        if (empty($email)) {
            return response()->json([
                'success' => false,
                'message' => 'Địa chỉ Email không được để trống.',
            ], 422);
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tài khoản tương ứng với email này.',
            ], 404);
        }

        // Generate new 6-digit OTP
        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->otp_code = $otpCode;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        $mailSent = $this->sendOtpEmail($user->email, $user->name, $otpCode);

        return response()->json([
            'success' => true,
            'message' => 'Mã OTP 6 số mới đã được gửi lại về hòm thư '.$user->email,
            'email' => $user->email,
            'mail_sent' => $mailSent,
            'otp_code' => $otpCode,
        ]);
    }

    /**
     * Authenticate user with Email/Username & Password.
     */
    public function login(Request $request)
    {
        $loginInput = trim($request->input('login', $request->input('email', '')));
        $password = $request->input('password', '');

        if (empty($loginInput) || empty($password)) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập Email/Tên đăng nhập và Mật khẩu.',
            ], 422);
        }

        $user = User::where('email', mb_strtolower($loginInput))
            ->orWhere('username', $loginInput)
            ->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Tên đăng nhập hoặc mật khẩu không chính xác.',
            ], 401);
        }

        $role = $user->is_admin ? 'admin' : 'student';

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'role' => $role,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $role,
            ],
        ]);
    }

    /**
     * Helper to send HTML OTP email.
     */
    private function sendOtpEmail(string $toEmail, string $name, string $otpCode): bool
    {
        try {
            $subject = "[TRIEUVY DEUTSCH] Mã OTP xác thực tài khoản học viên: {$otpCode}";
            $body = "
                <div style='font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 2px solid #111827; border-radius: 12px; background-color: #ffffff;'>
                    <h2 style='color: #2563eb; margin-top: 0;'>Xác Thực Tài Khoản TRIEUVY DEUTSCH</h2>
                    <p>Xin chào <strong>".e($name)."</strong>,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản luyện thi tiếng Đức tại <strong>TRIEUVY DEUTSCH Portal</strong>.</p>
                    <p>Mã OTP xác thực của bạn gồm 6 chữ số là:</p>
                    <div style='text-align: center; margin: 25px 0;'>
                        <span style='display: inline-block; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #ffffff; background-color: #2563eb; padding: 12px 28px; border-radius: 10px; border: 2px solid #111827;'>{$otpCode}</span>
                    </div>
                    <p style='color: #4b5563; font-size: 13px;'>* Mã OTP có hiệu lực trong vòng <strong>10 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;'>
                    <p style='font-size: 12px; color: #9ca3af; text-align: center;'>Hệ Thống Luyện Thi & Mô Phỏng Cấu Trúc Đề GOETHE & TELC TRIEUVY DEUTSCH</p>
                </div>
            ";

            Mail::html($body, function ($message) use ($toEmail, $subject) {
                $message->to($toEmail)->subject($subject);
            });

            return true;
        } catch (\Throwable $e) {
            Log::warning('Failed to send OTP email: '.$e->getMessage());

            return false;
        }
    }
}
