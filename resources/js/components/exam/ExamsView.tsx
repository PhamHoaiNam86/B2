import React from 'react';
import { ExamModel } from '../../types';
import { FileCheck2, Clock, Plus, ArrowRight, Play, Award } from 'lucide-react';

interface ExamsViewProps {
  exams: ExamModel[];
  levelLabel?: string;
  onSelectExam: (exam: ExamModel) => void;
  onStartExam: (exam: ExamModel) => void;
  onOpenNewExamModal: () => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: 'admin' | 'student';
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  levelLabel = 'B2',
  onSelectExam,
  onStartExam,
  onOpenNewExamModal,
  onShowToast,
  currentUser = 'admin',
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#ffe3ea] text-[#800035] text-xs font-black border border-[#1c1b1b]">
            KHO ĐỀ THI TRÌNH ĐỘ {levelLabel}
          </span>
          <h2 className="text-2xl font-black text-[#1c1b1b] mt-1 font-heading">
            Danh Sách Đề Thi Thử {levelLabel} Mô Phỏng
          </h2>
          <p className="text-xs text-[#564145] mt-0.5">
            Luyện tập đề thi thử theo cấu trúc tiêu chuẩn Goethe / TELC {levelLabel}
          </p>
        </div>

        {currentUser === 'admin' ? (
          <button
            onClick={onOpenNewExamModal}
            className="px-4 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Tạo Đề Thi Mới
          </button>
        ) : (
          <div className="px-3.5 py-2 bg-slate-100 border-2 border-[#111827] rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
            <span>🔒 Quyền Học viên: Chỉ làm bài & xem đáp án</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#2563EB] text-white text-[10px] font-black border border-[#111827]">
                  {exam.examCode}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#eff6ff] text-[#1e40af] text-[10px] font-black border border-[#111827] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {exam.durationMinutes} phút
                </span>
              </div>
              <h3 className="text-lg font-black text-[#111827] font-heading">{exam.name}</h3>
              <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-3">{exam.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t-2 border-[#111827]/10">
              <div className="flex items-center justify-between text-xs font-bold text-[#4b5563]">
                <span>Tỉ lệ học viên đỗ: <b className="text-[#059669]">{exam.passRate}</b></span>
                <span>Mục tiêu: <b className="text-[#2563EB]">{exam.targetScore}/300 điểm</b></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectExam(exam)}
                  className="flex-1 py-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold hover:bg-[#f1f5f9] brutal-shadow-xs cursor-pointer"
                >
                  Xem Cấu Trúc Đề
                </button>
                <button
                  onClick={() => onStartExam(exam)}
                  className="flex-1 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center justify-center gap-1 uppercase"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Vào Thi Ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
