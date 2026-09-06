import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Shield, Award, Calendar, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface ProfileViewProps {
  currentUser?: 'admin' | 'student';
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser = 'admin',
  onShowToast,
}) => {
  // Profile form state initialized with realistic student/admin data
  const [formData, setFormData] = useState({
    name: currentUser === 'admin' ? 'Admin TrieuVy' : 'Học Viên B2',
    username: currentUser === 'admin' ? 'admin' : 'hocvien',
    email: currentUser === 'admin' ? 'admin@trieuvydeutsch.vn' : 'hocvien@trieuvydeutsch.vn',
    phone: currentUser === 'admin' ? '0901234567' : '0987654321',
    address: currentUser === 'admin' ? 'Số 1 Phạm Văn Đồng, Cầu Giấy, Hà Nội' : '123 Đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
    className: 'B2-K38 TELC Intensive',
    targetScore: 270,
    targetExamDate: '15/10/2026',
    avatarUrl: currentUser === 'admin'
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      onShowToast(
        'Cập nhật thành công',
        'Thông tin hồ sơ cá nhân của bạn đã được lưu vào hệ thống.',
        'success'
      );
    }, 600);
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn pb-12">
      {/* 1. PROFILE BANNER HEADER */}
      <div className="bg-[#2563EB] text-white rounded-2xl border-[2.5px] border-[#111827] p-6 sm:p-8 brutal-shadow relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Container with Upload Badge */}
          <div className="relative group shrink-0">
            <img
              src={formData.avatarUrl}
              alt={formData.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md"
            />
            <button
              type="button"
              onClick={() => onShowToast('Thay đổi ảnh đại diện', 'Vui lòng chọn file hình ảnh từ máy tính.', 'info')}
              className="absolute -bottom-2 -right-2 p-2 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl brutal-shadow-xs hover:scale-110 transition-all cursor-pointer"
              title="Đổi ảnh đại diện"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Basic Summary Info */}
          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-[#fef08a] text-[#713f12] text-xs font-black border border-[#111827] uppercase tracking-wide">
                {currentUser === 'admin' ? 'Quản Trị Viên (Admin)' : 'Học Viên TELC B2'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#fef08a]" />
                Lớp {formData.className}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              {formData.name}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <span>Tên đăng nhập: <strong className="text-white">@{formData.username}</strong></span>
              <span>•</span>
              <span>Mục tiêu: <strong className="text-[#fef08a]">{formData.targetScore} / 300 Điểm TELC B2</strong></span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN FORM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Edit Info Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-6">
            <div className="border-b-2 border-[#111827] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#111827] font-heading flex items-center gap-2">
                  <User className="w-5 h-5 text-[#2563EB]" />
                  Thông Tin Cá Nhân Học Viên
                </h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  Cập nhật đầy đủ họ tên, số điện thoại và địa chỉ nhận bằng thi TELC B2.
                </p>
              </div>
            </div>

            {/* Grid 2 Columns for Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Họ và Tên */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">Họ và Tên (*)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tên đăng nhập */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">Tên đăng nhập (Username)</label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="text"
                    disabled
                    value={formData.username}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-2 border-[#111827] rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Địa chỉ Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">Địa chỉ Email (*)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">Số điện thoại liên hệ (*)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="tel"
                    required
                    placeholder="0987 654 321"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Địa chỉ thường trú */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#111827] block">Địa chỉ nhận thông báo & Chứng chỉ (*)</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#6b7280]" />
                <textarea
                  rows={3}
                  required
                  placeholder="Nhập địa chỉ nhà riêng hoặc trung tâm..."
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            {/* Lớp & Ngày thi dự kiến */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">Lớp học hiện tại</label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => handleChange('className', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#111827] block">Ngày thi dự kiến</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="text"
                    value={formData.targetExamDate}
                    onChange={(e) => handleChange('targetExamDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl font-black text-xs brutal-shadow hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (4 cols): Profile Quick Cards & TELC Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Score Progress Card */}
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4">
            <h4 className="text-sm font-black text-[#111827] font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F97316]" />
              Tiến Độ Mục Tiêu TELC B2
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#4b5563]">Điểm mục tiêu:</span>
                <span className="font-black text-[#2563EB]">{formData.targetScore} / 300</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 border border-[#111827] overflow-hidden">
                <div
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(formData.targetScore / 300) * 100}%` }}
                />
              </div>
              <p className="text-[11px] font-medium text-slate-500 pt-1">
                Yêu cầu tối thiểu đạt chuẩn TELC B2: <strong>180/300 điểm (60%)</strong>.
              </p>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-[#fff8e7] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-3">
            <h4 className="text-sm font-black text-[#734c00] font-heading flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0d5225]" />
              Xác Thực & Bảo Mật Tài Khoản
            </h4>

            <ul className="text-xs font-bold text-[#111827] space-y-2">
              <li className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã xác minh Email Gmail chính chủ</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kích hoạt mã OTP 6 số bảo mật</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Quyền truy cập phòng thi thử mô phỏng</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
