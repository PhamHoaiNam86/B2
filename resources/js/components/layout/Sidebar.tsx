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
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  tabSwitchCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  tabSwitchCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Tổng quan', icon: LayoutDashboard, badge: 'Live' },
    { id: 'exam' as ActiveTab, label: 'Thi thử B2', icon: FileCheck2, badge: 'B2' },
    { id: 'exam-b1' as ActiveTab, label: 'Thi thử B1', icon: FileCheck2, badge: 'B1' },
    { id: 'exam-a2' as ActiveTab, label: 'Thi thử A2', icon: FileCheck2, badge: 'A2' },
    { id: 'exam-a1' as ActiveTab, label: 'Thi thử A1', icon: FileCheck2, badge: 'A1' },
    { id: 'results' as ActiveTab, label: 'Kết quả & Bằng', icon: Award },
    { id: 'vocab' as ActiveTab, label: 'Kho Từ vựng', icon: BookOpen, badge: 'Flashcard' },
    { id: 'grammar' as ActiveTab, label: 'Ngữ pháp', icon: Brain },
    { id: 'schreiben' as ActiveTab, label: 'Luyện Viết AI', icon: PenTool, badge: 'Gemini' },
    { id: 'students' as ActiveTab, label: 'Quản lý Học viên', icon: Users },
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
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r-[2.5px] border-[#1c1b1b] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b-[2.5px] border-[#1c1b1b] flex items-center justify-between bg-[#fcf9f8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f36b92] text-white border-2 border-[#1c1b1b] flex items-center justify-center font-black brutal-shadow-sm">
              DE
            </div>
            <div>
              <h2 className="text-base font-black text-[#1c1b1b] font-heading leading-tight">
                DeutschMitPN
              </h2>
              <span className="text-[10px] font-bold text-[#897175]">
                TELC B2 Prep & Exam Portal
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded-lg border border-[#1c1b1b] hover:bg-[#f0edec]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f36b92] text-white border-[#1c1b1b] brutal-shadow-sm font-black'
                    : 'bg-transparent text-[#1c1b1b] border-transparent hover:border-[#1c1b1b] hover:bg-[#fcf9f8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#564145]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${
                      isActive
                        ? 'bg-white text-[#f36b92] border-[#1c1b1b]'
                        : 'bg-[#ffe3ea] text-[#800035] border-[#1c1b1b]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Anti-Cheat & System Status Widget */}
        <div className="p-4 border-t-[2.5px] border-[#1c1b1b] bg-[#fcf9f8] space-y-2">
          <div className="p-3 bg-white border-2 border-[#1c1b1b] rounded-xl brutal-shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-[#0d5225]">
                <ShieldCheck className="w-4 h-4 text-[#0d5225]" />
                Giám sát thi TELC
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9px] font-black">
                BẬT
              </span>
            </div>
            <p className="text-[10px] text-[#564145]">
              Cảnh báo chuyển tab: <b className="text-[#ba1a1a]">{tabSwitchCount} lần</b>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
