import React, { useState, useEffect, useRef } from 'react';
import { UserExamState, Question, ExamModel, VocabItem } from '../../types';
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
  Highlighter,
  Save,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface ExamRoomScreenProps {
  examState: UserExamState;
  selectedExam?: ExamModel | null;
  vocabs?: VocabItem[];
  onAnswerChange: (questionId: number, optionId: string) => void;
  onFinishSection: () => void;
  onBackToDashboard: () => void;
  formattedCountdown: string;
  isReviewMode?: boolean;
  onExitReviewMode?: () => void;
}

const SECTIONS = [
  { id: 0, name: 'Leseverstehen', label: '1. Leseverstehen', shortDesc: 'Đọc hiểu (20 câu)', icon: BookOpen },
  { id: 1, name: 'Sprachbausteine', label: '2. Sprachbausteine', shortDesc: 'Ngữ pháp & Từ vựng (10 câu)', icon: Brain },
  { id: 2, name: 'Hörverstehen', label: '3. Hörverstehen', shortDesc: 'Nghe hiểu (10 câu + Audio)', icon: Headphones },
  { id: 3, name: 'Schriftlicher Ausdruck', label: '4. Schriftlicher Ausdruck', shortDesc: 'Viết bài thư B2 (1 bài)', icon: PenTool },
];

export interface HighlightItem {
  id: string;
  text: string;
  colorId: string;
  translation?: string;
  isTranslating?: boolean;
}

const HIGHLIGHT_COLORS_LIST = [
  { id: 'yellow', bg: '#fef08a', border: '#eab308', text: '#713f12', label: 'Vàng' },
  { id: 'green', bg: '#bbf7d0', border: '#22c55e', text: '#14532d', label: 'Xanh lá' },
  { id: 'pink', bg: '#fbcfe8', border: '#ec4899', text: '#831843', label: 'Hồng' },
  { id: 'blue', bg: '#bfdbfe', border: '#3b82f6', text: '#1e3a8a', label: 'Xanh dương' },
];

const HIGHLIGHT_COLORS_MAP: Record<string, typeof HIGHLIGHT_COLORS_LIST[0]> = {
  yellow: HIGHLIGHT_COLORS_LIST[0],
  green: HIGHLIGHT_COLORS_LIST[1],
  pink: HIGHLIGHT_COLORS_LIST[2],
  blue: HIGHLIGHT_COLORS_LIST[3],
};

export const ExamRoomScreen: React.FC<ExamRoomScreenProps> = ({
  examState,
  selectedExam,
  vocabs = [],
  onAnswerChange,
  onFinishSection,
  onBackToDashboard,
  formattedCountdown,
  isReviewMode = false,
  onExitReviewMode,
}) => {
  const mapQuestionsFromExam = (exam: ExamModel | null | undefined): Question[] => {
    if (!exam || !Array.isArray(exam.questions) || exam.questions.length === 0) return [];
    return exam.questions.map((q: any, idx: number) => ({
      id: typeof q.id === 'number' ? q.id : (parseInt(String(q.id).replace(/\D/g, ''), 10) || idx + 1),
      section: q.section || 'Leseverstehen',
      subSection: q.subSection || q.sub_section || '',
      title: q.title || q.questionText || `Câu ${idx + 1}`,
      contextText: q.contextText || q.context_text || '',
      audioUrl: q.audioUrl || q.audio_url || '',
      options: q.options || (q.options_json ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json) : []),
      correctOptionId: q.correctOptionId || q.correct_option_id || 'A',
      explanation: q.explanation || '',
    }));
  };

  const [questions, setQuestions] = useState<Question[]>(() => mapQuestionsFromExam(selectedExam));

  useEffect(() => {
    if (selectedExam && Array.isArray(selectedExam.questions) && selectedExam.questions.length > 0) {
      setQuestions(mapQuestionsFromExam(selectedExam));
    }
  }, [selectedExam]);

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);

  // Notes & Highlighting State for DEUTSCHMITPN 2-column layout (Reset on page reload)
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('yellow');
  const [draftNote, setDraftNote] = useState<string>(() => {
    try {
      if (examState.examCode) {
        const saved = localStorage.getItem(`exam_autosave_${examState.examCode}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.draftNote === 'string') return parsed.draftNote;
        }
      }
    } catch {}
    return '';
  });

  // Audio Player State for Section 3 (Hörverstehen)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Submit Modal & Anti-cheat Lock Modal
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isLockedByAntiCheat, setIsLockedByAntiCheat] = useState<boolean>(false);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string>('Vừa xong');

  // Load Questions from API if available
  useEffect(() => {
    if (!examState.examCode) return;
    fetch('/api/v1/questions/' + encodeURIComponent(examState.examCode))
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((q: any, idx: number) => ({
            id: q.question_number || q.id || (idx + 1),
            section: q.section || 'Leseverstehen',
            subSection: q.sub_section || '',
            title: q.title,
            contextText: q.context_text || '',
            audioUrl: q.audio_url || '',
            options: q.options_json ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json) : [],
            correctOptionId: q.correct_option_id || 'A',
            explanation: q.explanation || '',
          }));
          setQuestions(mapped);
        }
      })
      .catch(() => {});
  }, [examState.examCode]);

  // Anti-cheat limit enforcement: Max 3 tab switches
  useEffect(() => {
    if (!isReviewMode && examState.tabSwitchCount >= 3 && !isLockedByAntiCheat) {
      setIsLockedByAntiCheat(true);
      setTimeout(() => {
        onFinishSection();
      }, 3500);
    }
  }, [examState.tabSwitchCount, isReviewMode, isLockedByAntiCheat]);

  // 2-Second Auto-save mechanism
  useEffect(() => {
    if (isReviewMode) return;
    const interval = setInterval(() => {
      try {
        const payload = {
          answers: examState.answers,
          draftNote,
          updatedAt: new Date().toLocaleTimeString('vi-VN'),
        };
        localStorage.setItem(`exam_autosave_${examState.examCode}`, JSON.stringify(payload));
        setLastAutoSavedTime(new Date().toLocaleTimeString('vi-VN'));
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, [examState.answers, examState.examCode, draftNote, isReviewMode]);

  // Color switch handler: sets active highlight color for next selections or applies to currently selected text
  const handleColorChange = (newColorId: string) => {
    setSelectedColor(newColorId);

    // If user has active text selection in DOM, apply new color to that specific text
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const selectedText = selection.toString().trim();
      if (selectedText.length >= 2) {
        setHighlights((prev) => {
          const existingIndex = prev.findIndex((h) => h.text.toLowerCase() === selectedText.toLowerCase());
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], colorId: newColorId };
            return updated;
          } else {
            return [
              ...prev,
              {
                id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                text: selectedText,
                colorId: newColorId,
              },
            ];
          }
        });
      }
    }
  };

  // Highlight Text Handler inside reading context
  const handleHighlightSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const selectedText = selection.toString().trim();
    if (selectedText.length >= 2) {
      setHighlights((prev) => {
        const existingIndex = prev.findIndex((h) => h.text.toLowerCase() === selectedText.toLowerCase());
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], colorId: selectedColor };
          return updated;
        } else {
          const newItem: HighlightItem = {
            id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            text: selectedText,
            colorId: selectedColor,
          };
          return [...prev, newItem];
        }
      });
    }
  };

  const speakGermanText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const translateGermanInline = async (highlightId: string, text: string) => {
    const target = highlights.find((h) => h.id === highlightId);
    if (target?.translation) {
      setHighlights((prev) =>
        prev.map((h) => (h.id === highlightId ? { ...h, translation: undefined } : h))
      );
      return;
    }

    setHighlights((prev) =>
      prev.map((h) => (h.id === highlightId ? { ...h, isTranslating: true } : h))
    );

    const cleanQuery = text.trim();
    const lower = cleanQuery.toLowerCase();

    // 1. Search in Real CSDL Vocabularies Database table (vocabs prop)
    if (Array.isArray(vocabs) && vocabs.length > 0) {
      const dbMatch = vocabs.find(
        (v) =>
          v.word.toLowerCase() === lower ||
          `${(v.article || '').toLowerCase()} ${v.word.toLowerCase()}`.trim() === lower
      );
      if (dbMatch && dbMatch.meaningVi) {
        setHighlights((prev) =>
          prev.map((h) =>
            h.id === highlightId ? { ...h, translation: dbMatch.meaningVi, isTranslating: false } : h
          )
        );
        return;
      }
    }

    // 2. Call live online translation API (MyMemory DE -> VI API)
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanQuery)}&langpair=de|vi`);
      const data = await res.json();
      const rawTrans = data?.responseData?.translatedText;
      if (rawTrans && !rawTrans.includes('MYMEMORY') && !rawTrans.includes('quota')) {
        setHighlights((prev) =>
          prev.map((h) => (h.id === highlightId ? { ...h, translation: rawTrans, isTranslating: false } : h))
        );
        return;
      }
    } catch {}

    // 3. Fallback format if API is unreachable
    setHighlights((prev) =>
      prev.map((h) =>
        h.id === highlightId ? { ...h, translation: `Dịch: "${cleanQuery}"`, isTranslating: false } : h
      )
    );
  };

  const updateSingleHighlightColor = (id: string, colorId: string) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, colorId } : h))
    );
  };

  const removeHighlight = (idOrText: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== idOrText && h.text !== idOrText));
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    if (!highlights || highlights.length === 0) {
      return text;
    }

    const sorted = [...highlights].sort((a, b) => b.text.length - a.text.length);
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${sorted.map((h) => escapeRegex(h.text)).join('|')})`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, index) => {
      const match = highlights.find((h) => h.text.toLowerCase() === part.toLowerCase());
      if (match) {
        const colorMeta = HIGHLIGHT_COLORS_MAP[match.colorId] || HIGHLIGHT_COLORS_MAP.yellow;
        return (
          <mark
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              speakGermanText(match.text);
              if (!match.translation) {
                translateGermanInline(match.id, match.text);
              }
              updateSingleHighlightColor(match.id, selectedColor);
            }}
            style={{
              backgroundColor: colorMeta.bg,
              borderColor: colorMeta.border,
              color: colorMeta.text,
            }}
            className="px-1 py-0.5 rounded border-2 font-bold mx-0.5 shadow-xs transition-all cursor-pointer hover:opacity-90 active:scale-95 inline-flex items-center gap-1"
            title={`🔊 Click phát âm | ${match.translation ? `Nghĩa: ${match.translation}` : 'Click dịch & phát âm'}`}
          >
            <span>{part}</span>
            {match.translation && (
              <span className="text-[10px] bg-white/90 text-[#111827] px-1 rounded font-black border border-black/20">
                ({match.translation})
              </span>
            )}
          </mark>
        );
      }
      return part;
    });
  };

  // Section names mapping
  const availableSectionNames = Array.from(new Set(questions.map((q) => q.section).filter(Boolean)));

  const activeSections = availableSectionNames.length > 0
    ? availableSectionNames.map((secName, idx) => {
        const matchingSec = SECTIONS.find((s) => s.name === secName || secName.toLowerCase().includes(s.name.toLowerCase()));
        const count = questions.filter((q) => q.section === secName).length;
        return {
          id: idx,
          name: secName,
          label: `${idx + 1}. ${secName}`,
          shortDesc: `${count} câu hỏi`,
          icon: matchingSec?.icon || (secName.toLowerCase().includes('hör') ? Headphones : secName.toLowerCase().includes('schrift') || secName.toLowerCase().includes('viết') ? PenTool : BookOpen),
        };
      })
    : SECTIONS;

  const currentSectionMeta = activeSections[activeSectionIndex] || activeSections[0] || SECTIONS[0];

  const sectionQuestions = questions.filter((q) => {
    if (activeSections.length > 0 && activeSections[activeSectionIndex]) {
      return q.section === activeSections[activeSectionIndex].name;
    }
    return true;
  });

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

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col font-sans">
      {/* 1. EXAM ROOM HEADER WITH ANTI-CHEAT & AUTO-SAVE BADGE */}
      <header className="sticky top-0 z-40 bg-[#111827] text-white px-4 sm:px-6 py-3 border-b-4 border-[#2563EB]">
        <div className="w-full px-[10px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={isReviewMode ? (onExitReviewMode || onBackToDashboard) : onBackToDashboard}
              className="p-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isReviewMode ? 'Quay lại' : 'Rời phòng thi'}</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-white text-[10px] font-black rounded uppercase ${isReviewMode ? 'bg-[#059669]' : 'bg-[#2563EB]'}`}>
                  {isReviewMode ? 'CHẾ ĐỘ XEM LẠI BÀI LÀM & GIẢI THÍCH CHI TIẾT 💡' : 'PHÒNG THI THỬ 2 CỘT chuẩn DEUTSCHMITPN'}
                </span>
                {!isReviewMode && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold rounded flex items-center gap-1">
                    <Save className="w-3 h-3 text-emerald-400 animate-pulse" />
                    Auto-save 2s: {lastAutoSavedTime}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-black font-heading text-white line-clamp-1 mt-0.5">
                {examState.examCode}: Đề Thi Mô Phỏng Tiêu Chuẩn Goethe & TELC
              </h2>
            </div>
          </div>

          {/* Countdown & Anti-cheat status */}
          <div className="flex items-center gap-3">
            {!isReviewMode && (
              <div className={`px-3 py-1 text-white border rounded-lg text-xs font-black flex items-center gap-1.5 ${
                examState.tabSwitchCount > 0 ? 'bg-[#dc2626] border-white/40 animate-bounce' : 'bg-slate-800 border-slate-700'
              }`}>
                <ShieldAlert className={`w-4 h-4 ${examState.tabSwitchCount > 0 ? 'text-[#fef08a]' : 'text-slate-400'}`} />
                <span>Vi phạm: {examState.tabSwitchCount}/3 lần</span>
              </div>
            )}

            {isReviewMode ? (
              <button
                onClick={onExitReviewMode || onBackToDashboard}
                className="px-4 py-2 bg-[#059669] text-white rounded-xl font-black text-xs border border-white hover:bg-[#047857] transition-all cursor-pointer flex items-center gap-1.5 font-heading uppercase brutal-shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                Thoát Xem Lại
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. SECTION STEPPER PROGRESS BAR */}
      <div className="bg-white border-b-2 border-[#111827] px-4 py-2.5 sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
          {activeSections.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSectionIndex === idx;
            const isDone = activeSectionIndex > idx;

            return (
              <button
                key={sec.id || idx}
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

      {/* 3. MAIN EXAM ROOM DEUTSCHMITPN 2-COLUMN SPLIT LAYOUT */}
      <main className="flex-1 w-full p-4 sm:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (6 COLS): READING TEXT / AUDIO / WRITING PROMPT + HIGHLIGHT & NOTES TOOL */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-4 flex flex-col h-full min-h-[500px]">
            {/* Header ToolBar */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#2563EB] text-white rounded-lg border border-[#111827]">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#111827] font-heading uppercase">
                    Cột Trái: Đề Bài & Văn Bản Gốc
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold block">
                    Highlight tô màu & Ghi chú từ vựng trực tiếp
                  </span>
                </div>
              </div>

              {/* Color Selector for Highlighter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300">
                <Highlighter className="w-3.5 h-3.5 text-slate-600 ml-1" />
                {HIGHLIGHT_COLORS_LIST.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleColorChange(c.id)}
                    style={{ backgroundColor: c.bg, borderColor: c.border }}
                    className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform flex items-center justify-center ${
                      selectedColor === c.id ? 'scale-125 ring-2 ring-[#111827]' : 'hover:scale-110 opacity-80'
                    }`}
                    title={`Chuyển màu ${c.label}`}
                  >
                    {selectedColor === c.id && <div className="w-1.5 h-1.5 rounded-full bg-[#111827]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Player for Listening Exams / Hörverstehen (Dynamic Media Detection) */}
            {Boolean(
              (currentQuestion?.audioUrl || sectionQuestions.find((q) => q.audioUrl)?.audioUrl || questions.find((q) => q.audioUrl)?.audioUrl) ||
              currentSectionMeta?.name?.toLowerCase().includes('hör') ||
              currentSectionMeta?.name?.toLowerCase().includes('nghe') ||
              activeSectionIndex === 2
            ) && (
              <div className="p-3.5 bg-[#eff6ff] border-2 border-[#111827] rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-[#2563EB]" />
                    <div>
                      <h4 className="text-xs font-black text-[#111827] font-heading uppercase">
                        File Âm Thanh Bài Nghe Goethe / TELC
                      </h4>
                      <span className="text-[10px] font-bold text-[#1e40af]">Bài nghe kiểm tra kỹ năng Hörverstehen</span>
                    </div>
                  </div>
                </div>

                {(currentQuestion?.audioUrl || sectionQuestions.find((q) => q.audioUrl)?.audioUrl || questions.find((q) => q.audioUrl)?.audioUrl) ? (
                  ((currentQuestion?.audioUrl || sectionQuestions.find((q) => q.audioUrl)?.audioUrl || questions.find((q) => q.audioUrl)?.audioUrl || '').includes('.mp4') ||
                   (currentQuestion?.audioUrl || sectionQuestions.find((q) => q.audioUrl)?.audioUrl || questions.find((q) => q.audioUrl)?.audioUrl || '').includes('.webm')) ? (
                    <video
                      controls
                      src={currentQuestion?.audioUrl || sectionQuestions.find((q) => q.audioUrl)?.audioUrl || questions.find((q) => q.audioUrl)?.audioUrl}
                      className="w-full max-h-52 rounded-lg border-2 border-[#111827]"
                    />
                  ) : (
                    <audio
                      controls
                      src={currentQuestion?.audioUrl || sectionQuestions.find((q) => q.audioUrl)?.audioUrl || questions.find((q) => q.audioUrl)?.audioUrl}
                      className="w-full h-10 rounded-lg border border-[#2563eb]/40"
                    />
                  )
                ) : (
                  <p className="text-[11px] font-bold text-amber-700 italic bg-amber-50 p-2 rounded-lg border border-amber-300">
                    💡 Phần thi nghe này chưa chọn file ghi âm MP3. Giáo viên có thể thêm file ghi âm khi sửa đề thi.
                  </p>
                )}
              </div>
            )}

            {/* Reading Context Text Content with Highlight Capability */}
            <div
              onMouseUp={handleHighlightSelection}
              className="flex-1 p-4 bg-[#fffdfa] border-2 border-slate-200 rounded-xl text-xs sm:text-sm text-[#111827] leading-relaxed space-y-3 overflow-y-auto max-h-[500px] select-text font-medium"
            >
              <div className="p-2 bg-[#fff8e7] border border-[#d97706]/30 rounded-lg text-[11px] font-bold text-[#b45309] flex items-center justify-between">
                <span>💡 Bôi đen văn bản bên dưới để dùng tool Tô Màu Highlight!</span>
                {highlights.length > 0 && (
                  <span className="text-[10px] bg-[#d97706] text-white px-1.5 py-0.5 rounded font-black">
                    {highlights.length} cụm từ
                  </span>
                )}
              </div>

              {sectionQuestions[0]?.contextText ? (
                <div className="whitespace-pre-line leading-relaxed">
                  {renderHighlightedText(sectionQuestions[0].contextText)}
                </div>
              ) : (
                <p className="text-slate-500 italic text-center py-8">
                  Đề bài phần thi này hiển thị theo từng câu hỏi ở cột bên phải.
                </p>
              )}
            </div>

            {/* Highlighted Words Chips */}
            {highlights.length > 0 && (
              <div className="p-3 bg-slate-50 border-2 border-[#111827] rounded-xl space-y-1.5">
                <span className="text-[11px] font-black text-[#111827] flex items-center gap-1 uppercase font-heading">
                  <Highlighter className="w-3.5 h-3.5 text-[#2563EB]" /> Các từ/cụm từ bạn đã Highlight ({highlights.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((h) => {
                    const colorMeta = HIGHLIGHT_COLORS_MAP[h.colorId] || HIGHLIGHT_COLORS_MAP.yellow;
                    return (
                      <span
                        key={h.id}
                        style={{
                          backgroundColor: colorMeta.bg,
                          borderColor: colorMeta.border,
                          color: colorMeta.text,
                        }}
                        className="px-2.5 py-1 rounded-lg border-2 text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => speakGermanText(h.text)}
                          className="hover:scale-125 cursor-pointer text-[#2563EB] font-black p-0.5 rounded hover:bg-black/10 transition-transform"
                          title="Phát âm tiếng Đức chuẩn (de-DE)"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span>"{h.text}"</span>
                        {h.isTranslating ? (
                          <span className="px-2 py-0.5 bg-white/90 text-blue-900 rounded border border-blue-300 text-[10px] font-bold animate-pulse">
                            ⏳ Đang dịch...
                          </span>
                        ) : h.translation ? (
                          <span className="px-2 py-0.5 bg-white/95 text-emerald-950 rounded border border-emerald-400 text-[11px] font-black shadow-2xs flex items-center gap-1">
                            👉 {h.translation}
                            <button
                              type="button"
                              onClick={() => translateGermanInline(h.id, h.text)}
                              className="text-slate-400 hover:text-slate-700 ml-1 text-[9px] font-bold"
                              title="Ẩn dịch"
                            >
                              ✕
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => translateGermanInline(h.id, h.text)}
                            className="px-1.5 py-0.5 bg-white/90 hover:bg-white rounded text-[10px] text-blue-900 font-black border border-blue-300 cursor-pointer ml-0.5 shadow-2xs transition-all hover:scale-105 active:scale-95"
                            title="Dịch nghĩa Tiếng Việt trực tiếp tại đây"
                          >
                            🌐 Dịch
                          </button>
                        )}
                        <div className="flex items-center gap-0.5 ml-1">
                          {HIGHLIGHT_COLORS_LIST.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => updateSingleHighlightColor(h.id, c.id)}
                              style={{ backgroundColor: c.bg, borderColor: c.border }}
                              className={`w-3 h-3 rounded-full border cursor-pointer transition-transform ${h.colorId === c.id ? 'scale-125 ring-1 ring-[#111827]' : 'opacity-60 hover:opacity-100'}`}
                              title={`Đổi sang màu ${c.label}`}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHighlight(h.id)}
                          className="hover:opacity-75 cursor-pointer font-black ml-1 text-red-600"
                          title="Xóa highlight"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Embedded Scratchpad Notes Box */}
            <div className="pt-2 border-t-2 border-slate-100 space-y-1.5">
              <label className="text-xs font-black text-[#111827] flex items-center gap-1 font-heading uppercase">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                Ghi Chú Nháp Nhanh (Ghi từ mới / Dàn ý):
              </label>
              <textarea
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="Ghi chú nhanh câu từ, ngữ pháp nháp tại đây..."
                rows={3}
                className="w-full p-3 bg-[#fcf9f8] border-2 border-[#111827] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (6 COLS): QUESTIONS LIST & QUICK JUMP QUESTION NAVIGATOR */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Question Grid Jump Navigator Header */}
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-4 brutal-shadow space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#111827] font-heading uppercase flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#2563EB]" />
                Danh Sách Câu Hỏi ({answeredCount}/{questions.length} Đã Làm)
              </h3>
              <span className="text-[10px] font-black text-[#059669] bg-[#dcfce7] px-2 py-0.5 rounded border border-[#166534]">
                {Math.round((answeredCount / (questions.length || 1)) * 100)}% Hoàn thành
              </span>
            </div>

            {/* Grid numbers */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
              {questions.map((q) => {
                const userAns = examState.answers[q.id];
                const isAnswered = Boolean(userAns);
                const isCorrect = userAns === (q.correctOptionId || 'A');
                const isCurrent = q.id === activeQuestionId;

                let gridStyle = 'bg-[#fcf9f8] text-[#111827] border-[#111827] hover:bg-[#e2e8f0]';
                if (isReviewMode) {
                  if (isAnswered && isCorrect) {
                    gridStyle = 'bg-[#059669] text-white border-[#111827] font-black';
                  } else if (isAnswered && !isCorrect) {
                    gridStyle = 'bg-[#dc2626] text-white border-[#111827] font-black';
                  } else {
                    gridStyle = 'bg-slate-200 text-slate-600 border-slate-400';
                  }
                } else if (isAnswered) {
                  gridStyle = 'bg-[#059669] text-white border-[#111827]';
                }

                if (isCurrent) {
                  gridStyle += ' ring-2 ring-[#2563EB] border-[#111827] scale-105';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      let targetSection = 0;
                      if (activeSections.length > 0) {
                        const secIdx = activeSections.findIndex((s) => s.name === q.section);
                        if (secIdx >= 0) targetSection = secIdx;
                        else if (q.section.includes('Sprachbausteine')) targetSection = 1;
                        else if (q.section.includes('Hörverstehen')) targetSection = 2;
                        else if (q.section.includes('Schriftlicher')) targetSection = 3;
                      }

                      setActiveSectionIndex(targetSection);
                      setActiveQuestionId(q.id);

                      setTimeout(() => {
                        const el = document.getElementById(`question-${q.id}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 100);
                    }}
                    className={`h-8 rounded-lg border-2 font-black text-xs transition-all cursor-pointer flex items-center justify-center ${gridStyle}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUESTIONS LIST */}
          {sectionQuestions.length === 0 ? (
            <div className="p-8 bg-white border-[2.5px] border-[#111827] rounded-xl font-bold text-center text-sm">
              Đang tải danh sách câu hỏi...
            </div>
          ) : (
            <div className="space-y-4">
              {sectionQuestions.map((q) => {
                const userChoice = examState.answers[q.id] || '';
                const isAnswered = Boolean(userChoice.trim());
                const isWritingQuestion = q.type === 'writing';

                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    className={`p-5 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4 transition-all scroll-mt-24 ${
                      q.id === activeQuestionId ? 'ring-2 ring-[#2563EB]' : ''
                    }`}
                  >
                    {/* Title */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-xs font-black">
                            Câu {q.id}
                          </span>
                          {q.subSection && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-300">
                              {q.subSection}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-[#111827] font-heading mt-1">
                          {q.title}
                        </h4>
                      </div>

                      {isAnswered && !isReviewMode && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded border border-emerald-300 shrink-0">
                          ✓ Đã chọn
                        </span>
                      )}
                    </div>

                    {/* WRITING QUESTION TYPE */}
                    {isWritingQuestion ? (
                      <div className="space-y-2">
                        <textarea
                          rows={12}
                          value={userChoice}
                          readOnly={isReviewMode}
                          onChange={(e) => !isReviewMode && onAnswerChange(q.id, e.target.value)}
                          placeholder="Nhập nội dung bài viết của bạn tại đây..."
                          className="w-full p-4 bg-[#fcf9f8] border-2 border-[#111827] rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    ) : (
                      /* MCQ OPTIONS */
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isSelected = userChoice === opt.id;
                          const correctChoice = q.correctOptionId || 'A';
                          const isCorrectOption = opt.id === correctChoice;

                          let buttonStyle = 'bg-white text-[#111827] border-[#111827] hover:bg-[#f8fafc]';
                          let badgeElement = null;

                          if (isReviewMode) {
                            if (isSelected && isCorrectOption) {
                              buttonStyle = 'bg-[#dcfce7] text-[#166534] border-[#166534] font-black brutal-shadow';
                              badgeElement = <span className="text-[10px] px-2 py-0.5 rounded bg-[#166534] text-white font-black">✓ ĐÚNG</span>;
                            } else if (isSelected && !isCorrectOption) {
                              buttonStyle = 'bg-[#fee2e2] text-[#991b1b] border-[#dc2626] font-black brutal-shadow';
                              badgeElement = <span className="text-[10px] px-2 py-0.5 rounded bg-[#dc2626] text-white font-black">✗ SAI</span>;
                            } else if (!isSelected && isCorrectOption) {
                              buttonStyle = 'bg-[#ecfdf5] text-[#047857] border-[#059669] font-bold';
                              badgeElement = <span className="text-[10px] px-2 py-0.5 rounded bg-[#059669] text-white font-black">✓ Đáp án đúng</span>;
                            } else {
                              buttonStyle = 'bg-[#f8fafc] text-slate-400 border-slate-200 opacity-60';
                            }
                          } else if (isSelected) {
                            buttonStyle = 'bg-[#2563EB] text-white border-[#111827] brutal-shadow font-black';
                            badgeElement = <CheckCircle2 className="w-4 h-4 text-white shrink-0" />;
                          }

                          return (
                            <button
                              key={opt.id}
                              disabled={isReviewMode}
                              onClick={() => !isReviewMode && onAnswerChange(q.id, opt.id)}
                              className={`w-full text-left p-3 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${
                                isReviewMode ? 'cursor-default' : 'cursor-pointer'
                              } ${buttonStyle}`}
                            >
                              <span>{opt.text}</span>
                              {badgeElement}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation in Review mode */}
                    {isReviewMode && (
                      <div className="mt-2 p-3 bg-[#eff6ff] border-2 border-[#2563EB] rounded-xl space-y-1">
                        <h5 className="text-[11px] font-black uppercase text-[#1e40af] flex items-center gap-1 font-heading">
                          <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                          💡 Giải Thích Đáp Án:
                        </h5>
                        <p className="text-xs text-[#1e293b] leading-relaxed font-medium">
                          {q.explanation || `Đáp án chính xác là (${q.correctOptionId || 'A'}).`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 4. FOOTER CONTROLS */}
      <footer className="sticky bottom-0 z-30 bg-white border-t-2 border-[#111827] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            disabled={activeSectionIndex === 0}
            onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1.5 hover:bg-[#f8fafc]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Phần Trước</span>
          </button>

          <div className="text-xs font-black text-[#111827] font-heading hidden sm:block">
            {currentSectionMeta.label}: {currentSectionMeta.shortDesc}
          </div>

          {activeSectionIndex < activeSections.length - 1 ? (
            <button
              onClick={() => setActiveSectionIndex((prev) => Math.min(activeSections.length - 1, prev + 1))}
              className="px-5 py-2 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-1.5 font-heading uppercase"
            >
              <span>Chuyển Sang {activeSections[activeSectionIndex + 1]?.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isReviewMode ? (
            <button
              onClick={onExitReviewMode || onBackToDashboard}
              className="px-6 py-2 bg-[#059669] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#047857] transition-all cursor-pointer flex items-center gap-1.5 font-heading uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Thoát Xem Lại</span>
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 font-heading uppercase"
            >
              <Send className="w-4 h-4" />
              <span>Nộp Bài Thi</span>
            </button>
          )}
        </div>
      </footer>

      {/* 5. SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#111827] rounded-2xl max-w-md w-full p-6 brutal-shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#111827] pb-3">
              <h3 className="text-base font-black text-[#111827] font-heading flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F97316]" />
                Xác Nhận Nộp Bài Thi
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-[#111827]" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium text-[#334155]">
              <p>Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?</p>
              <div className="p-3 bg-[#eff6ff] border-2 border-[#111827] rounded-xl space-y-1 text-xs font-bold text-[#1e40af]">
                <div>📌 Đã hoàn thành: <b>{answeredCount} / {questions.length} câu</b></div>
                <div>🟢 Đã tự động lưu bài làm mới nhất</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Tiếp tục làm
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  onFinishSection();
                }}
                className="px-5 py-2 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer font-heading uppercase"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. STRICT ANTI-CHEAT LOCK MODAL (ON 3 TAB SWITCHES) */}
      {isLockedByAntiCheat && (
        <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#dc2626] rounded-2xl max-w-md w-full p-6 brutal-shadow-lg text-center space-y-4 animate-bounce">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#dc2626] border-2 border-[#dc2626] flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#dc2626] font-heading">
              KHÓA BÀI THI THỬ DO VI PHẠM!
            </h3>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              Hệ thống ghi nhận bạn đã chuyển tab/cửa sổ thi <b>quá 3 lần</b> (Chống gian lận). 
              Bài thi đang được tự động khóa và nộp về hệ thống chấm điểm!
            </p>
            <div className="px-4 py-2 bg-red-100 text-red-900 rounded-xl font-black text-xs border border-red-300">
              Đang chuyển tới trang Kết quả...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
