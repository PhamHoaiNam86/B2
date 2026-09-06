import React from 'react';
import { ExamModel } from '../../types';
import { ArrowLeft, Clock, FileText, CheckCircle2, ShieldCheck, Play, Award, AlertCircle } from 'lucide-react';

interface ExamDetailViewProps {
  exam: ExamModel;
  onBack: () => void;
  onStartExam: () => void;
  onShowToast?: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ExamDetailView: React.FC<ExamDetailViewProps> = ({
  exam,
  onBack,
  onStartExam,
  onShowToast,
}) => {
  return (
    <div className="space-y-6 w-full">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b-2 border-[#111827] pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh Sách Đề Thi</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-black uppercase border border-[#111827]">
            {exam.examCode}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#eff6ff] text-[#1e40af] text-xs font-black border border-[#111827]">
            {exam.level || 'TELC B2'}
          </span>
        </div>
      </div>

      {/* Main Exam Title Card */}
      <div className="p-6 sm:p-8 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-[#ffe8d6] text-[#c2410c] border border-[#111827] rounded-md text-[10px] font-black uppercase">
            ĐỀ THI CHUẨN ĐỊNH DẠNG TELC DEUTSCH
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] font-heading">
            {exam.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* Quick Parameters Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-center space-y-1">
            <Clock className="w-4 h-4 text-[#2563EB] mx-auto" />
            <span className="text-[10px] text-[#4b5563] font-bold block">Thời gian làm bài</span>
            <span className="text-sm font-black text-[#111827]">{exam.durationMinutes} phút</span>
          </div>

          <div className="p-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-center space-y-1">
            <FileText className="w-4 h-4 text-[#F97316] mx-auto" />
            <span className="text-[10px] text-[#4b5563] font-bold block">Tổng số câu hỏi</span>
            <span className="text-sm font-black text-[#111827]">{exam.totalQuestions} câu</span>
          </div>

          <div className="p-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-center space-y-1">
            <Award className="w-4 h-4 text-[#059669] mx-auto" />
            <span className="text-[10px] text-[#4b5563] font-bold block">Điểm mục tiêu (Target)</span>
            <span className="text-sm font-black text-[#059669]">{exam.targetScore} / 300</span>
          </div>

          <div className="p-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-center space-y-1">
            <ShieldCheck className="w-4 h-4 text-[#7c3aed] mx-auto" />
            <span className="text-[10px] text-[#4b5563] font-bold block">Tỉ lệ học viên đỗ</span>
            <span className="text-sm font-black text-[#7c3aed]">{exam.passRate}</span>
          </div>
        </div>
      </div>

      {/* Module Breakdown List */}
      <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
        <h3 className="text-base font-black text-[#111827] font-heading flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
          Cấu Trúc Các Phần Thi (Module Breakdown):
        </h3>

        <div className="space-y-3">
          {exam.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#f8fafc] border-2 border-[#111827] rounded-xl flex items-center justify-between gap-4 text-xs font-bold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-black flex items-center justify-center border border-[#111827]">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-black text-[#111827]">{sec.name}</h4>
                  <span className="text-[10px] text-[#4b5563]">{sec.questionCount} câu hỏi chính</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-white border border-[#111827] rounded-lg text-xs font-black text-[#1e40af]">
                ⏱ {sec.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Anti-cheat notice */}
      <div className="p-4 bg-[#fff3d6] border-2 border-[#111827] rounded-xl flex items-start gap-3 text-xs">
        <AlertCircle className="w-5 h-5 text-[#c2410c] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-black text-[#c2410c]">Lưu ý quan trọng trước khi mở đề thi:</h4>
          <p className="text-[#78350f] mt-0.5">
            Hệ thống áp dụng đếm ngược thời gian thực và ghi nhận bẫy chống chuyển tab gian lận. Vui lòng đảm bảo kết nối mạng ổn định trước khi bấm nút Thi Ngay.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold hover:bg-[#f8fafc] cursor-pointer"
        >
          Quay lại danh sách
        </button>

        <button
          onClick={onStartExam}
          className="px-6 py-3 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wide font-heading"
        >
          <Play className="w-4 h-4 fill-current" />
          Bắt Đầu Vào Phòng Thi Thử Ngay
        </button>
      </div>
    </div>
  );
};
