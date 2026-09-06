import React from 'react';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  FileCheck2,
  Award,
  BookOpen,
  Brain,
  PenTool,
  Users,
  History,
  Sparkles,
  X,
  User,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  tabSwitchCount?: number;
  currentUser?: 'admin' | 'student';
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  tabSwitchCount = 0,
  currentUser = 'admin',
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'exam' as ActiveTab, label: 'Thi thử B2', icon: FileCheck2 },
    { id: 'exam-b1' as ActiveTab, label: 'Thi thử B1', icon: FileCheck2 },
    { id: 'exam-a2' as ActiveTab, label: 'Thi thử A2', icon: FileCheck2 },
    { id: 'exam-a1' as ActiveTab, label: 'Thi thử A1', icon: FileCheck2 },
    { id: 'docs-b2' as ActiveTab, label: 'Thư viện Tài liệu B2', icon: BookOpen },
    { id: 'docs-schreiben' as ActiveTab, label: 'Tài liệu Schreiben', icon: PenTool },
    { id: 'docs-sprechen' as ActiveTab, label: 'Tài liệu Sprechen', icon: Sparkles },
    { id: 'results' as ActiveTab, label: 'Kết quả & Bằng', icon: Award },
    { id: 'vocab' as ActiveTab, label: 'Kho Từ vựng', icon: BookOpen },
    { id: 'grammar' as ActiveTab, label: 'Ngữ pháp', icon: Brain },
    { id: 'students' as ActiveTab, label: 'Quản lý Học viên', icon: Users, isAdminOnly: true },
    { id: 'history' as ActiveTab, label: 'Lịch sử & Bảng điểm', icon: History },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r-[2.5px] border-[#111827] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b-[2.5px] border-[#111827] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-sm">
              TD
            </div>
            <div>
              <h2 className="text-base font-black text-[#111827] font-heading leading-tight">
                TRIEUVY DEUTSCH
              </h2>
              <span className="text-[10px] font-bold text-[#4b5563]">
                TELC B2 Prep & Exam Portal
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded-lg border border-[#111827] hover:bg-[#f1f5f9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const href = item.id === 'dashboard' ? '/' : `/${item.id}`;
            const isLockedForStudent = currentUser === 'student' && item.isAdminOnly;

            return (
              <a
                key={item.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`group w-full px-3.5 py-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-sm font-black'
                    : isLockedForStudent
                    ? 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-300'
                    : 'bg-transparent text-[#111827] border-transparent hover:border-[#2563EB] hover:bg-[#eff6ff] hover:text-[#2563EB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isLockedForStudent ? 'text-slate-400' : 'text-[#4b5563] group-hover:text-[#2563EB]'}`} />
                  <span>{item.label}</span>
                </div>
                {isLockedForStudent && (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                    🔒 Admin
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom Profile Action Button */}
        <div className="p-3 border-t-[2.5px] border-[#111827] bg-[#f8fafc]">
          <button
            type="button"
            onClick={() => {
              onSelectTab('profile');
              onCloseMobile();
            }}
            className={`w-full px-3 py-2.5 rounded-xl border-2 font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs font-black'
                : 'bg-white text-[#111827] border-[#111827] brutal-shadow-xs hover:bg-[#eff6ff] hover:text-[#2563EB]'
            }`}
          >
            <User className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span className="font-heading">Hồ Sơ Cá Nhân</span>
          </button>
        </div>
      </aside>
    </>
  );
};
