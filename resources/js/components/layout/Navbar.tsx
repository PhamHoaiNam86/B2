import React from 'react';
import { ActiveTab } from '../../types';
import { Search, ShieldAlert, Sparkles, UserCheck, Menu, GraduationCap, FileText, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  searchQuery: string;
  onSearch: (q: string) => void;
  currentUser: 'admin' | 'student';
  formattedCountdown?: string;
  onOpenExamRoom?: () => void;
  onToggleMobileMenu: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  searchQuery,
  onSearch,
  currentUser,
  formattedCountdown,
  onOpenExamRoom,
  onToggleMobileMenu,
  onLogout,
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
        return 'Modul Schreiben - Luyện Viết Thư B2 Standard';
      case 'students':
        return 'Quản Lý Học Viên & Bảng Điểm Thi';
      case 'history':
        return 'Lịch Sử Làm Bài & Bảng Xếp Hạng';
      case 'profile':
        return 'Hồ Sơ Cá Nhân Học Viên & Cài Đặt';
      default:
        return 'TRIEUVY DEUTSCH TELC B2 Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b-[2.5px] md:border-l-[2.5px] border-[#111827] px-[10px] py-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3 shrink-0">
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
              Hệ thống luyện thi & mô phỏng phòng thi chuẩn quốc tế TRIEUVY DEUTSCH
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Tìm kiếm bài thi, từ vựng, ngữ pháp..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Right: Countdown, Account Role Badge & Logout Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Real-time countdown badge if exam active */}
          {formattedCountdown && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#ffe3ea] text-[#800035] border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-sm animate-pulse">
              <ShieldAlert className="w-4 h-4 text-[#ba1a1a]" />
              <span>Thời gian: {formattedCountdown}</span>
            </div>
          )}



          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border-2 border-[#111827] bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] text-xs font-bold flex items-center gap-1.5 brutal-shadow-xs hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
