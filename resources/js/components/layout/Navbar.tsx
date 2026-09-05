import React from 'react';
import { ActiveTab } from '../../types';
import { Search, ShieldAlert, Sparkles, UserCheck, Menu, GraduationCap, FileText } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  searchQuery: string;
  onSearch: (q: string) => void;
  currentUser: 'admin' | 'student';
  onToggleUser: () => void;
  formattedCountdown?: string;
  onOpenExamRoom?: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  searchQuery,
  onSearch,
  currentUser,
  onToggleUser,
  formattedCountdown,
  onOpenExamRoom,
  onToggleMobileMenu,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tổng quan Hệ Thống & Tiến Độ Học';
      case 'exam':
        return 'Kho Đề Thi & Phòng Thi Thử B2';
      case 'exam-b1':
        return 'Kho Đề Thi & Phòng Thi Thử B1';
      case 'exam-a2':
        return 'Kho Đề Thi & Phòng Thi Thử A2';
      case 'exam-a1':
        return 'Kho Đề Thi & Phòng Thi Thử A1';
      case 'docs-b2':
        return 'Thư Viện Tài Liệu Tiếng Đức B2';
      case 'docs-schreiben':
        return 'Tài Liệu Luyện Viết Schreiben B2';
      case 'docs-sprechen':
        return 'Tài Liệu Luyện Nói Sprechen B2';
      case 'results':
        return 'Kết Quả Chi Tiết & Cấp Chứng Nhận';
      case 'vocab':
        return 'Kho Từ Vựng B2 & Thẻ Ghi Nhớ Flashcard';
      case 'grammar':
        return 'Chuyên Đề Ngữ Pháp B2 & Bẫy Đề Thi';
      case 'schreiben':
        return 'Modul Schreiben - Viết Thư Có AI Chấm';
      case 'students':
        return 'Quản Lý Học Viên & Bảng Điểm Thi';
      case 'history':
        return 'Lịch Sử Làm Bài & Bảng Xếp Hạng';
      default:
        return 'DeutschMitPN TELC B2 Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b-[2.5px] border-[#111827] px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl border-2 border-[#111827] bg-[#f8fafc] hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#2563EB] text-white text-[10px] font-black uppercase border border-[#111827]">
                TELC B2
              </span>
              <h1 className="text-base sm:text-lg font-black text-[#111827] font-heading line-clamp-1">
                {getTabTitle()}
              </h1>
            </div>
            <p className="text-[11px] text-[#4b5563] hidden sm:block">
              Hệ thống luyện thi & mô phỏng phòng thi chuẩn quốc tế DeutschMitPN
            </p>
          </div>
        </div>

        {/* Right: Search, Countdown, Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden lg:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Tìm kiếm bài thi, từ vựng..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Real-time countdown badge if exam active */}
          {formattedCountdown && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#ffe3ea] text-[#800035] border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-sm animate-pulse">
              <ShieldAlert className="w-4 h-4 text-[#ba1a1a]" />
              <span>Thời gian: {formattedCountdown}</span>
            </div>
          )}

          {/* Role Toggle Button */}
          <button
            onClick={onToggleUser}
            className={`px-3 py-1.5 rounded-xl border-2 border-[#1c1b1b] text-xs font-bold flex items-center gap-2 brutal-shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer ${
              currentUser === 'admin'
                ? 'bg-[#ffe082] text-[#3e2723]'
                : 'bg-[#b2dfdb] text-[#004d40]'
            }`}
          >
            {currentUser === 'admin' ? (
              <>
                <GraduationCap className="w-4 h-4" />
                <span>Giáo viên / Admin</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Học viên B2</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
