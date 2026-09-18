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
  vocabsCount?: number;
  grammarCount?: number;
  onSelectExam: (exam: ExamModel) => void;
  onStartExamRoom: () => void;
  onNavigateToVocab: () => void;
  onNavigateToGrammar: () => void;
  onNavigateToSchreiben: () => void;
  onNavigateToLeaderboard?: () => void;
  currentUser?: 'admin' | 'student';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exams,
  students,
  liveFeed,
  vocabsCount = 0,
  grammarCount = 0,
  onSelectExam,
  onStartExamRoom,
  onNavigateToVocab,
  onNavigateToGrammar,
  onNavigateToSchreiben,
  currentUser = 'student',
}) => {
  const [activeLevelFilter, setActiveLevelFilter] = useState<'ALL' | 'B2' | 'B1' | 'A2' | 'A1'>('B2');

  // Dynamic calculation of sectionStats based on liveFeed (MySQL CSDL exam results)
  const totalResults = liveFeed.length;
  const avgReading = totalResults > 0
    ? Math.round(liveFeed.reduce((acc, r) => acc + (r.readingScore || (r.score * 0.25)), 0) / totalResults)
    : 0;
  const avgReadingPct = Math.round((avgReading / 75) * 100) || 0;

  const avgSprach = totalResults > 0
    ? Math.round(avgReadingPct * 0.9)
    : 0;

  const avgListening = totalResults > 0
    ? Math.round(liveFeed.reduce((acc, r) => acc + (r.listeningScore || (r.score * 0.25)), 0) / totalResults)
    : 0;
  const avgListeningPct = Math.round((avgListening / 75) * 100) || 0;

  const avgWriting = totalResults > 0
    ? Math.round(liveFeed.reduce((acc, r) => acc + (r.writingScore || (r.score * 0.15)), 0) / totalResults)
    : 0;
  const avgWritingPct = Math.round((avgWriting / 45) * 100) || 0;

  const avgSpeaking = totalResults > 0
    ? Math.round(liveFeed.reduce((acc, r) => acc + (r.speakingScore || (r.score * 0.25)), 0) / totalResults)
    : 0;
  const avgSpeakingPct = Math.round((avgSpeaking / 75) * 100) || 0;

  const sectionStats = [
    {
      id: 'lese',
      name: 'Leseverstehen (Kỹ năng Đọc)',
      scorePercent: avgReadingPct,
      correctQuestions: totalResults > 0 ? `${Math.round(avgReading / 3)}/25 câu` : '0/25 câu',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
      barColor: 'bg-blue-600',
      icon: BookOpen,
      status: avgReadingPct >= 75 ? 'Đạt chuẩn TELC B2' : totalResults > 0 ? 'Cần rèn luyện' : 'Chưa có dữ liệu',
    },
    {
      id: 'sprach',
      name: 'Sprachbausteine (Từ vựng & Bẫy ngữ pháp)',
      scorePercent: avgSprach,
      correctQuestions: totalResults > 0 ? `${Math.round(avgSprach * 0.2)}/20 câu` : '0/20 câu',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
      barColor: 'bg-purple-600',
      icon: Brain,
      status: avgSprach >= 75 ? 'Xuất sắc' : totalResults > 0 ? 'Cần chú ý từ nối' : 'Chưa có dữ liệu',
    },
    {
      id: 'hoer',
      name: 'Hörverstehen (Kỹ năng Nghe hội thoại)',
      scorePercent: avgListeningPct,
      correctQuestions: totalResults > 0 ? `${Math.round(avgListening / 3.75)}/20 câu` : '0/20 câu',
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      barColor: 'bg-emerald-600',
      icon: Headphones,
      status: avgListeningPct >= 75 ? 'Phản xạ tốt' : totalResults > 0 ? 'Cần luyện thêm nghe' : 'Chưa có dữ liệu',
    },
    {
      id: 'schreib',
      name: 'Schriftlicher Ausdruck (Luyện Viết thư B2)',
      scorePercent: avgWritingPct,
      correctQuestions: totalResults > 0 ? `${avgWriting}/45 điểm` : '0/45 điểm',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
      barColor: 'bg-orange-500',
      icon: FileText,
      status: avgWritingPct >= 75 ? 'Xuất sắc' : totalResults > 0 ? 'Chưa đạt mốc 33d' : 'Chưa có dữ liệu',
    },
    {
      id: 'sprech',
      name: 'Mündlicher Ausdruck (Nói Thuyết trình & Thảo luận)',
      scorePercent: avgSpeakingPct,
      correctQuestions: totalResults > 0 ? `${(avgSpeaking / 7.5).toFixed(1)}/10 điểm` : '0/10 điểm',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
      barColor: 'bg-rose-500',
      icon: MessageSquare,
      status: avgSpeakingPct >= 75 ? 'Tự tin giao tiếp' : totalResults > 0 ? 'Cần luyện phản xạ' : 'Chưa có dữ liệu',
    },
  ];

  // Dynamic Level stats computation from MySQL CSDL (exams & liveFeed)
  const levels = ['A1', 'A2', 'B1', 'B2'] as const;
  const levelStats = levels.map((lvl) => {
    const lvlExams = exams.filter((e) => e.level.includes(lvl));
    const lvlResults = liveFeed.filter((f) => {
      const matchedExam = exams.find((e) => e.examCode === f.examCode);
      return matchedExam ? matchedExam.level.includes(lvl) : false;
    });
    const totalCount = lvlExams.length;
    const doneCount = lvlResults.length;
    const pct = totalCount > 0 ? Math.min(100, Math.round((doneCount / totalCount) * 100)) : 0;

    return {
      level: `TELC ${lvl}`,
      percent: pct,
      examsDone: `${doneCount}/${totalCount} Đề`,
      color: lvl === 'A1' ? 'bg-emerald-500' : lvl === 'A2' ? 'bg-teal-500' : lvl === 'B1' ? 'bg-sky-500' : 'bg-blue-600',
    };
  });

  const passRateStr = totalResults > 0
    ? `${((liveFeed.filter((f) => f.score >= 180).length / totalResults) * 100).toFixed(1)}%`
    : '0%';

  // Compute Top 10 Students dynamically from MySQL CSDL data (students & liveFeed props)
  const top10Students = students.map((st, idx) => {
    const studentResults = liveFeed.filter((f) => f.studentName.toLowerCase() === st.name.toLowerCase());
    const bestScore = studentResults.length > 0
      ? Math.max(...studentResults.map((r) => r.score))
      : (st.currentScore || 0);
    const percent = Math.round((bestScore / 300) * 100 * 10) / 10;

    return {
      rank: idx + 1,
      name: st.name,
      avatar: st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      className: st.className || 'B2',
      score: bestScore,
      maxScore: 300,
      percent,
      badge: bestScore >= 270 ? 'VÔ ĐỊCH' : bestScore >= 240 ? 'GIỎI' : 'ĐANG HỌC',
      medal: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`,
      medalBg: idx === 0 ? 'bg-amber-100 text-amber-900 border-amber-400' : idx === 1 ? 'bg-slate-200 text-slate-800 border-slate-400' : idx === 2 ? 'bg-amber-800/10 text-amber-800 border-amber-600/30' : 'bg-gray-100 text-gray-700 border-gray-300',
    };
  }).sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 }));

  if (currentUser === 'admin') {
    return (
      <div className="space-y-6 w-full">
        {/* Admin Overview Header */}
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB] text-white text-xs font-black uppercase border border-[#111827]">
              QUẢN TRỊ VIÊN / ADMIN DASHBOARD
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1 font-heading">
              Trung Tâm Quản Lý Hệ Thống & Đào Tạo TELC B2
            </h2>
            <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5">
              Tổng quan thông số hệ thống, quản lý ngân hàng đề thi, tài liệu, ngữ pháp và danh sách học viên
            </p>
          </div>
        </div>

        {/* 4 Admin Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#4b5563] uppercase">Bộ Đề Thi</span>
              <FileCheck2 className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div className="text-3xl font-black text-[#111827]">{exams.length} Bộ đề</div>
            <p className="text-[11px] text-[#059669] font-bold">● Đề thi thử tiêu chuẩn TELC B2</p>
          </div>

          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#4b5563] uppercase">Chuyên Đề Ngữ Pháp</span>
              <Brain className="w-6 h-6 text-[#F97316]" />
            </div>
            <div className="text-3xl font-black text-[#111827]">{grammarCount} Bài học</div>
            <p className="text-[11px] text-[#2563EB] font-bold">● Kèm quy tắc bẫy & bài tập</p>
          </div>

          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#4b5563] uppercase">Kho Từ Vựng</span>
              <BookOpen className="w-6 h-6 text-[#059669]" />
            </div>
            <div className="text-3xl font-black text-[#111827]">{vocabsCount} Từ</div>
            <p className="text-[11px] text-[#F97316] font-bold">● Dữ liệu Flashcard 3D B2</p>
          </div>

          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#4b5563] uppercase">Học Viên Luyện Thi</span>
              <Users className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <div className="text-3xl font-black text-[#111827]">{students.length} Học viên</div>
            <p className="text-[11px] text-[#7c3aed] font-bold">● Đang hoạt động trên portal</p>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4">
          <h3 className="text-lg font-black text-[#111827] font-heading">
            Chức Năng Quản Lý Nhanh Dành Cho Admin
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => exams.length > 0 && onSelectExam(exams[0])}
              className="p-4 bg-[#eff6ff] border-2 border-[#111827] rounded-xl text-left hover:bg-[#dbeafe] transition-all cursor-pointer brutal-shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-[#1e40af] text-sm">📝 Quản Lý Ngân Hàng Đề Thi</span>
                <ArrowRight className="w-4 h-4 text-[#1e40af] group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-[#4b5563] mt-1">Xem bảng danh sách đề thi, tạo mới bộ đề và chỉnh sửa cấu trúc</p>
            </button>

            <button
              onClick={onNavigateToGrammar}
              className="p-4 bg-[#fff7ed] border-2 border-[#111827] rounded-xl text-left hover:bg-[#ffedd5] transition-all cursor-pointer brutal-shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-[#c2410c] text-sm">📘 Quản Lý Chuyên Đề Ngữ Pháp</span>
                <ArrowRight className="w-4 h-4 text-[#c2410c] group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-[#4b5563] mt-1">Quản lý các chuyên đề bẫy ngữ pháp, ví dụ và bài tập củng cố</p>
            </button>

            <button
              onClick={onNavigateToVocab}
              className="p-4 bg-[#ecfdf5] border-2 border-[#111827] rounded-xl text-left hover:bg-[#d1fae5] transition-all cursor-pointer brutal-shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-[#047857] text-sm">📚 Quản Lý Kho Từ Vựng B2</span>
                <ArrowRight className="w-4 h-4 text-[#047857] group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-[#4b5563] mt-1">Quản lý kho từ vựng tiếng Đức, quán từ, nghĩa Việt và ví dụ</p>
            </button>
          </div>
        </div>

        {/* BIỂU ĐỒ THÔNG SỐ CÁC PHẦN THI & LEADERBOARD FOR ADMIN */}
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
                Thống kê toàn hệ thống
              </span>
            </div>

            {/* Vertical Column Bar Chart */}
            <div className="bg-[#f8fafc] border-2 border-[#111827] rounded-2xl p-4 sm:p-6 space-y-4 brutal-shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-extrabold text-[#111827] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#F97316]" />
                  Mức % điểm 5 Kỹ Năng Thi TELC B2:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#dbeafe] text-[#1e40af] font-black border border-[#2563EB] text-[10px]">
                  🎯 Ngưỡng đỗ TELC B2: 75%
                </span>
              </div>

              <div className="relative h-64 sm:h-72 w-full pt-8 pb-4 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 border-b-2 border-l-2 border-[#111827]">
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

                {sectionStats.map((sec) => {
                  const IconComp = sec.icon;
                  return (
                    <div key={sec.id} className="relative z-10 flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="mb-2 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <span className="px-2 py-0.5 rounded-md bg-[#111827] text-white text-[11px] font-black brutal-shadow-xs">
                          {sec.scorePercent}%
                        </span>
                      </div>

                      <div className="relative w-full max-w-[48px] bg-slate-200 border-2 border-[#111827] rounded-t-xl overflow-hidden flex items-end justify-center h-full brutal-shadow-xs transition-all duration-300 group-hover:-translate-y-1">
                        <div
                          className={`w-full ${sec.barColor} border-t-2 border-[#111827] transition-all duration-1000 ease-out`}
                          style={{ height: `${sec.scorePercent}%` }}
                        />
                      </div>

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

          {/* Top 10 Student Leaderboard (1 col) */}
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#111827] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F97316]" />
                <div>
                  <h3 className="text-base font-black text-[#111827] font-heading">
                    Top 10 Học Viên Xuất Sắc
                  </h3>
                  <p className="text-[10px] text-[#4b5563]">Bảng xếp hạng điểm thi TELC B2</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#ffe8d6] text-[#c2410c] text-[10px] font-black border border-[#111827]">
                HỆ THỐNG
              </span>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {top10Students.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl space-y-1">
                  <p className="text-xs font-black text-slate-600">Chưa có dữ liệu học viên trong CSDL MySQL</p>
                  <p className="text-[11px] text-slate-400 font-medium">Bảng xếp hạng sẽ tự động cập nhật khi có học viên thi!</p>
                </div>
              ) : (
                top10Students.map((st) => (
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

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#111827]">
                        {st.score} <span className="text-[10px] text-[#6b7280]">/ 300</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#059669]">
                        {st.percent}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Feed Exam Submissions */}
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#111827] font-heading">
              Lịch Sử Nộp Bài Thi Thử Mới Nhất
            </h3>
            <span className="text-xs font-bold text-[#4b5563]">Cập nhật thời gian thực</span>
          </div>

          <div className="divide-y divide-[#111827]/10 border-2 border-[#111827] rounded-xl overflow-hidden text-xs">
            {liveFeed.map((item) => (
              <div key={item.id} className="p-4 bg-white hover:bg-[#f8fafc] flex items-center justify-between">
                <div>
                  <b className="text-[#111827] text-sm">{item.studentName}</b>
                  <p className="text-[#4b5563] text-xs mt-0.5">{item.description}</p>
                  <span className="text-[10px] text-[#6b7280]">{item.timeAgo}</span>
                </div>
                <span className="text-sm font-black text-[#2563EB]">{item.score} / {item.maxScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">{passRateStr}</p>
          <span className="text-[10px] text-[#0d5225] font-bold">Tính từ kết quả thi thử</span>
        </div>

        <div className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#564145]">Kho Đề Thi</span>
            <FileCheck2 className="w-5 h-5 text-[#f36b92]" />
          </div>
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">{exams.length} Đề chuẩn</p>
          <span className="text-[10px] text-[#897175] font-bold">Cập nhật từ CSDL</span>
        </div>

        <div
          onClick={onNavigateToVocab}
          className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-1 cursor-pointer hover:bg-[#fcf9f8] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#564145]">Từ vựng B2</span>
            <BookOpen className="w-5 h-5 text-[#003882]" />
          </div>
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">{vocabsCount} Từ</p>
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
          <p className="text-2xl font-black text-[#1c1b1b] font-heading">{grammarCount} Chuyên đề</p>
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
            {top10Students.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl space-y-1">
                <p className="text-xs font-black text-slate-600">Chưa có kết quả thi trong CSDL MySQL</p>
                <p className="text-[11px] text-slate-400 font-medium">Bảng xếp hạng sẽ tự động cập nhật khi học viên hoàn thành bài thi!</p>
              </div>
            ) : (
              top10Students.map((st) => (
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

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-[#111827]">
                      {st.score} <span className="text-[10px] text-[#6b7280]">/ 300</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#059669]">
                      {st.percent}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
