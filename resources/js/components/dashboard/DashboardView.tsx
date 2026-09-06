import React from 'react';
import { ExamModel, Student, ExamFeedItem } from '../../types';
import { FileCheck2, BookOpen, Brain, Users, Award, Sparkles, ArrowRight, Play } from 'lucide-react';

interface DashboardViewProps {
  exams: ExamModel[];
  students: Student[];
  liveFeed: ExamFeedItem[];
  onSelectExam: (exam: ExamModel) => void;
  onStartExamRoom: () => void;
  onNavigateToVocab: () => void;
  onNavigateToGrammar: () => void;
  onNavigateToSchreiben: () => void;
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
}) => {
  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow-lg relative overflow-hidden">
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

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#564145]">Tỉ lệ đỗ B2</span>
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

      {/* 3. EXAM REPOSITORY PREVIEW & RECENT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Exam Sets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#1c1b1b] font-heading">
              Đề Thi Thử TELC B2 Mới Nhất
            </h3>
            <span className="text-xs font-bold text-[#f36b92]">Đề thi đạt chuẩn TELC</span>
          </div>

          <div className="space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-5 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:translate-y-[-2px] transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white text-[10px] font-black border border-[#111827]">
                      {exam.examCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#eff6ff] text-[#1e40af] text-[10px] font-black border border-[#111827]">
                      {exam.durationMinutes} phút
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#111827]">{exam.name}</h4>
                  <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectExam(exam)}
                    className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold hover:bg-[#f1f5f9] brutal-shadow-xs cursor-pointer"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={onStartExamRoom}
                    className="px-4 py-2 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1"
                  >
                    Thi ngay <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live Activity Feed */}
        <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1c1b1b] pb-3">
            <h3 className="text-base font-black text-[#1c1b1b] font-heading flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Lịch sử Làm Bài Mới Nhất
            </h3>
          </div>

          <div className="space-y-3">
            {liveFeed.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1c1b1b] font-black">{item.studentName}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px]">
                    {item.score} điểm
                  </span>
                </div>
                <p className="text-[11px] text-[#564145]">{item.description}</p>
                <span className="text-[9px] text-[#897175] block">{item.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
