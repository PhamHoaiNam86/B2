import React, { useState } from 'react';
import { ExamModel, Student, ExamFeedItem } from '../../types';
import {
  FileCheck2,
  BookOpen,
  Brain,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Play,
  Trophy,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Headphones,
  FileText,
  MessageSquare,
  Flame,
  Star,
  Target,
} from 'lucide-react';

interface DashboardViewProps {
  exams: ExamModel[];
  students: Student[];
  liveFeed: ExamFeedItem[];
  onSelectExam: (exam: ExamModel) => void;
  onStartExamRoom: () => void;
  onNavigateToVocab: () => void;
  onNavigateToGrammar: () => void;
  onNavigateToSchreiben: () => void;
  currentUser?: 'admin' | 'student';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exams,
  students,
  liveFeed,
  onSelectExam,
  onStartExamRoom,
  onNavigateToVocab,
  onNavigateToGrammar,
  onNavigateToSchreiben,
  currentUser = 'admin',
}) => {
  const [activeLevelFilter, setActiveLevelFilter] = useState<'ALL' | 'B2' | 'B1' | 'A2' | 'A1'>('B2');

  // Module Score Percentage Stats Data
  const sectionStats = [
    {
      id: 'lese',
      name: 'Leseverstehen (Kỹ năng Đọc)',
      scorePercent: 88,
      correctQuestions: '22/25 câu',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
      barColor: 'bg-blue-600',
      icon: BookOpen,
      status: 'Đạt chuẩn TELC B2',
    },
    {
      id: 'sprach',
      name: 'Sprachbausteine (Từ vựng & Bẫy ngữ pháp)',
      scorePercent: 82,
      correctQuestions: '16/20 câu',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
      barColor: 'bg-purple-600',
      icon: Brain,
      status: 'Cần chú ý từ nối',
    },
    {
      id: 'hoer',
      name: 'Hörverstehen (Kỹ năng Nghe hội thoại)',
      scorePercent: 79,
      correctQuestions: '16/20 câu',
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      barColor: 'bg-emerald-600',
      icon: Headphones,
      status: 'Tiến bộ +5%',
    },
    {
      id: 'schreib',
      name: 'Schriftlicher Ausdruck (Luyện Viết thư B2)',
      scorePercent: 91,
      correctQuestions: '41/45 điểm',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
      barColor: 'bg-orange-500',
      icon: FileText,
      status: 'Xuất sắc',
    },
    {
      id: 'sprech',
      name: 'Mündlicher Ausdruck (Nói Thuyết trình & Thảo luận)',
      scorePercent: 85,
      correctQuestions: '8.5/10 điểm',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
      barColor: 'bg-rose-500',
      icon: MessageSquare,
      status: 'Phản xạ tốt',
    },
  ];

  // Level overall completion percentage
  const levelStats = [
    { level: 'TELC A1', percent: 98, examsDone: '12/12 Đề', color: 'bg-emerald-500' },
    { level: 'TELC A2', percent: 94, examsDone: '15/15 Đề', color: 'bg-teal-500' },
    { level: 'TELC B1', percent: 89, examsDone: '18/20 Đề', color: 'bg-sky-500' },
    { level: 'TELC B2', percent: 86, examsDone: '22/25 Đề', color: 'bg-blue-600' },
  ];

  // Top 10 Students of the Month Leaderboard Data
  const top10Students = [
    {
      rank: 1,
      name: 'Nguyễn Hoàng Anh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      className: 'B2-K38',
      score: 295,
      maxScore: 300,
      percent: 98.3,
      badge: 'VÔ ĐỊCH B2',
      medal: '🥇',
      medalBg: 'bg-amber-100 text-amber-900 border-amber-400',
    },
    {
      rank: 2,
      name: 'Trần Lê Minh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      className: 'B2-K38',
      score: 290,
      maxScore: 300,
      percent: 96.7,
      badge: 'TOP 2 THÁNG',
      medal: '🥈',
      medalBg: 'bg-slate-200 text-slate-800 border-slate-400',
    },
    {
      rank: 3,
      name: 'Lê Phạm Khánh Linh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      className: 'B2-K39',
      score: 285,
      maxScore: 300,
      percent: 95.0,
      badge: 'TOP 3 THÁNG',
      medal: '🥉',
      medalBg: 'bg-amber-800/10 text-amber-800 border-amber-600/30',
    },
    {
      rank: 4,
      name: 'Phạm Hoài Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      className: 'B2-K38',
      score: 282,
      maxScore: 300,
      percent: 94.0,
      badge: 'XUẤT SẮC',
      medal: '4',
      medalBg: 'bg-gray-100 text-gray-700 border-gray-300',
    },
    {
      rank: 5,
      name: 'Vũ Thị Thanh Hằng',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      className: 'B2-K40',
      score: 278,
      maxScore: 300,
      percent: 92.7,
      badge: 'XUẤT SẮC',
      medal: '5',
      medalBg: 'bg-gray-100 text-gray-700 border-gray-300',
    },
    {
      rank: 6,
      name: 'Đặng Quốc Bảo',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      className: 'B2-K39',
      score: 275,
      maxScore: 300,
      percent: 91.7,
      badge: 'GIỎI',
      medal: '6',
      medalBg: 'bg-gray-100 text-gray-700 border-gray-300',
    },
    {
      rank: 7,
      name: 'Bùi Thị Mai',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      className: 'B2-K38',
      score: 272,
      maxScore: 300,
      percent: 90.7,
      badge: 'GIỎI',
      medal: '7',
      medalBg: 'bg-gray-100 text-gray-700 border-gray-300',
    },
    {
      rank: 8,
      name: 'Trịnh Đức Anh',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      className: 'B2-K40',
      score: 268,
      maxScore: 300,
      percent: 89.3,
      badge: 'ĐẠT B2',
      medal: '8',
      medalBg: 'bg-gray-100 text-gray-700 border-gray-300',
    },
    {
      rank: 9,
      name: 'Đỗ Thu Trang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      className: 'B2-K39',
      score: 265,
      maxScore: 300,
      percent: 88.3,
      badge: 'ĐẠT B2',
      medal: '9',
      medalBg: 'bg-gray-100 text-gray-700 border-gray-300',
    },
    {
      rank: 10,
      name: 'Ngô Tuấn Kiệt',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      className: 'B2-K40',
      score: 260,
      maxScore: 300,
      percent: 86.7,
      badge: 'ĐẠT B2',
      medal: '10',
      medalBg: 'bg-gray-100 text-gray-700 border-gray-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-r from-[#2563EB] via-[#1d4ed8] to-[#1e40af] text-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="px-3 py-1 bg-white text-[#111827] rounded-full text-xs font-black border border-[#111827] inline-flex items-center gap-1.5 brutal-shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            HỆ THỐNG LUYỆN THI TELC B2 DÙNG AI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
            Chinh phục chứng chỉ TELC B2 Tiếng Đức dễ dàng hơn bao giờ hết!
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            Tích hợp đầy đủ 4 kỹ năng Đọc - Nghe - Viết - Nói với công nghệ chấm bài tự động AI, đếm ngược thời gian thực và bẫy chống gian lận tiêu chuẩn.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onStartExamRoom}
              className="px-5 py-3 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow flex items-center gap-2 hover:bg-[#ea580c] transition-all cursor-pointer font-heading uppercase"
            >
              <Play className="w-4 h-4 fill-current" />
              Vào Phòng Thi Thử Trực Tuyến
            </button>
            <button
              onClick={onNavigateToSchreiben}
              className="px-5 py-3 bg-white text-[#111827] border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow flex items-center gap-2 hover:bg-[#f1f5f9] transition-all cursor-pointer font-heading"
            >
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              Luyện Viết Thư B2 Standard
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#564145]">Tỉ lệ đỗ TELC B2</span>
            <Award className="w-5 h-5 text-[#0d5225]" />
          </div>
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">89.4%</p>
          <span className="text-[10px] text-[#0d5225] font-bold">↑ 4.2% so với tháng trước</span>
        </div>

        <div className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#564145]">Kho Đề Thi</span>
            <FileCheck2 className="w-5 h-5 text-[#f36b92]" />
          </div>
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">{exams.length} Đề chuẩn</p>
          <span className="text-[10px] text-[#897175] font-bold">Cập nhật đề thi 2026</span>
        </div>

        <div
          onClick={onNavigateToVocab}
          className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-1 cursor-pointer hover:bg-[#fcf9f8] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#564145]">Từ vựng B2</span>
            <BookOpen className="w-5 h-5 text-[#003882]" />
          </div>
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">450+ Từ</p>
          <span className="text-[10px] text-[#003882] font-bold">Kèm Flashcards 3D →</span>
        </div>

        <div
          onClick={onNavigateToGrammar}
          className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-1 cursor-pointer hover:bg-[#fcf9f8] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#564145]">Chuyên đề Ngữ pháp</span>
            <Brain className="w-5 h-5 text-[#734c00]" />
          </div>
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">15 Chuyên đề</p>
          <span className="text-[10px] text-[#734c00] font-bold">Bẫy đề thi B2 →</span>
        </div>
      </div>

      {/* 3. BIỂU ĐỒ THÔNG SỐ CÁC PHẦN THI TEHO MỨC % ĐIỂM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section (2 cols) */}
        <div className="lg:col-span-2 bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#111827]/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-lg font-black text-[#111827] font-heading">
                  Biểu Đồ Thông Số Các Phần Thi Theo Mức % Điểm
                </h3>
              </div>
              <p className="text-xs text-[#4b5563] mt-0.5">
                Phân tích chi tiết tỉ lệ % điểm trung bình theo 5 Modul kỹ năng thi chuẩn TELC
              </p>
            </div>
            <span className="px-3 py-1 bg-[#eff6ff] text-[#1e40af] border border-[#111827] rounded-xl text-xs font-bold">
              Thống kê tháng 9/2026
            </span>
          </div>

          {/* Vertical Column Bar Chart */}
          <div className="bg-[#f8fafc] border-2 border-[#111827] rounded-2xl p-4 sm:p-6 space-y-4 brutal-shadow-xs">
            {/* Target TELC 75% reference badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-extrabold text-[#111827] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#F97316]" />
                Mức % điểm 5 Kỹ Năng Thi TELC B2:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dbeafe] text-[#1e40af] font-black border border-[#2563EB] text-[10px]">
                🎯 Ngưỡng đỗ TELC B2: 75%
              </span>
            </div>

            {/* Vertical Columns Graph Area */}
            <div className="relative h-64 sm:h-72 w-full pt-8 pb-4 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 border-b-2 border-l-2 border-[#111827]">
              {/* Y-Axis Grid Lines & Labels */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-[#94a3b8] font-bold pr-2">
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end">
                  <span className="bg-[#f8fafc] px-1 -mt-2">100%</span>
                </div>
                <div className="border-b border-dashed border-[#F97316]/40 w-full flex justify-between items-center text-[#F97316]">
                  <span className="bg-[#f8fafc] px-1 -mt-2 font-black text-[9px]">TARGET TELC (75%)</span>
                  <span className="bg-[#f8fafc] px-1 -mt-2 font-black">75%</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end">
                  <span className="bg-[#f8fafc] px-1 -mt-2">50%</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end">
                  <span className="bg-[#f8fafc] px-1 -mt-2">25%</span>
                </div>
                <div className="w-full flex justify-end">
                  <span className="bg-[#f8fafc] px-1 -mt-2">0%</span>
                </div>
              </div>

              {/* Columns */}
              {sectionStats.map((sec) => {
                const IconComp = sec.icon;
                return (
                  <div key={sec.id} className="relative z-10 flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Top Value Badge */}
                    <div className="mb-2 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <span className="px-2 py-0.5 rounded-md bg-[#111827] text-white text-[11px] font-black brutal-shadow-xs">
                        {sec.scorePercent}%
                      </span>
                    </div>

                    {/* Vertical Column Bar */}
                    <div className="relative w-full max-w-[48px] bg-slate-200 border-2 border-[#111827] rounded-t-xl overflow-hidden flex items-end justify-center h-full brutal-shadow-xs transition-all duration-300 group-hover:-translate-y-1">
                      <div
                        className={`w-full ${sec.barColor} border-t-2 border-[#111827] transition-all duration-1000 ease-out`}
                        style={{ height: `${sec.scorePercent}%` }}
                      />
                    </div>

                    {/* Bottom Column Label & Icon */}
                    <div className="mt-3 flex flex-col items-center text-center">
                      <div className={`p-1.5 rounded-lg border border-[#111827] ${sec.bgColor} mb-1 group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-black text-[#111827] line-clamp-1 max-w-[80px]">
                        {sec.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-[#4b5563] font-semibold hidden sm:block">
                        {sec.correctQuestions}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level completion sub-chart */}
          <div className="pt-3 border-t-2 border-[#111827]/10">
            <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-3">
              Tỉ lệ % hoàn thành đề thi theo cấp độ:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {levelStats.map((lvl) => (
                <div key={lvl.level} className="p-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl brutal-shadow-xs space-y-1 text-center">
                  <span className="text-[11px] font-black text-[#111827]">{lvl.level}</span>
                  <div className="text-xl font-black text-[#2563EB] font-heading">{lvl.percent}%</div>
                  <span className="text-[10px] text-[#4b5563] font-semibold block">{lvl.examsDone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. TOP 10 HỌC VIÊN XUẤT SẮC NHẤT CỦA THÁNG (LEADERBOARD) */}
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#111827] pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#F97316]" />
              <div>
                <h3 className="text-base font-black text-[#111827] font-heading">
                  Top 10 Học Viên Xuất Sắc
                </h3>
                <p className="text-[10px] text-[#4b5563]">Bảng xếp hạng điểm thi TELC B2 Tháng 9</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#ffe8d6] text-[#c2410c] text-[10px] font-black border border-[#111827]">
              THÁNG 9/2026
            </span>
          </div>

          {/* Top 10 Student List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {top10Students.map((st) => (
              <div
                key={st.rank}
                className={`p-2.5 border-2 border-[#111827] rounded-xl flex items-center justify-between gap-3 transition-all ${
                  st.rank === 1
                    ? 'bg-[#fffbe6] brutal-shadow-xs border-[#b45309]'
                    : st.rank === 2
                    ? 'bg-[#f8fafc] border-slate-400'
                    : st.rank === 3
                    ? 'bg-[#fff7ed] border-amber-700/40'
                    : 'bg-white hover:bg-[#f8fafc]'
                }`}
              >
                {/* Left: Medal / Rank & Student Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 shrink-0 rounded-lg border-2 border-[#111827] font-black text-xs flex items-center justify-center ${st.medalBg}`}
                  >
                    {st.medal}
                  </div>

                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-8 h-8 rounded-full border border-[#111827] object-cover shrink-0"
                  />

                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-[#111827] truncate leading-tight">
                      {st.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#f1f5f9] text-[#4b5563] border border-[#111827]/20">
                        {st.className}
                      </span>
                      <span className="text-[9px] font-bold text-[#2563EB]">{st.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score & Percent */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-[#111827]">
                    {st.score} <span className="text-[10px] text-[#6b7280]">/ 300</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#059669]">
                    {st.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
