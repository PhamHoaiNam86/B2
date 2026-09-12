import React, { useState, useEffect } from 'react';
import { ExamModel } from '../../types';
import { ArrowLeft, Clock, FileText, CheckCircle2, ShieldCheck, Play, Award, AlertCircle, Edit, ListFilter, HelpCircle, Lightbulb } from 'lucide-react';

interface ExamDetailViewProps {
  exam: ExamModel;
  onBack: () => void;
  onStartExam: () => void;
  onShowToast?: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: 'admin' | 'student';
  onEditExam?: (exam: ExamModel) => void;
}

export const ExamDetailView: React.FC<ExamDetailViewProps> = ({
  exam,
  onBack,
  onStartExam,
  onShowToast,
  currentUser = 'student',
  onEditExam,
}) => {
  const [questions, setQuestions] = useState<any[]>(exam.questions || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'structure' | 'questions'>('structure');

  useEffect(() => {
    if (exam.examCode) {
      setLoading(true);
      fetch(`/api/v1/questions/${exam.examCode}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const mapped = res.data.map((q: any, idx: number) => ({
              id: String(q.id || idx + 1),
              questionText: q.title || `Câu ${idx + 1}`,
              contextText: q.context_text || '',
              explanation: q.explanation || '',
              options: q.options_json
                ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json)
                : [],
            }));
            setQuestions(mapped);
          } else if (exam.questions && Array.isArray(exam.questions)) {
            setQuestions(exam.questions);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [exam.examCode]);

  return (
    <div className="space-y-6 w-full">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#111827] pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh Sách Đề Thi</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-black uppercase border border-[#111827]">
            {exam.examCode}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#eff6ff] text-[#1e40af] text-xs font-black border border-[#111827]">
            {exam.level || 'TELC B2'}
          </span>
          {currentUser === 'admin' && onEditExam && (
            <button
              onClick={() => onEditExam(exam)}
              className="px-3.5 py-1.5 bg-[#fef3c7] text-[#92400e] border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#fde68a] flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Sửa Bộ Đề Này</span>
            </button>
          )}
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
            {exam.description || 'Bộ đề thi thử tiếng Đức mô phỏng cấu trúc kỳ thi tiêu chuẩn.'}
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
            <span className="text-sm font-black text-[#111827]">{questions.length || exam.totalQuestions} câu</span>
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

      {/* Tab Switcher: Structure vs Detailed Questions Preview */}
      <div className="flex items-center gap-2 border-b-2 border-[#111827] pb-2">
        <button
          onClick={() => setViewTab('structure')}
          className={`px-4 py-2.5 rounded-xl border-2 font-black text-xs cursor-pointer transition-all flex items-center gap-2 ${
            viewTab === 'structure'
              ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs'
              : 'bg-white text-[#111827] border-transparent hover:border-[#111827]'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Cấu Trúc Các Phần Thi</span>
        </button>

        <button
          onClick={() => setViewTab('questions')}
          className={`px-4 py-2.5 rounded-xl border-2 font-black text-xs cursor-pointer transition-all flex items-center gap-2 ${
            viewTab === 'questions'
              ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs'
              : 'bg-white text-[#111827] border-transparent hover:border-[#111827]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Chi Tiết Nội Dung Câu Hỏi ({questions.length})</span>
        </button>
      </div>

      {/* TAB 1: Module Breakdown List */}
      {viewTab === 'structure' && (
        <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
            Cấu Trúc Các Phần Thi Tiêu Chuẩn (Module Breakdown):
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
      )}

      {/* TAB 2: Detailed Question Bank List */}
      {viewTab === 'questions' && (
        <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#2563EB]" />
            Danh Sách Câu Hỏi & Lựa Chọn Đáp Án Trong Bộ Đề:
          </h3>

          {loading ? (
            <div className="p-8 text-center bg-[#f8fafc] border-2 border-[#111827] rounded-xl font-bold text-xs text-[#4b5563]">
              Đang tải danh sách câu hỏi...
            </div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center bg-[#f8fafc] border-2 border-[#111827] rounded-xl space-y-2">
              <FileText className="w-8 h-8 text-[#94a3b8] mx-auto" />
              <h4 className="text-sm font-black text-[#111827]">Chưa có dữ liệu chi tiết câu hỏi</h4>
              <p className="text-xs text-[#64748b]">Bộ đề thi này hiện đang được cập nhật câu hỏi.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="p-5 bg-white border-2 border-[#111827] rounded-xl brutal-shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#111827]">
                      Câu {qIdx + 1}: {q.questionText || `Nội dung câu hỏi ${qIdx + 1}`}
                    </h4>
                  </div>

                  {q.contextText && (
                    <div className="p-3 bg-[#fff8e7] border border-[#111827] rounded-lg text-xs text-[#111827] font-medium whitespace-pre-line">
                      <b className="text-[#92400e] block mb-1">Đoạn văn bản / Ngữ cảnh:</b>
                      {q.contextText}
                    </div>
                  )}

                  {/* Options */}
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt: any, optIdx: number) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const rawText = opt.text || '';
                        const cleanText = rawText.replace(/^(?:Đáp án\s*)?[A-Z][:.]\s*/i, '');
                        const isCorrect = Boolean(opt.isCorrect);

                        return (
                          <div
                            key={opt.id || optIdx}
                            className={`p-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-between ${
                              isCorrect
                                ? 'bg-[#dcfce7] text-[#166534] border-[#166534]'
                                : 'bg-[#f8fafc] text-[#334155] border-[#cbd5e1]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded font-black text-[11px] ${isCorrect ? 'bg-[#166534] text-white' : 'bg-[#e2e8f0] text-[#475569]'}`}>
                                {letter}
                              </span>
                              <span>{cleanText || rawText}</span>
                            </div>
                            {isCorrect && (
                              <span className="text-[10px] font-black bg-[#166534] text-white px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                ✓ Đáp án đúng
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-3 bg-[#eff6ff] border border-[#1e40af] rounded-lg text-xs text-[#1e40af] space-y-1 mt-2">
                      <b className="flex items-center gap-1 font-black text-[#1e40af]">
                        <Lightbulb className="w-3.5 h-3.5" /> Giải thích chi tiết đáp án:
                      </b>
                      <p className="whitespace-pre-line text-[#1e3a8a] font-medium">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
