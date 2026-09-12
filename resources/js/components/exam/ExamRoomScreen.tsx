import React, { useState, useEffect, useRef } from 'react';
import { UserExamState, Question } from '../../types';
import {
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Send,
  Headphones,
  BookOpen,
  Brain,
  PenTool,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  HelpCircle,
  X,
} from 'lucide-react';

interface ExamRoomScreenProps {
  examState: UserExamState;
  onAnswerChange: (questionId: number, optionId: string) => void;
  onFinishSection: () => void;
  onBackToDashboard: () => void;
  formattedCountdown: string;
}

const SECTIONS = [
  { id: 0, name: 'Leseverstehen', label: '1. Leseverstehen', shortDesc: 'Đọc hiểu (20 câu)', icon: BookOpen },
  { id: 1, name: 'Sprachbausteine', label: '2. Sprachbausteine', shortDesc: 'Ngữ pháp & Từ vựng (10 câu)', icon: Brain },
  { id: 2, name: 'Hörverstehen', label: '3. Hörverstehen', shortDesc: 'Nghe hiểu (10 câu + Audio)', icon: Headphones },
  { id: 3, name: 'Schriftlicher Ausdruck', label: '4. Schriftlicher Ausdruck', shortDesc: 'Viết bài thư B2 (1 bài)', icon: PenTool },
];

export const ExamRoomScreen: React.FC<ExamRoomScreenProps> = ({
  examState,
  onAnswerChange,
  onFinishSection,
  onBackToDashboard,
  formattedCountdown,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);

  // Section 4 Writing Essay State
  const [essayText, setEssayText] = useState<string>('');
  const [draftNote, setDraftNote] = useState<string>('');

  // Audio Player State for Section 3 (Hörverstehen)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Submit Modal State
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/v1/questions/${examState.examCode}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((q: any) => ({
            id: q.question_number || q.id,
            section: q.section || 'Leseverstehen',
            subSection: q.sub_section || '',
            title: q.title,
            contextText: q.context_text || '',
            options: q.options_json ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json) : [],
            correctOptionId: q.correct_option_id || 'A',
          }));
          setQuestions(mapped);
        }
      })
      .catch(() => {});
  }, [examState.examCode]);

  // Questions for current section
  const currentSectionMeta = SECTIONS[activeSectionIndex];
  const sectionQuestions = questions.filter((q) => {
    if (activeSectionIndex === 0) return !q.section || q.section.includes('Leseverstehen');
    if (activeSectionIndex === 1) return q.section.includes('Sprachbausteine');
    if (activeSectionIndex === 2) return q.section.includes('Hörverstehen');
    if (activeSectionIndex === 3) return q.section.includes('Schriftlicher') || q.section.includes('Ausdruck');
    return true;
  });

  // Ensure active question belongs to section or default
  useEffect(() => {
    if (sectionQuestions.length > 0 && !sectionQuestions.some((q) => q.id === activeQuestionId)) {
      setActiveQuestionId(sectionQuestions[0].id);
    }
  }, [activeSectionIndex, sectionQuestions]);

  const currentQuestion = questions.find((q) => q.id === activeQuestionId) || sectionQuestions[0] || questions[0];
  const answeredCount = Object.keys(examState.answers).length;

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  // Calculate Essay Word Count
  const essayWordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col font-sans">
      {/* 1. EXAM ROOM HEADER */}
      <header className="sticky top-0 z-40 bg-[#111827] text-white px-4 sm:px-6 py-3 border-b-4 border-[#2563EB]">
        <div className="w-full px-[10px] flex items-center justify-between gap-4">
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
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 bg-[#F97316] text-white rounded-xl font-black text-xs border border-white hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 uppercase font-heading brutal-shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Nộp Bài Thi
            </button>
          </div>
        </div>
      </header>

      {/* 2. SECTION STEPPER PROGRESS BAR (4 PHẦN THI) */}
      <div className="bg-white border-b-2 border-[#111827] px-4 py-3 sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
          {SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSectionIndex === idx;
            const isDone = activeSectionIndex > idx;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionIndex(idx)}
                className={`p-2.5 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs font-black'
                    : isDone
                    ? 'bg-[#eff6ff] text-[#1e40af] border-[#2563EB]'
                    : 'bg-[#f8fafc] text-[#4b5563] border-[#cbd5e1] hover:border-[#111827]'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black shrink-0 ${
                  isActive ? 'bg-white text-[#2563EB]' : 'bg-[#e2e8f0] text-[#1e293b]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left line-clamp-1">
                  <div className="font-heading font-black text-xs leading-tight">{sec.label}</div>
                  <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{sec.shortDesc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN EXAM CONTENT BY SECTION */}
      <main className="flex-1 w-full p-4 sm:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 4: SCHRIFTLICHER AUSDRUCK (VIẾT THƯ) */}
        {activeSectionIndex === 3 ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Header Banner */}
            <div className="p-5 bg-white border-[2.5px] border-[#111827] rounded-xl brutal-shadow space-y-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#ffe8d6] text-[#c2410c] text-xs font-black border border-[#111827]">
                PHẦN 4: SCHRIFTLICHER AUSDRUCK (VIẾT THƯ B2)
              </span>
              <h3 className="text-xl font-black text-[#111827] font-heading">
                Đề Bài Viết Thư Phàn Nàn / Đăng Ký (Beschwerde / Bewerbung)
              </h3>
              <p className="text-xs text-[#4b5563]">
                Yêu cầu: Viết một bức thư ngắn khoảng 150 - 200 từ giải quyết các yêu cầu trong đề bài bên dưới.
              </p>
            </div>

            {/* Prompt Box */}
            <div className="p-5 bg-[#fff8e7] border-[2.5px] border-[#111827] rounded-xl brutal-shadow text-xs sm:text-sm text-[#111827] leading-relaxed space-y-3">
              <h4 className="text-xs font-black uppercase text-[#92400e] flex items-center gap-1.5 font-heading">
                <FileText className="w-4 h-4" /> Đề Bài Chi Tiết (Aufgabenstellung):
              </h4>
              <div className="font-semibold space-y-2 text-[#334155]">
                <p>
                  Sie haben vor một tuần tham gia một khóa học tiếng Đức TELC B2 tại trung tâm nhưng gặp nhiều sự cố (giảng viên nghỉ, tài liệu phát chậm, phòng học nóng...).
                </p>
                <p className="font-bold text-[#111827]">Schreiben Sie eine Beschwerde an die Institutsleitung:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Grund für das Schreiben nennen</li>
                  <li>Die aufgetretenen Probleme genau beschreiben</li>
                  <li>Vorschlag zur Lösung oder Entschädigung fordern</li>
                </ul>
              </div>
            </div>

            {/* Writing Textarea */}
            <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-[#111827] font-heading">
                  Bài Làm Của Bạn (Gõ văn bản vào ô dưới):
                </h4>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded border-2 ${
                  essayWordCount >= 150 && essayWordCount <= 250
                    ? 'bg-[#dcfce7] text-[#166534] border-[#166534]'
                    : 'bg-[#f1f5f9] text-[#475569] border-[#94a3b8]'
                }`}>
                  Đã viết: {essayWordCount} / 150-200 từ
                </span>
              </div>

              <textarea
                rows={12}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Sehr geehrte Damen und Herren, hiermit möchte ich mich über den B2-Sprachkurs beschweren..."
                className="w-full p-4 bg-[#fcf9f8] border-2 border-[#111827] rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] leading-relaxed resize-y"
              />
            </div>
          </div>
        ) : (
          /* SECTION 1, 2, 3: MULTIPLE CHOICE QUESTIONS */
          <div className="lg:col-span-8 space-y-5">
            {/* Audio Player for Section 3 (Hörverstehen) */}
            {activeSectionIndex === 2 && (
              <div className="p-4 bg-[#eff6ff] border-[2.5px] border-[#111827] rounded-xl brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center border-2 border-[#111827] shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#111827] font-heading">
                      Audio Đề Thi Nghe (Hörtext TELC B2)
                    </h4>
                    <span className="text-[10px] font-bold text-[#1e40af]">
                      Bài nghe chuẩn TELC Deutsch B2 Audio Track
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAudio}
                    className="px-4 py-2 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black hover:bg-[#1d4ed8] cursor-pointer flex items-center gap-1.5 brutal-shadow-xs"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingAudio ? 'Tạm Dừng Audio' : 'Phát Bài Nghe'}</span>
                  </button>
                </div>
              </div>
            )}

            {!currentQuestion ? (
              <div className="p-8 bg-white border-[2.5px] border-[#111827] rounded-xl font-bold text-center text-sm">
                Không có câu hỏi nào thuộc phần thi này hoặc đang tải dữ liệu...
              </div>
            ) : (
              <>
                {/* Question Banner */}
                <div className="p-4 bg-white border-[2.5px] border-[#111827] rounded-xl brutal-shadow flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#e8f1ff] text-[#003882] text-xs font-black border border-[#111827]">
                      {currentQuestion.section} - {currentQuestion.subSection || 'Mô phỏng'}
                    </span>
                    <h3 className="text-lg font-black text-[#111827] mt-1 font-heading">
                      {currentQuestion.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#564145]">
                    Câu {activeQuestionId} / {questions.length}
                  </span>
                </div>

                {/* Context Text Box (Lesetext) */}
                {currentQuestion.contextText && (
                  <div className="p-5 bg-[#fff8e7] border-[2.5px] border-[#111827] rounded-xl brutal-shadow text-xs sm:text-sm text-[#111827] leading-relaxed space-y-2">
                    <h4 className="text-xs font-black uppercase text-[#734c00] font-heading">Đoạn Văn Bản Đề Thi (Lesetext):</h4>
                    <p className="font-medium whitespace-pre-line">{currentQuestion.contextText}</p>
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#4b5563] font-heading">Chọn phương án trả lời đúng:</h4>
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
              </>
            )}
          </div>
        )}

        {/* RIGHT 4 COLS: Question Navigator Grid & Scratchpad */}
        <div className="lg:col-span-4 space-y-5">
          {/* Question Grid Navigator */}
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#111827] font-heading">
                Tiến Độ Làm Bài ({answeredCount}/{questions.length})
              </h3>
              <span className="text-[10px] font-bold text-[#059669] bg-[#dcfce7] px-2 py-0.5 rounded border border-[#166534]">
                Đã xong {answeredCount}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q) => {
                const isAnswered = Boolean(examState.answers[q.id]);
                const isCurrent = q.id === activeQuestionId;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      // Switch to the section containing this question
                      if (q.section.includes('Sprachbausteine')) setActiveSectionIndex(1);
                      else if (q.section.includes('Hörverstehen')) setActiveSectionIndex(2);
                      else if (q.section.includes('Schriftlicher')) setActiveSectionIndex(3);
                      else setActiveSectionIndex(0);
                      setActiveQuestionId(q.id);
                    }}
                    className={`h-10 rounded-lg border-2 font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-[#2563EB] border-[#111827] bg-[#eff6ff] text-[#1e40af]'
                        : isAnswered
                        ? 'bg-[#059669] text-white border-[#111827]'
                        : 'bg-[#fcf9f8] text-[#111827] border-[#111827] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Draft Note Scratchpad */}
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-2">
            <h4 className="text-xs font-black uppercase text-[#111827] flex items-center gap-1.5 font-heading">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              Ghi Chú Nháp Nhanh (Scratchpad):
            </h4>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Ghi chú từ vựng, dàn ý bài viết Schriftlicher Ausdruck..."
              className="w-full h-32 p-3 bg-[#fcf9f8] border-2 border-[#111827] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
            />
          </div>
        </div>
      </main>

      {/* 4. FOOTER SECTION NAVIGATION CONTROLS */}
      <footer className="sticky bottom-0 z-30 bg-white border-t-2 border-[#111827] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            disabled={activeSectionIndex === 0}
            onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1.5 hover:bg-[#f8fafc]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Phần Thi Trước</span>
          </button>

          <div className="text-xs font-black text-[#111827] font-heading hidden sm:block">
            {currentSectionMeta.label}: {currentSectionMeta.shortDesc}
          </div>

          {activeSectionIndex < 3 ? (
            <button
              onClick={() => setActiveSectionIndex((prev) => Math.min(3, prev + 1))}
              className="px-5 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-1.5 font-heading uppercase"
            >
              <span>Chuyển Sang {SECTIONS[activeSectionIndex + 1]?.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 font-heading uppercase"
            >
              <Send className="w-4 h-4" />
              <span>HOÀN THÀNH & NỘP BÀI THI</span>
            </button>
          )}
        </div>
      </footer>

      {/* 5. CONFIRMATION SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#111827] rounded-2xl max-w-md w-full p-6 brutal-shadow-lg space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b-2 border-[#111827] pb-3">
              <h3 className="text-base font-black text-[#111827] font-heading flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F97316]" />
                Xác Nhận Nộp Bài Thi TELC B2
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-[#111827]" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium text-[#334155]">
              <p>Bạn có chắc chắn muốn kết thúc phiên làm bài thi thử và nộp bài?</p>
              <div className="p-3 bg-[#eff6ff] border-2 border-[#111827] rounded-xl space-y-1 text-xs font-bold text-[#1e40af]">
                <div>📌 Tổng số câu đã trả lời: <b>{answeredCount} / {questions.length} câu</b></div>
                <div>✍️ Bài viết Phần 4: <b>{essayText.trim() ? `Đã gõ ${essayWordCount} từ` : 'Chưa nhập bài viết'}</b></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Hủy - Tiếp Tục Làm Bài
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  onFinishSection();
                }}
                className="px-5 py-2 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer font-heading uppercase"
              >
                Xác Nhận Nộp Bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
