import React, { useState, useRef, useEffect } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, KeyRound, RefreshCw } from 'lucide-react';

interface AuthPageProps {
  initialTab?: 'login' | 'register';
  onBackToHome: () => void;
  onSuccessLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'login',
  onBackToHome,
  onSuccessLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State (6 digits)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendActive(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Auto focus first OTP input when switching to OTP view
  useEffect(() => {
    if (step === 'otp' && otpInputRefs.current[0]) {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      // Login goes directly to portal
      onSuccessLogin();
    } else {
      // Register goes to 6-digit OTP verification screen
      setStep('otp');
      setResendTimer(60);
      setIsResendActive(false);
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto advance to next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      alert('Vui lòng nhập đủ 6 chữ số mã OTP xác thực.');
      return;
    }
    // Verify success -> proceed to portal
    onSuccessLogin();
  };

  const handleResendOtp = () => {
    if (!isResendActive) return;
    setResendTimer(60);
    setIsResendActive(false);
    setOtp(['', '', '', '', '', '']);
    alert(`Mã OTP mới đã được gửi lại tới email ${email || 'hocvien@trieuvydeutsch.vn'}`);
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
            RIGHT HALF (1/2 trang): FORM ĐĂNG KÝ / ĐĂNG NHẬP / NHẬP OTP
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

          {/* -------------------------------------------------------------
              VIEW 1: FORM ĐĂNG NHẬP / ĐĂNG KÝ
          ------------------------------------------------------------- */}
          {step === 'form' ? (
            <div className="max-w-md w-full mx-auto my-auto space-y-6 animate-fadeIn">
              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#111827] font-heading tracking-tight">
                  {activeTab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#4b5563]">
                  {activeTab === 'login'
                    ? 'Vui lòng nhập email và mật khẩu của bạn để vào portal luyện thi TELC B2.'
                    : 'Tạo tài khoản học viên để nhận mã xác thực OTP gửi trực tiếp qua Gmail.'}
                </p>
              </div>

              {/* Tab Switcher: Đăng Nhập vs Đăng Ký */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f1f5f9] border-[2.5px] border-[#111827] rounded-2xl brutal-shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    if (window.location.pathname !== '/login') {
                      window.history.pushState({ tab: 'login' }, '', '/login');
                    }
                  }}
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
                  onClick={() => {
                    setActiveTab('register');
                    if (window.location.pathname !== '/register') {
                      window.history.pushState({ tab: 'register' }, '', '/register');
                    }
                  }}
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
              <form onSubmit={handleSubmitForm} className="space-y-4">
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
                  <span>{activeTab === 'login' ? 'ĐĂNG NHẬP VÀO PORTAL' : 'ĐĂNG KÝ & NHẬP MÃ OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* -------------------------------------------------------------
                VIEW 2: TRANG NHẬP MÃ OTP 6 SỐ
            ------------------------------------------------------------- */
            <div className="max-w-md w-full mx-auto my-auto space-y-6 animate-fadeIn">
              {/* Header OTP */}
              <div className="space-y-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#F97316] text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-sm mx-auto sm:mx-0">
                  <KeyRound className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#111827] font-heading tracking-tight">
                    Xác Thực Mã OTP 6 Số
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-[#4b5563] mt-1 leading-relaxed">
                    Hệ thống đã tự động gửi mã OTP xác thực 6 chữ số đến địa chỉ Gmail:
                  </p>
                  <div className="mt-2 inline-block px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30 rounded-lg text-xs font-black font-mono">
                    {email || 'hocvien@trieuvydeutsch.vn'}
                  </div>
                </div>
              </div>

              {/* OTP 6-Digit Inputs */}
              <form onSubmit={handleVerifyOtp} className="space-y-6 pt-2">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black text-[#111827] bg-[#f8fafc] border-[2.5px] border-[#111827] rounded-xl brutal-shadow-xs focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                {/* Resend OTP Timer & Button */}
                <div className="flex items-center justify-between text-xs font-bold text-[#4b5563] pt-1">
                  <span>Chưa nhận được mã OTP?</span>
                  {isResendActive ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#2563EB] hover:underline font-black flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Gửi lại mã OTP</span>
                    </button>
                  ) : (
                    <span className="text-[#F97316] font-black font-mono">
                      Gửi lại sau {resendTimer}s
                    </span>
                  )}
                </div>

                {/* Submit OTP Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#F97316] hover:bg-[#ea580c] border-[2.5px] border-[#111827] rounded-xl text-xs font-black text-white brutal-shadow-sm hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#111827] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>XÁC NHẬN MÃ OTP & VÀO PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Back to Edit Email */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-xs font-bold text-[#6b7280] hover:text-[#111827] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Thay đổi thông tin đăng ký</span>
                  </button>
                </div>
              </form>
            </div>
          )}

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
