import React, { useState, useRef, useEffect } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, UserCheck, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, KeyRound, RefreshCw, Clock, XCircle, PhoneCall } from 'lucide-react';

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
  const [step, setStep] = useState<'form' | 'otp' | 'pending_approval' | 'rejected'>('form');

  // Form fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
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

  // API state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (activeTab === 'login') {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }).then((r) => r.json());

        if (res.success) {
          if (res.approval_status === 'pending') {
            setStep('pending_approval');
          } else if (res.approval_status === 'rejected') {
            setStep('rejected');
          } else {
            onSuccessLogin(res.role || 'student');
          }
        } else {
          if (res.approval_status === 'pending') {
            setStep('pending_approval');
          } else if (res.approval_status === 'rejected') {
            setStep('rejected');
          } else {
            setErrorMsg(res.message || 'Đăng nhập không thành công. Vui lòng thử lại!');
          }
        }
      } catch (err) {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!');
      } finally {
        setLoading(false);
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu đã nhập.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName || email.split('@')[0],
            username: username || email.split('@')[0],
            email,
            password,
          }),
        }).then((r) => r.json());

        if (res.success) {
          setInfoMsg(res.message || `Mã OTP 6 số đã được gửi về email ${email}`);
          setStep('otp');
          setResendTimer(60);
          setIsResendActive(false);
          setOtp(['', '', '', '', '', '']);
        } else {
          setErrorMsg(res.message || 'Đăng ký không thành công. Vui lòng thử lại!');
        }
      } catch (err) {
        setErrorMsg('Lỗi kết nối máy chủ khi đăng ký tài khoản.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP xác thực.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      }).then((r) => r.json());

      if (res.success) {
        if (res.approval_status === 'pending') {
          setStep('pending_approval');
        } else if (res.approval_status === 'rejected') {
          setStep('rejected');
        } else {
          onSuccessLogin(res.role || 'student');
        }
      } else {
        if (res.approval_status === 'pending') {
          setStep('pending_approval');
        } else if (res.approval_status === 'rejected') {
          setStep('rejected');
        } else {
          setErrorMsg(res.message || 'Mã OTP không chính xác. Vui lòng kiểm tra lại!');
        }
      }
    } catch (err) {
      setErrorMsg('Lỗi xác thực mã OTP với máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isResendActive) return;
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then((r) => r.json());

      if (res.success) {
        setInfoMsg(res.message || `Mã OTP mới đã được gửi về email ${email}`);
        setResendTimer(60);
        setIsResendActive(false);
        setOtp(['', '', '', '', '', '']);
      } else {
        setErrorMsg(res.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại!');
      }
    } catch (err) {
      setErrorMsg('Lỗi gửi lại mã OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckApprovalStatus = async () => {
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await fetch('/api/v1/auth/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then((r) => r.json());

      if (res.success) {
        if (res.approval_status === 'approved') {
          onSuccessLogin(res.is_admin ? 'admin' : 'student');
        } else if (res.approval_status === 'rejected') {
          setStep('rejected');
        } else {
          setInfoMsg('Tài khoản vẫn đang trong trạng thái CHỜ DUYỆT. Vui lòng nhắn Admin mở khóa!');
        }
      } else {
        setErrorMsg(res.message || 'Không thể kiểm tra trạng thái.');
      }
    } catch (e) {
      setErrorMsg('Lỗi kết nối máy chủ khi kiểm tra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fcf9f8] text-[#111827] font-sans flex flex-col justify-between selection:bg-[#F97316] selection:text-white">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* -------------------------------------------------------------
            LEFT HALF (1/2 trang): HÌNH BANNER 2 + THÔNG TIN NỔI BẬT
        ------------------------------------------------------------- */}
        <div className="relative hidden lg:flex flex-col justify-between bg-[#111827] p-12 text-white min-h-screen overflow-hidden group">
          <img
            src="/images/banner2.png"
            alt="Luyện thi TELC B2 TRIEUVY DEUTSCH"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/50 to-[#111827]/30 z-10" />

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

          <div className="relative z-20 text-xs text-slate-400 font-medium">
            © 2026 TRIEUVY DEUTSCH. Nền tảng luyện thi chuẩn quốc tế.
          </div>
        </div>

        {/* -------------------------------------------------------------
            RIGHT HALF (1/2 trang): FORM ĐĂNG KÝ / ĐĂNG NHẬP / NHẬP OTP / CHỜ DUYỆT
        ------------------------------------------------------------- */}
        <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white min-h-screen">
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
          {step === 'form' && (
            <div className="max-w-md w-full mx-auto my-auto space-y-6 animate-fadeIn">
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

              {errorMsg && (
                <div className="p-3 bg-[#fff1f2] text-[#e11d48] border-2 border-[#111827] rounded-xl text-xs font-bold flex items-center gap-2 brutal-shadow-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#e11d48]" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {infoMsg && (
                <div className="p-3 bg-[#eff6ff] text-[#1d4ed8] border-2 border-[#111827] rounded-xl text-xs font-bold flex items-center gap-2 brutal-shadow-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  <span>{infoMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-4">
                {activeTab === 'register' && (
                  <>
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

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#111827] block">Tên đăng nhập</label>
                      <div className="relative">
                        <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: minhhuyen_b2"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:border-[#2563EB]"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#111827] block">
                    {activeTab === 'login' ? 'Email hoặc Tên đăng nhập' : 'Địa chỉ Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <input
                      type={activeTab === 'login' ? 'text' : 'email'}
                      required
                      placeholder={activeTab === 'login' ? 'hocvien@trieuvydeutsch.vn hoặc hocvien' : 'hocvien@trieuvydeutsch.vn'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:border-[#2563EB]"
                    />
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-4 border-[2.5px] border-[#111827] rounded-xl text-xs font-black text-white brutal-shadow-sm hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#111827] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider mt-6 disabled:opacity-50 ${
                    activeTab === 'login'
                      ? 'bg-[#2563EB] hover:bg-[#1d4ed8]'
                      : 'bg-[#F97316] hover:bg-[#ea580c]'
                  }`}
                >
                  <span>{loading ? 'Đang xử lý...' : activeTab === 'login' ? 'ĐĂNG NHẬP VÀO PORTAL' : 'ĐĂNG KÝ & NHẬP MÃ OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* -------------------------------------------------------------
              VIEW 2: TRANG NHẬP MÃ OTP 6 SỐ
          ------------------------------------------------------------- */}
          {step === 'otp' && (
            <div className="max-w-md w-full mx-auto my-auto space-y-6 animate-fadeIn">
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

              {errorMsg && (
                <div className="p-3 bg-[#fff1f2] text-[#e11d48] border-2 border-[#111827] rounded-xl text-xs font-bold flex items-center gap-2 brutal-shadow-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#e11d48]" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {infoMsg && (
                <div className="p-3 bg-[#eff6ff] text-[#1d4ed8] border-2 border-[#111827] rounded-xl text-xs font-bold flex items-center gap-2 brutal-shadow-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  <span>{infoMsg}</span>
                </div>
              )}

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#F97316] hover:bg-[#ea580c] border-[2.5px] border-[#111827] rounded-xl text-xs font-black text-white brutal-shadow-sm hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#111827] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
                >
                  <span>{loading ? 'Đang xác thực...' : 'XÁC NHẬN MÃ OTP & GỬI CHỜ DUYỆT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

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

          {/* -------------------------------------------------------------
              VIEW 3: TRANG CHỜ XÁC NHẬN DUYỆT TỪ ADMIN (PENDING APPROVAL)
          ------------------------------------------------------------- */}
          {step === 'pending_approval' && (
            <div className="max-w-md w-full mx-auto my-auto space-y-6 animate-fadeIn text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-sm mx-auto sm:mx-0">
                <Clock className="w-8 h-8 stroke-[2.5] animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black inline-block">
                  ⏳ TÀI KHOẢN ĐANG CHỜ ADMIN PHÊ DUYỆT
                </span>
                <h2 className="text-3xl font-black text-[#111827] font-heading tracking-tight">
                  Xác Thực Email Thành Công!
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#4b5563] leading-relaxed">
                  Để đảm bảo chất lượng giảng dạy và tránh học tự do chui, tài khoản của bạn đang được Quản trị viên (Admin) xem xét và cấp quyền học.
                </p>
              </div>

              {/* Student Info Card */}
              <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-4 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Email tài khoản:</span>
                  <span className="font-black text-[#111827] font-mono">{email || 'hocvien@gmail.com'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Trạng thái hiện tại:</span>
                  <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Chờ duyệt học phí & tài khoản
                  </span>
                </div>
              </div>

              {/* Contact Admin Card */}
              <div className="bg-white border-2 border-[#111827] rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#111827]">Liên Hệ Admin Mở Khóa Nhanh</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Nhắn Zalo/Hotline Admin để được duyệt ngay trong 5 phút</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black">
                  <span className="text-slate-600">Hotline Zalo Admin:</span>
                  <span className="text-[#2563EB] text-sm">0347.815.447 (Vỹ)</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#fff1f2] text-[#e11d48] border-2 border-[#111827] rounded-xl text-xs font-bold flex items-center gap-2 brutal-shadow-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#e11d48]" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {infoMsg && (
                <div className="p-3 bg-[#eff6ff] text-[#1d4ed8] border-2 border-[#111827] rounded-xl text-xs font-bold flex items-center gap-2 brutal-shadow-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCheckApprovalStatus}
                  className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1d4ed8] border-[2.5px] border-[#111827] rounded-xl text-xs font-black text-white brutal-shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Đang kiểm tra...' : 'KIỂM TRA LẠI TRẠNG THÁI DUYỆT'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Quay Lại Trang Đăng Nhập
                </button>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              VIEW 4: TRANG TỪ CHỐI TRUY CẬP (REJECTED)
          ------------------------------------------------------------- */}
          {step === 'rejected' && (
            <div className="max-w-md w-full mx-auto my-auto space-y-6 animate-fadeIn text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-sm mx-auto sm:mx-0">
                <XCircle className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-xs font-black inline-block">
                  ❌ TÀI KHOẢN BỊ TỪ CHỐI TRUY CẬP
                </span>
                <h2 className="text-3xl font-black text-[#111827] font-heading tracking-tight">
                  Tài Khoản Chưa Được Duyệt
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#4b5563] leading-relaxed">
                  Rất tiếc, tài khoản của bạn đã bị Admin từ chối cấp quyền truy cập. Vui lòng liên hệ Admin nếu có sự nhầm lẫn.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="w-full py-3.5 px-4 bg-[#111827] text-white border-[2.5px] border-[#111827] rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Quay Lại Trang Chủ
                </button>
              </div>
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
