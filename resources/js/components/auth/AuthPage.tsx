import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  initialTab?: 'login' | 'register';
  onBackToHome: () => void;
  onSuccessLogin: (role: 'admin' | 'student') => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'login',
  onBackToHome,
  onSuccessLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('student');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccessLogin(role);
  };

  return (
    <div className="min-h-screen w-full bg-[#fcf9f8] text-[#111827] font-sans flex flex-col justify-between selection:bg-[#F97316] selection:text-white">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* -------------------------------------------------------------
            LEFT HALF (1/2 trang): HÌNH BANNER 2 + THÔNG TIN NỔI BẬT
        ------------------------------------------------------------- */}
        <div className="relative hidden lg:flex flex-col justify-between bg-[#111827] p-12 text-white min-h-screen overflow-hidden group">
          {/* Background Image Banner 2 */}
          <img
            src="/images/banner2.png"
            alt="Luyện thi TELC B2 TRIEUVY DEUTSCH"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/50 to-[#111827]/30 z-10" />

          {/* Header Branding */}
          <div className="relative z-20 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={onBackToHome}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white border-2 border-white flex items-center justify-center font-black text-xl brutal-shadow-sm">
                TD
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-white font-heading">
                  TRIEUVY DEUTSCH
                </h1>
                <span className="text-xs font-bold text-blue-200 block mt-0.5">
                  TELC B2 Prep & Exam Portal
                </span>
              </div>
            </div>

            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang Chủ</span>
            </button>
          </div>

          {/* Middle / Bottom Feature Callout */}
          <div className="relative z-20 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F97316] border-2 border-white text-white rounded-xl text-xs font-black uppercase tracking-wider brutal-shadow-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>HỆ THỐNG MÔ PHỎNG TELC B2 2026</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black font-heading leading-tight text-white">
              Đồng Hành Cùng Bạn Chinh Phục Chứng Chỉ TELC B2
            </h2>

            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              Trải nghiệm phòng thi thử mô phỏng thời gian thực, chống gian lận tab switch và bộ 5.000+ từ vựng lật 3D chuyên ngành B2.
            </p>

            <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-xs font-bold text-slate-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0" />
                <span>50+ Đề thi thử B2</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0" />
                <span>Đáp án & Chấm điểm 300</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0" />
                <span>Dàn ý bài mẫu Schreiben</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0" />
                <span>Flashcard 3D từ vựng Y tế</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-20 text-xs text-slate-400 font-medium">
            © 2026 TRIEUVY DEUTSCH. Nền tảng luyện thi chuẩn quốc tế.
          </div>
        </div>

        {/* -------------------------------------------------------------
            RIGHT HALF (1/2 trang): FORM ĐĂNG KÝ / ĐĂNG NHẬP
        ------------------------------------------------------------- */}
        <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white min-h-screen">
          {/* Top Bar Navigation for Mobile/Desktop */}
          <div className="flex items-center justify-between w-full mb-8">
            <div className="flex items-center gap-3 lg:hidden" onClick={onBackToHome}>
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white border-2 border-[#111827] flex items-center justify-center font-black text-base brutal-shadow-xs">
                TD
              </div>
              <span className="font-black text-base text-[#111827] font-heading">TRIEUVY DEUTSCH</span>
            </div>

            <button
              onClick={onBackToHome}
              className="ml-auto px-4 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-black text-[#111827] brutal-shadow-xs hover:bg-[#111827] hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang chủ</span>
            </button>
          </div>

          {/* Main Form Container */}
          <div className="max-w-md w-full mx-auto my-auto space-y-6">
            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#111827] font-heading tracking-tight">
                {activeTab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#4b5563]">
                {activeTab === 'login'
                  ? 'Vui lòng nhập email và mật khẩu của bạn để vào portal luyện thi TELC B2.'
                  : 'Tạo tài khoản học viên để truy cập ngay kho đề thi thử và tài liệu B2.'}
              </p>
            </div>

            {/* Tab Switcher: Đăng Nhập vs Đăng Ký */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f1f5f9] border-[2.5px] border-[#111827] rounded-2xl brutal-shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'login'
                    ? 'bg-[#2563EB] text-white border-2 border-[#111827] brutal-shadow-xs'
                    : 'text-[#4b5563] hover:text-[#111827]'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-[#F97316] text-white border-2 border-[#111827] brutal-shadow-xs'
                    : 'text-[#4b5563] hover:text-[#111827]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký</span>
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name field (Register mode) */}
              {activeTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#111827] block">Họ và Tên</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Minh Huyền"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              )}

              {/* Email / Username field */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">
                  {activeTab === 'login' ? 'Email hoặc Tên đăng nhập' : 'Địa chỉ Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="email"
                    required
                    placeholder="hocvien@trieuvydeutsch.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Confirm Password (Register mode) */}
              {activeTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#111827] block">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              )}

              {/* User Role Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-black text-[#111827] block">Chọn Vai Trò Truy Cập</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 border-2 border-[#111827] rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      role === 'student'
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-600 brutal-shadow-xs'
                        : 'bg-[#f8fafc] text-[#4b5563] hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="roleSelect"
                      value="student"
                      checked={role === 'student'}
                      onChange={() => setRole('student')}
                      className="sr-only"
                    />
                    <span>🎓 Học viên (Chỉ học)</span>
                  </label>

                  <label
                    className={`p-3 border-2 border-[#111827] rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      role === 'admin'
                        ? 'bg-purple-100 text-purple-950 border-purple-600 brutal-shadow-xs'
                        : 'bg-[#f8fafc] text-[#4b5563] hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="roleSelect"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      className="sr-only"
                    />
                    <span>👑 Admin (Toàn quyền)</span>
                  </label>
                </div>
              </div>

              {/* Remember me & Forgot Password (Login mode) */}
              {activeTab === 'login' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#4b5563]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-[#111827] text-[#2563EB] focus:ring-0 cursor-pointer"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Vui lòng liên hệ Admin qua hotline để hỗ trợ khôi phục mật khẩu.')}
                    className="text-xs font-black text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 px-4 border-[2.5px] border-[#111827] rounded-xl text-xs font-black text-white brutal-shadow-sm hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#111827] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider mt-6 ${
                  activeTab === 'login'
                    ? 'bg-[#2563EB] hover:bg-[#1d4ed8]'
                    : 'bg-[#F97316] hover:bg-[#ea580c]'
                }`}
              >
                <span>{activeTab === 'login' ? 'ĐĂNG NHẬP VÀO PORTAL' : 'TẠO TÀI KHOẢN & VÀO PHÒNG THI'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Bottom Terms & Policy */}
          <div className="pt-6 border-t border-[#111827]/10 text-center max-w-md w-full mx-auto">
            <p className="text-[11px] font-medium text-[#6b7280]">
              Bằng việc đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
              <span className="font-bold text-[#111827] underline cursor-pointer">Điều khoản dịch vụ</span> &{' '}
              <span className="font-bold text-[#111827] underline cursor-pointer">Chính sách bảo mật</span> của TRIEUVY DEUTSCH.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
