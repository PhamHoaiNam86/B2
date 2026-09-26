import React, { useState } from 'react';
import { ExamModel } from '../../types';
import { FileCheck2, Clock, Plus, ArrowRight, Play, Award, Filter, Sparkles, BookOpen } from 'lucide-react';
import { AdminExamsView } from '../admin/AdminExamsView';

interface ExamsViewProps {
  exams: ExamModel[];
  levelLabel?: string;
  initialLevelFilter?: string;
  onSelectExam: (exam: ExamModel) => void;
  onStartExam: (exam: ExamModel) => void;
  onOpenNewExamModal: () => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: 'admin' | 'student';
  onEditExam?: (exam: ExamModel) => void;
  onDeleteExam?: (id: string) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  levelLabel = 'B2',
  initialLevelFilter,
  onSelectExam,
  onStartExam,
  onOpenNewExamModal,
  onShowToast,
  currentUser = 'student',
  onEditExam,
  onDeleteExam,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'ALL' | 'TELC' | 'GOETHE'>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  if (currentUser === 'admin') {
    return (
      <AdminExamsView
        exams={exams}
        levelLabel={levelLabel}
        initialLevelFilter={initialLevelFilter}
        onSelectExam={onSelectExam}
        onOpenNewExamModal={onOpenNewExamModal}
        onShowToast={onShowToast}
        onEditExam={onEditExam}
        onDeleteExam={onDeleteExam}
      />
    );
  }

  // Target level filter (e.g., 'B1', 'B2', 'A1', 'A2', 'C1')
  const targetLevel = (initialLevelFilter && initialLevelFilter !== 'ALL')
    ? initialLevelFilter.toUpperCase().trim()
    : (levelLabel && levelLabel !== 'Tất cả đề' && levelLabel !== 'ALL')
    ? levelLabel.toUpperCase().trim()
    : null;

  // Filter logic: Provider (TELC/GOETHE) AND Level (A1, A2, B1, B2, C1)
  const filteredExams = exams.filter((exam) => {
    const examProvider = (
      exam.provider ||
      (exam.name.toUpperCase().includes('GOETHE') || String(exam.level).toUpperCase().includes('GOETHE') ? 'GOETHE' : 'TELC')
    ).toUpperCase();

    const matchesProvider = selectedProvider === 'ALL' || examProvider === selectedProvider;

    if (!targetLevel) return matchesProvider;

    const examLevelStr = String(exam.level || '').toUpperCase();
    const examNameStr = String(exam.name || '').toUpperCase();
    const fullText = `${examLevelStr} ${examNameStr}`;

    // Match exact level token (e.g. B1, B2, A1, A2, C1)
    const matchesLevel = new RegExp(`\\b${targetLevel}\\b`, 'i').test(fullText) || fullText.includes(targetLevel);

    return matchesProvider && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#ffe3ea] text-[#800035] text-xs font-black border border-[#1c1b1b]">
              KHO ĐỀ THI THỬ MÔ PHỎNG TRỰC TUYẾN
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#166534] text-xs font-black border border-[#166534]">
              CHUẨN TELC & GOETHE
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#1c1b1b] mt-1.5 font-heading">
            Luyện Thi Thử Cấu Trúc Đề GOETHE & TELC
          </h2>
          <p className="text-xs text-[#564145] mt-0.5 font-medium">
            Mô phỏng phòng thi 2 cột thực tế, bấm giờ đếm ngược, hỗ trợ chấm AI giải thích chi tiết đáp án
          </p>
        </div>
      </div>

      {/* FILTER BAR: TELC VS GOETHE */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-4 brutal-shadow flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedProvider('ALL')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all cursor-pointer font-heading ${
              selectedProvider === 'ALL'
                ? 'bg-[#111827] text-white border-[#111827] brutal-shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111827]'
            }`}
          >
            Tất Cả Đề Thi
          </button>
          <button
            onClick={() => setSelectedProvider('TELC')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 font-heading ${
              selectedProvider === 'TELC'
                ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111827]'
            }`}
          >
            <Award className="w-4 h-4 text-blue-200" /> Đề Thi TELC
          </button>
          <button
            onClick={() => setSelectedProvider('GOETHE')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 font-heading ${
              selectedProvider === 'GOETHE'
                ? 'bg-[#059669] text-white border-[#111827] brutal-shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111827]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Đề Thi GOETHE
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Hiển thị <b className="text-[#111827]">{filteredExams.length}</b> đề thi
        </span>
      </div>

      {/* EXAMS GRID */}
      {filteredExams.length === 0 ? (
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-12 text-center brutal-shadow space-y-4">
          <div className="w-16 h-16 bg-[#eff6ff] border-2 border-[#111827] rounded-2xl flex items-center justify-center mx-auto text-3xl">
            📝
          </div>
          <h3 className="text-xl font-black text-[#111827] font-heading">Chưa có đề thi phù hợp</h3>
          <p className="text-xs text-[#4b5563] max-w-md mx-auto leading-relaxed font-medium">
            Không tìm thấy đề thi khớp với bộ lọc ({selectedProvider} - Trình độ {targetLevel || 'Tất cả'}). Vui lòng chọn bộ lọc khác!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredExams.map((exam) => {
            const isGoethe = (exam.provider || (exam.name.toUpperCase().includes('GOETHE') ? 'GOETHE' : 'TELC')) === 'GOETHE';

            return (
              <div
                key={exam.id}
                className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-white text-[10px] font-black border border-[#111827] ${
                        isGoethe ? 'bg-[#059669]' : 'bg-[#2563EB]'
                      }`}>
                        {isGoethe ? 'GOETHE-ZERTIFIKAT' : 'TELC DEUTSCH'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">
                        {exam.level || 'B2'}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded bg-[#eff6ff] text-[#1e40af] text-[10px] font-black border border-[#111827] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {exam.durationMinutes} phút
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block font-bold">Mã đề: {exam.examCode}</span>
                    <h3 className="text-lg font-black text-[#111827] font-heading mt-0.5">{exam.name}</h3>
                  </div>

                  <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-3 font-medium">{exam.description}</p>
                </div>

                {/* Section breakdown tags */}
                <div className="space-y-3 pt-3 border-t-2 border-[#111827]/10">
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                    {exam.sections && exam.sections.length > 0 ? (
                      exam.sections.map((sec, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                          {sec.name} ({sec.questionCount || 10} câu)
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">Lesen</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">Hören</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">Schreiben</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">Sprechen</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#4b5563]">
                    <span>Tỉ lệ đỗ: <b className="text-[#059669]">{exam.passRate}</b></span>
                    <span>Mục tiêu điểm: <b className="text-[#2563EB]">{exam.targetScore}/300</b></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectExam(exam)}
                      className="flex-1 py-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold hover:bg-[#f1f5f9] brutal-shadow-xs cursor-pointer"
                    >
                      Cấu Trúc Đề
                    </button>
                    <button
                      onClick={() => onStartExam(exam)}
                      className="flex-1 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center justify-center gap-1 uppercase font-heading"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Vào Thi Ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
