import React, { useState } from 'react';
import { UserExamState } from '../../types';
import { SAMPLE_QUESTIONS } from '../../data/mockData';
import { ShieldAlert, ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, AlertTriangle, Send } from 'lucide-react';

interface ExamRoomScreenProps {
  examState: UserExamState;
  onAnswerChange: (questionId: number, optionId: string) => void;
  onFinishSection: () => void;
  onBackToDashboard: () => void;
  formattedCountdown: string;
}

export const ExamRoomScreen: React.FC<ExamRoomScreenProps> = ({
  examState,
  onAnswerChange,
  onFinishSection,
  onBackToDashboard,
  formattedCountdown,
}) => {
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const [draftNote, setDraftNote] = useState<string>('');

  const currentQuestion = SAMPLE_QUESTIONS.find((q) => q.id === activeQuestionId) || SAMPLE_QUESTIONS[0];
  const answeredCount = Object.keys(examState.answers).length;

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col font-sans">
      {/* 1. EXAM ROOM HEADER */}
      <header className="sticky top-0 z-40 bg-[#111827] text-white px-4 sm:px-6 py-3 border-b-4 border-[#2563EB]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Rời phòng thi</span>
            </button>
            <div>
              <span className="px-2 py-0.5 bg-[#2563EB] text-white text-[10px] font-black rounded uppercase">
                PHÒNG THI THỬ TRỰC TUYẾN
              </span>
              <h2 className="text-sm sm:text-base font-black font-heading text-white line-clamp-1">
                {examState.examCode}: TELC B2 Deutsch Prüfung Simulation
              </h2>
            </div>
          </div>

          {/* Countdown & Anti-cheat status */}
          <div className="flex items-center gap-3">
            {examState.tabSwitchCount > 0 && (
              <div className="px-3 py-1 bg-[#dc2626] text-white border border-white/30 rounded-lg text-xs font-black flex items-center gap-1.5 animate-bounce">
                <ShieldAlert className="w-4 h-4 text-[#fef08a]" />
                <span>Vi phạm: {examState.tabSwitchCount} lần</span>
              </div>
            )}

            <div className="px-3 py-1.5 bg-white text-[#111827] rounded-xl font-black text-sm font-heading border-2 border-[#2563EB] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2563EB]" />
              <span>{formattedCountdown}</span>
            </div>

            <button
              onClick={onFinishSection}
              className="px-4 py-2 bg-[#F97316] text-white rounded-xl font-black text-xs border border-white hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 uppercase"
            >
              <Send className="w-3.5 h-3.5" />
              Nộp Bài Thi
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN EXAM CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 8 COLS: Context & Question Panel */}
        <div className="lg:col-span-8 space-y-5">
          {/* Question Banner */}
          <div className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e8f1ff] text-[#003882] text-xs font-black border border-[#1c1b1b]">
                {currentQuestion.section} - {currentQuestion.subSection}
              </span>
              <h3 className="text-lg font-black text-[#1c1b1b] mt-1">
                {currentQuestion.title}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#564145]">
              {activeQuestionId} / {SAMPLE_QUESTIONS.length}
            </span>
          </div>

          {/* Context Text Box */}
          {currentQuestion.contextText && (
            <div className="p-5 bg-[#fff8e7] border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow text-xs sm:text-sm text-[#1c1b1b] leading-relaxed space-y-2">
              <h4 className="text-xs font-black uppercase text-[#734c00]">Đoạn Văn Bản Đề Thi (Lesetext):</h4>
              <p className="font-medium whitespace-pre-line">{currentQuestion.contextText}</p>
            </div>
          )}

          {/* Options list */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-[#564145]">Chọn phương án trả lời đúng:</h4>
            {currentQuestion.options.map((opt) => {
              const isSelected = examState.answers[currentQuestion.id] === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => onAnswerChange(currentQuestion.id, opt.id)}
                  className={`w-full text-left p-4 rounded-xl border-[2.5px] font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow font-black'
                      : 'bg-white text-[#111827] border-[#111827] hover:bg-[#f8fafc]'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Nav prev / next buttons */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-[#1c1b1b]">
            <button
              disabled={activeQuestionId === 1}
              onClick={() => setActiveQuestionId((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-white border-2 border-[#1c1b1b] rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Câu trước
            </button>
            <button
              disabled={activeQuestionId === SAMPLE_QUESTIONS.length}
              onClick={() => setActiveQuestionId((prev) => Math.min(SAMPLE_QUESTIONS.length, prev + 1))}
              className="px-4 py-2 bg-[#1c1b1b] text-white border-2 border-[#1c1b1b] rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              Câu tiếp theo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT 4 COLS: Question Grid & Scratchpad */}
        <div className="lg:col-span-4 space-y-5">
          {/* Question Grid Navigator */}
          <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1c1b1b] font-heading">
                Danh Sách Câu Hỏi ({answeredCount}/{SAMPLE_QUESTIONS.length})
              </h3>
              <span className="text-[10px] font-bold text-[#0d5225] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Đã trả lời {answeredCount}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {SAMPLE_QUESTIONS.map((q) => {
                const isAnswered = Boolean(examState.answers[q.id]);
                const isCurrent = q.id === activeQuestionId;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    className={`h-10 rounded-lg border-2 font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-[#f36b92] border-[#1c1b1b] bg-[#ffe3ea] text-[#800035]'
                        : isAnswered
                        ? 'bg-[#0d5225] text-white border-[#1c1b1b]'
                        : 'bg-[#fcf9f8] text-[#1c1b1b] border-[#1c1b1b] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Draft Note Scratchpad */}
          <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow space-y-2">
            <h4 className="text-xs font-black uppercase text-[#1c1b1b] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#f36b92]" />
              Nháp nhanh (Scratchpad):
            </h4>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Ghi chú từ vựng, dàn ý bài viết Schriftlicher Ausdruck..."
              className="w-full h-32 p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#f36b92] resize-none"
            />
          </div>
        </div>
      </main>
    </div>
  );
};
