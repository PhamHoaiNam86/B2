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
  Sparkles,
  Mic,
} from 'lucide-react';

interface ExamRoomScreenProps {
  examState: UserExamState;
  selectedExam?: ExamModel | null;
  vocabs?: VocabItem[];
  onAnswerChange: (questionId: number, optionId: string) => void;
  onFinishSection: (computedResult?: any) => void;
  onBackToDashboard: () => void;
  formattedCountdown: string;
  isReviewMode?: boolean;
  onExitReviewMode?: () => void;
}

const SECTIONS = [
  { id: 0, name: 'Leseverstehen', label: '1. Leseverstehen', shortDesc: 'Đọc hiểu (20 câu - 75 điểm)', icon: BookOpen },
  { id: 1, name: 'Sprachbausteine', label: '2. Sprachbausteine', shortDesc: 'Ngữ pháp & Từ vựng (20 câu - 30 điểm)', icon: Brain },
  { id: 2, name: 'Hörverstehen', label: '3. Hörverstehen', shortDesc: 'Nghe hiểu (Audio)', icon: Headphones },
  { id: 3, name: 'Schriftlicher Ausdruck', label: '4. Schriftlicher Ausdruck', shortDesc: 'Viết thư / luận (Schreiben)', icon: PenTool },
  { id: 4, name: 'Mündlicher Ausdruck', label: '5. Mündlicher Ausdruck', shortDesc: 'Phần thi Nói (Sprechen)', icon: Mic },
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
      type: q.type,
      title: q.title || q.questionText || `Câu ${idx + 1}`,
      contextText: q.contextText || q.context_text || '',
      audioUrl: q.audioUrl || q.audio_url || '',
      imageUrl: q.imageUrl || q.image_url || '',
      wordLimit: q.wordLimit || q.word_limit || 100,
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
  const [previewBannerUrl, setPreviewBannerUrl] = useState<string | null>(null);
  const [leftImageFailed, setLeftImageFailed] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  // Load Questions from API if available with fallback
  useEffect(() => {
    const code = examState.examCode || selectedExam?.examCode;
    const fetchUrl = code ? '/api/v1/questions/' + encodeURIComponent(code) : '/api/v1/questions';

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((q: any, idx: number) => ({
            id: q.question_number || q.id || (idx + 1),
            section: q.section || 'Leseverstehen',
            subSection: q.sub_section || '',
            type: q.type,
            title: q.title,
            contextText: q.context_text || '',
            audioUrl: q.audio_url || '',
            imageUrl: q.image_url || q.imageUrl || '',
            wordLimit: q.word_limit || q.wordLimit || 100,
            options: q.options_json ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json) : [],
            correctOptionId: q.correct_option_id || 'A',
            explanation: q.explanation || '',
          }));
          setQuestions(mapped);
        } else if (selectedExam && Array.isArray(selectedExam.questions) && selectedExam.questions.length > 0) {
          setQuestions(mapQuestionsFromExam(selectedExam));
        } else {
          // If empty, fallback to default questions
          fetch('/api/v1/questions')
            .then((r) => r.json())
            .then((r) => {
              if (r.success && Array.isArray(r.data) && r.data.length > 0) {
                const mapped = r.data.map((q: any, idx: number) => ({
                  id: q.question_number || q.id || (idx + 1),
                  section: q.section || 'Leseverstehen',
                  subSection: q.sub_section || '',
                  type: q.type,
                  title: q.title,
                  contextText: q.context_text || '',
                  audioUrl: q.audio_url || '',
                  imageUrl: q.image_url || q.imageUrl || '',
                  wordLimit: q.word_limit || q.wordLimit || 100,
                  options: q.options_json ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json) : [],
                  correctOptionId: q.correct_option_id || 'A',
                  explanation: q.explanation || '',
                }));
                setQuestions(mapped);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        if (selectedExam && Array.isArray(selectedExam.questions) && selectedExam.questions.length > 0) {
          setQuestions(mapQuestionsFromExam(selectedExam));
        }
      });
  }, [examState.examCode, selectedExam?.examCode]);

  const isOptionCorrectForQuestion = (q: Question, opt: any, optIndex: number): boolean => {
    if (Boolean(opt.isCorrect)) return true;

    const correctChoice = String(q.correctOptionId || q.correct_option_id || '').trim().toUpperCase();
    if (!correctChoice) return false;

    const optId = String(opt.id || '').trim().toUpperCase();
    if (optId && optId === correctChoice) return true;

    const letter = String.fromCharCode(65 + optIndex).toUpperCase();
    if (letter === correctChoice) return true;

    const optText = String(opt.text || '').trim().toUpperCase();
    if (optText.startsWith(`${correctChoice}:`) || optText.startsWith(`${correctChoice}.`)) {
      return true;
    }

    return false;
  };

  const isUserAnswerCorrect = (q: Question, userAns: any): boolean => {
    const isWritingOrSpeaking =
      q.type === 'writing' ||
      q.type === 'speaking' ||
      checkIsWritingQuestion(q) ||
      checkIsSpeakingQuestion(q);
    if (isWritingOrSpeaking) {
      return true;
    }

    if (!userAns) return false;

    const userStr = String(userAns).trim().toUpperCase();
    const optIdx = q.options.findIndex(
      (o: any) => String(o.id).trim().toUpperCase() === userStr || o.id === userAns
    );
    if (optIdx >= 0) {
      return isOptionCorrectForQuestion(q, q.options[optIdx], optIdx);
    }
    const correctChoice = String(q.correctOptionId || q.correct_option_id || '').trim().toUpperCase();
    return userStr === correctChoice;
  };

  const computeExamResults = () => {
    const userAnswers = examState.answers || {};
    const answeredCount = Object.keys(userAnswers).length;

    // Kiểm tra nếu đề thi là bài thi Viết (Schreiben) hoặc Nói (Sprechen)
    const isPureWritingOrSpeakingExam =
      questions.length > 0 &&
      questions.every((q) => checkIsWritingQuestion(q) || checkIsSpeakingQuestion(q));

    const isExplicitWritingOrSpeaking =
      (examState.examCode || selectedExam?.examCode || '').toUpperCase().includes('SCHREIBEN') ||
      (selectedExam?.name || '').toUpperCase().includes('SCHREIBEN') ||
      (selectedExam?.name || '').toUpperCase().includes('VIẾT') ||
      (examState.examCode || selectedExam?.examCode || '').toUpperCase().includes('SPRECHEN') ||
      (selectedExam?.name || '').toUpperCase().includes('SPRECHEN') ||
      (selectedExam?.name || '').toUpperCase().includes('NÓI');

    if (isPureWritingOrSpeakingExam || isExplicitWritingOrSpeaking) {
      return {
        score: 100,
        maxScore: 100,
        readingScore: 0,
        sprachScore: 100,
        listeningScore: 0,
        writingScore: 100,
        speakingScore: 100,
        statusText: 'Đã nộp bài thành công (Hoàn thành)',
        answeredCount,
        correctCount: questions.length,
      };
    }

    const isGoethe = (
      (examState.examCode || selectedExam?.examCode || '').toUpperCase().includes('GOETHE') ||
      (selectedExam?.provider || '').toUpperCase().includes('GOETHE') ||
      (selectedExam?.level || '').toUpperCase().includes('GOETHE') ||
      (selectedExam?.name || '').toUpperCase().includes('GOETHE')
    );

    if (isGoethe) {
      let correctCount = 0;
      questions.forEach((q) => {
        const userAns = userAnswers[q.id];
        if (isUserAnswerCorrect(q, userAns)) {
          correctCount += 1;
        }
      });

      const isListening = (
        (selectedExam?.name || '').toUpperCase().includes('HÖREN') ||
        (selectedExam?.name || '').toUpperCase().includes('HOREN') ||
        (selectedExam?.name || '').toUpperCase().includes('NGHE') ||
        (examState.examCode || '').toUpperCase().includes('HÖREN') ||
        (examState.examCode || '').toUpperCase().includes('HOREN') ||
        questions.some(q => (q.section || '').toUpperCase().includes('HÖREN') || Boolean(q.audioUrl))
      );

      const totalQ = questions.length > 0 ? questions.length : 40;
      const score = Math.round((correctCount / totalQ) * 100 * 10) / 10;
      const maxScore = 100;
      const isPassed = score >= 60;
      const moduleName = isListening ? 'Hören' : 'Lesen';
      const statusText = isPassed
        ? `Đạt chuẩn GOETHE ${moduleName} (Bestanden)`
        : `Chưa đạt GOETHE ${moduleName} (Nicht bestanden)`;

      return {
        score,
        maxScore,
        readingScore: isListening ? 0 : score,
        sprachScore: 0,
        listeningScore: isListening ? score : 0,
        writingScore: 0,
        speakingScore: 0,
        statusText,
        answeredCount,
        correctCount,
      };
    } else {
      // TELC: Thang điểm 105
      // 3 phần đầu (Teil 1, 2, 3 / Leseverstehen) 20 câu = 75 điểm (3.75 điểm/câu)
      // 2 phần sau (Teil 4, 5 / Sprachbausteine) 20 câu = 30 điểm (1.5 điểm/câu)
      // Tổng cộng 40 câu = 105 điểm
      let readingCorrect = 0;
      let readingTotal = 0;
      let sprachCorrect = 0;
      let sprachTotal = 0;
      let totalCorrect = 0;

      questions.forEach((q, idx) => {
        const userAns = userAnswers[q.id];
        const isCorrect = isUserAnswerCorrect(q, userAns);
        if (isCorrect) totalCorrect += 1;

        const sec = (q.section || '').toLowerCase();
        const sub = (q.subSection || '').toLowerCase();

        const isSprach = sec.includes('sprachbausteine') ||
                         sub.includes('sprachbausteine') ||
                         sub.includes('teil 4') ||
                         sub.includes('teil 5') ||
                         (questions.length >= 35 && idx >= 20);

        if (isSprach) {
          sprachTotal += 1;
          if (isCorrect) sprachCorrect += 1;
        } else {
          readingTotal += 1;
          if (isCorrect) readingCorrect += 1;
        }
      });

      if (sprachTotal === 0 && readingTotal > 20) {
        readingCorrect = 0;
        readingTotal = 20;
        sprachCorrect = 0;
        sprachTotal = questions.length - 20;

        questions.forEach((q, idx) => {
          const userAns = userAnswers[q.id];
          const isCorrect = isUserAnswerCorrect(q, userAns);
          if (idx < 20) {
            if (isCorrect) readingCorrect += 1;
          } else {
            if (isCorrect) sprachCorrect += 1;
          }
        });
      }

      let readingScore = 0;
      if (readingTotal > 0) {
        const ptsPerQ = readingTotal === 20 ? 3.75 : (75 / readingTotal);
        readingScore = Math.round(readingCorrect * ptsPerQ * 10) / 10;
      }

      let sprachScore = 0;
      if (sprachTotal > 0) {
        const ptsPerQ = sprachTotal === 20 ? 1.5 : (30 / sprachTotal);
        sprachScore = Math.round(sprachCorrect * ptsPerQ * 10) / 10;
      } else {
        readingScore = Math.round((readingCorrect / (readingTotal || 1)) * 105 * 10) / 10;
      }

      const score = Math.round((readingScore + sprachScore) * 10) / 10;
      const maxScore = 105;
      const isPassed = score >= 63;
      const statusText = isPassed ? 'Đạt chuẩn TELC (Bestanden)' : 'Chưa đạt TELC (Nicht bestanden)';

      return {
        score,
        maxScore,
        readingScore,
        sprachScore,
        listeningScore: 0,
        writingScore: 0,
        speakingScore: 0,
        statusText,
        answeredCount,
        correctCount: totalCorrect,
      };
    }
  };

  // Anti-cheat limit enforcement: Max 3 tab switches
  useEffect(() => {
    if (!isReviewMode && examState.tabSwitchCount >= 3 && !isLockedByAntiCheat) {
      setIsLockedByAntiCheat(true);
      setTimeout(() => {
        onFinishSection(computeExamResults());
      }, 3500);
    }
  }, [examState.tabSwitchCount, isReviewMode, isLockedByAntiCheat]);

  // Auto-submit when countdown timer reaches 0
  useEffect(() => {
    if (!isReviewMode && examState.timeRemainingSeconds <= 0 && examState.timeElapsedSeconds > 0) {
      onFinishSection(computeExamResults());
    }
  }, [examState.timeRemainingSeconds, examState.timeElapsedSeconds, isReviewMode]);

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
      const existing = highlights.find((h) => h.text.toLowerCase() === selectedText.toLowerCase());
      if (existing) {
        setHighlights((prev) =>
          prev.map((h) => (h.id === existing.id ? { ...h, colorId: selectedColor } : h))
        );
      } else {
        const newId = `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const newItem: HighlightItem = {
          id: newId,
          text: selectedText,
          colorId: selectedColor,
        };
        setHighlights((prev) => [...prev, newItem]);
        speakGermanText(selectedText);
        translateGermanInline(newId, selectedText);
      }
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

    // 2. Call backend translation API (/api/v1/translate)
    try {
      const res = await fetch(`/api/v1/translate?q=${encodeURIComponent(cleanQuery)}`);
      const data = await res.json();
      if (data.success && data.translation) {
        setHighlights((prev) =>
          prev.map((h) => (h.id === highlightId ? { ...h, translation: data.translation, isTranslating: false } : h))
        );
        return;
      }
    } catch (err) {}

    // 3. Fallback client-side call
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

    // 4. Fallback format if API is unreachable
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

  const handleQuickTranslateText = (textToTranslate: string) => {
    if (!textToTranslate || !textToTranslate.trim()) return;
    const cleanText = textToTranslate.trim();

    const existing = highlights.find((h) => h.text.toLowerCase() === cleanText.toLowerCase());

    if (existing) {
      // Đã có dịch/highlight -> Nhấn vào lần nữa là TẮT DỊCH và XÓA HIGHLIGHT
      removeHighlight(existing.id);
      return;
    }

    // Nhấn vào lần đầu -> Tạo mới, phát âm và dịch ngay
    const targetId = `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: HighlightItem = {
      id: targetId,
      text: cleanText,
      colorId: selectedColor,
    };
    setHighlights((prev) => [...prev, newItem]);
    speakGermanText(cleanText);
    translateGermanInline(targetId, cleanText);
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
            onMouseUp={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (match.translation) {
                // Nhấn vào lần nữa khi đã có dịch: Tắt dịch và xóa highlight ngay lập tức
                removeHighlight(match.id);
              } else {
                // Nhấn vào là dịch & phát âm
                speakGermanText(match.text);
                translateGermanInline(match.id, match.text);
                updateSingleHighlightColor(match.id, selectedColor);
              }
            }}
            style={{
              backgroundColor: colorMeta.bg,
              borderColor: colorMeta.border,
              color: colorMeta.text,
            }}
            className="px-1 py-0.5 rounded border-2 font-bold mx-0.5 shadow-xs transition-all cursor-pointer hover:opacity-90 active:scale-95 inline-flex items-center gap-1 group/mark"
            title={match.translation ? `🔊 "${match.text}": ${match.translation} (Nhấn vào để tắt dịch)` : `🔊 Nhấn vào để dịch & phát âm "${match.text}"`}
          >
            <span>{part}</span>
            {match.translation && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  removeHighlight(match.id);
                }}
                className="text-[10px] bg-white/95 text-[#111827] px-1.5 py-0.5 rounded font-black border border-black/20 hover:bg-rose-50 hover:text-rose-600 transition-colors inline-flex items-center gap-1 shadow-2xs"
                title="Nhấn vào để tắt dịch"
              >
                <span>({match.translation})</span>
                <span className="text-slate-400 group-hover/mark:text-rose-600 font-bold ml-0.5 text-[9px]">✕</span>
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

  const matchingExamSection = selectedExam?.sections?.find(
    (s: any) => s.name === currentSectionMeta?.name ||
      currentSectionMeta?.name?.toLowerCase().includes((s.name || '').toLowerCase()) ||
      (s.name || '').toLowerCase().includes((currentSectionMeta?.name || '').toLowerCase())
  );
  const activeSectionImageUrl = matchingExamSection?.imageUrl || (matchingExamSection as any)?.image_url || (matchingExamSection as any)?.bannerUrl || '';

  const checkIsWritingQuestion = (q: Question): boolean => {
    if (q.type === 'writing') return true;
    const secStr = (q.section || '').toLowerCase();
    const subStr = (q.subSection || '').toLowerCase();
    const titleStr = (q.title || '').toLowerCase();
    const secTitle = (matchingExamSection?.title || matchingExamSection?.name || '').toLowerCase();
    const secDesc = (matchingExamSection?.description || '').toLowerCase();
    const secText = (matchingExamSection?.text || '').toLowerCase();
    const ctxText = (q.contextText || '').toLowerCase();

    if (
      secStr.includes('schreiben') ||
      subStr.includes('schreiben') ||
      secStr.includes('viết') ||
      subStr.includes('viết') ||
      secTitle.includes('schreiben') ||
      secDesc.includes('schreiben') ||
      secTitle.includes('viết thư') ||
      secText.includes('schreiben - aufgabe') ||
      secText.includes('brief schreiben') ||
      ctxText.includes('schreiben - aufgabe') ||
      titleStr.includes('brief schreiben') ||
      titleStr.includes('den brief schreiben') ||
      titleStr.includes('schreiben sie') ||
      titleStr.includes('viết thư')
    ) {
      return true;
    }

    if (
      (titleStr.includes('brief') || secText.includes('brief') || titleStr.includes('schreiben') || secText.includes('schreiben')) &&
      Array.isArray(q.options) &&
      q.options.every((opt: any) => {
        const t = String(opt.text || '').toLowerCase();
        return t.includes('phương án') || t.includes('option') || t === 'a' || t === 'b' || t === 'c';
      })
    ) {
      return true;
    }

    return false;
  };

  const checkIsSpeakingQuestion = (q: Question): boolean => {
    if (q.type === 'speaking') return true;
    const secStr = (q.section || '').toLowerCase();
    const subStr = (q.subSection || '').toLowerCase();
    const titleStr = (q.title || '').toLowerCase();
    const secTitle = (matchingExamSection?.title || matchingExamSection?.name || '').toLowerCase();
    const secDesc = (matchingExamSection?.description || '').toLowerCase();
    const secText = (matchingExamSection?.text || '').toLowerCase();
    const ctxText = (q.contextText || '').toLowerCase();

    if (
      secStr.includes('sprechen') ||
      subStr.includes('sprechen') ||
      secStr.includes('mündlich') ||
      subStr.includes('mündlich') ||
      secStr.includes('nói') ||
      subStr.includes('nói') ||
      secTitle.includes('sprechen') ||
      secDesc.includes('sprechen') ||
      secTitle.includes('mündlicher ausdruck') ||
      secText.includes('sprechen - aufgabe') ||
      secText.includes('mündliche prüfung') ||
      ctxText.includes('sprechen - aufgabe') ||
      titleStr.includes('sprechen') ||
      titleStr.includes('mündlich') ||
      titleStr.includes('thuyết trình') ||
      titleStr.includes('vấn đáp')
    ) {
      return true;
    }

    if (
      (titleStr.includes('sprechen') || titleStr.includes('nói') || secText.includes('sprechen')) &&
      Array.isArray(q.options) &&
      q.options.every((opt: any) => {
        const t = String(opt.text || '').toLowerCase();
        return t.includes('phương án') || t.includes('option') || t === 'a' || t === 'b' || t === 'c';
      })
    ) {
      return true;
    }

    return false;
  };

  const insertUmlaut = (qId: number, char: string) => {
    const currentVal = examState.answers[qId] || '';
    const textarea = document.getElementById(`writing-paper-${qId}`) as HTMLTextAreaElement | null;
    if (textarea) {
      const start = textarea.selectionStart ?? currentVal.length;
      const end = textarea.selectionEnd ?? currentVal.length;
      const newVal = currentVal.substring(0, start) + char + currentVal.substring(end);
      onAnswerChange(qId, newVal);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + char.length, start + char.length);
      }, 10);
    } else {
      onAnswerChange(qId, currentVal + char);
    }
  };

  const insertLetterTemplate = (qId: number, type: 'informal' | 'formal') => {
    const today = new Date();
    const dateStr = `Berlin, den ${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    const informalTemplate = `${dateStr}\n\nLiebe(r) ..., \n\nvielen Dank für deinen Brief. Ich habe mich sehr darüber gefreut! \n\n...\n\nIch freue mich schon auf deine Antwort.\n\nHerzliche Grüße,\n[Tên của bạn]`;
    const formalTemplate = `${dateStr}\n\nSehr geehrte Damen und Herren,\n\nich schreibe Ihnen bezüglich...\n\n...\n\nIch bedanke mich im Voraus für Ihre Mühe.\n\nMit freundlichen Grüßen,\n[Họ và tên của bạn]`;

    const template = type === 'informal' ? informalTemplate : formalTemplate;
    onAnswerChange(qId, template);
  };

  const sectionQuestions = questions.filter((q) => {
    if (activeSections.length > 0 && activeSections[activeSectionIndex]) {
      const activeName = (activeSections[activeSectionIndex].name || '').toLowerCase().trim();
      const qSection = (q.section || '').toLowerCase().trim();
      if (!qSection) return true;
      return qSection === activeName || qSection.includes(activeName) || activeName.includes(qSection);
    }
    return true;
  });

  useEffect(() => {
    if (sectionQuestions.length > 0 && !sectionQuestions.some((q) => q.id === activeQuestionId)) {
      setActiveQuestionId(sectionQuestions[0].id);
    }
  }, [activeSectionIndex, sectionQuestions]);

  const currentQuestion = questions.find((q) => q.id === activeQuestionId) || sectionQuestions[0] || questions[0];
  const currentQuestionGlobalIdx = questions.findIndex((q) => q.id === activeQuestionId);
  const displayQuestionNum = currentQuestionGlobalIdx >= 0 ? currentQuestionGlobalIdx + 1 : (currentQuestion?.id || 1);
  const answeredCount = Object.keys(examState.answers).length;

  // Dynamic Context Text Resolution for Currently Active Question (Strictly scoped to current section)
  const getActiveContextText = (): string => {
    if (currentQuestion?.contextText?.trim()) {
      return currentQuestion.contextText.trim();
    }
    if (sectionQuestions.length > 0) {
      const qIdx = sectionQuestions.findIndex((q) => String(q.id) === String(currentQuestion?.id));
      if (qIdx > 0) {
        for (let i = qIdx - 1; i >= 0; i--) {
          if (sectionQuestions[i].contextText?.trim()) {
            return sectionQuestions[i].contextText!.trim();
          }
        }
      }
      const firstWithContext = sectionQuestions.find((q) => Boolean(q.contextText?.trim()));
      if (firstWithContext?.contextText?.trim()) {
        return firstWithContext.contextText.trim();
      }
    }
    return '';
  };

  // Dynamic Audio URL Resolution for Currently Active Question / Section (Strictly scoped to current section)
  const getActiveAudioUrl = (): string => {
    // 1. Check currently active question audio URL
    if (currentQuestion?.audioUrl?.trim()) {
      return currentQuestion.audioUrl.trim();
    }
    // 2. Search ONLY inside current sectionQuestions
    if (sectionQuestions.length > 0) {
      const qIdx = sectionQuestions.findIndex((q) => String(q.id) === String(currentQuestion?.id));
      if (qIdx > 0) {
        for (let i = qIdx - 1; i >= 0; i--) {
          if (sectionQuestions[i].audioUrl?.trim()) {
            return sectionQuestions[i].audioUrl!.trim();
          }
        }
      }
      const firstWithAudio = sectionQuestions.find((q) => Boolean(q.audioUrl?.trim()));
      if (firstWithAudio?.audioUrl?.trim()) {
        return firstWithAudio.audioUrl.trim();
      }
    }
    return '';
  };

  const activeAudioUrl = getActiveAudioUrl();

  // Extract all unique audio files in this section with their associated question info
  const sectionAudioList = (() => {
    const pool = sectionQuestions.length > 0 ? sectionQuestions : questions;
    const list: { questionNum: number; audioUrl: string; title: string }[] = [];
    const seenUrls = new Set<string>();

    pool.forEach((q, idx) => {
      const url = q.audioUrl?.trim();
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        list.push({
          questionNum: idx + 1,
          audioUrl: url,
          title: `Audio Câu ${idx + 1}`,
        });
      }
    });
    return list;
  })();

  const [selectedAudioIndex, setSelectedAudioIndex] = useState<number | null>(null);

  useEffect(() => {
    if (sectionAudioList.length > 1 && activeAudioUrl) {
      const audioIdx = sectionAudioList.findIndex((item) => item.audioUrl === activeAudioUrl);
      if (audioIdx >= 0) {
        setSelectedAudioIndex((prev) => (prev !== null ? prev : audioIdx));
      }
    } else {
      setSelectedAudioIndex(null);
    }
  }, [activeSectionIndex]);

  const currentAudioUrl = (selectedAudioIndex !== null && sectionAudioList[selectedAudioIndex])
    ? sectionAudioList[selectedAudioIndex].audioUrl
    : (activeAudioUrl || sectionAudioList[0]?.audioUrl || '');

  const isValidImageUrl = (url?: string): boolean => {
    if (!url || !url.trim()) return false;
    const clean = url.trim().toLowerCase();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:image/')) return true;
    if (clean.startsWith('/uploads/') || clean.startsWith('uploads/') || clean.startsWith('/images/') || clean.startsWith('images/') || clean.startsWith('/storage/') || clean.startsWith('storage/')) return true;
    const validExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.bmp', '.ico'];
    return validExts.some((ext) => clean.endsWith(ext));
  };

  const formatImageUrl = (url?: string): string => {
    if (!url || !url.trim()) return '';
    const clean = url.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
      return clean;
    }
    return clean.startsWith('/') ? clean : `/${clean}`;
  };

  // Dynamic Image URL Resolution for Currently Active Question / Section (Strictly scoped to current section)
  const getActiveImageUrl = (): string => {
    // 1. Check currently active question image URL
    if (isValidImageUrl(currentQuestion?.imageUrl)) {
      return formatImageUrl(currentQuestion.imageUrl);
    }
    // 2. Check section banner / reading image URL
    if (isValidImageUrl(activeSectionImageUrl)) {
      return formatImageUrl(activeSectionImageUrl);
    }
    // 3. Search ONLY inside current sectionQuestions
    if (sectionQuestions.length > 0) {
      const qIdx = sectionQuestions.findIndex((q) => String(q.id) === String(currentQuestion?.id));
      if (qIdx > 0) {
        for (let i = qIdx - 1; i >= 0; i--) {
          if (isValidImageUrl(sectionQuestions[i].imageUrl)) {
            return formatImageUrl(sectionQuestions[i].imageUrl!);
          }
        }
      }
      const firstWithImg = sectionQuestions.find((q) => isValidImageUrl(q.imageUrl));
      if (firstWithImg?.imageUrl) {
        return formatImageUrl(firstWithImg.imageUrl);
      }
    }
    return '';
  };

  const activeContextText = getActiveContextText();
  const activeImageUrl = getActiveImageUrl();
  const normalizePassageText = (str?: string): string => {
    if (!str) return '';
    return str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
  };

  // Extract all unique contextText passages in this section (normalized to merge duplicate whitespaces/newlines)
  const sectionPassages = (() => {
    const pool = sectionQuestions.length > 0 ? sectionQuestions : questions;
    const uniqueMap = new Map<string, string>();
    pool.forEach((q) => {
      const raw = q.contextText?.trim();
      if (raw) {
        const key = normalizePassageText(raw);
        if (key && !uniqueMap.has(key)) {
          uniqueMap.set(key, raw);
        }
      }
    });
    return Array.from(uniqueMap.values());
  })();

  const [selectedPassageIndex, setSelectedPassageIndex] = useState<number | null>(null);

  useEffect(() => {
    setLeftImageFailed(false);
    if (sectionPassages.length > 1 && activeContextText) {
      const activeKey = normalizePassageText(activeContextText);
      const passIdx = sectionPassages.findIndex((p) => normalizePassageText(p) === activeKey);
      if (passIdx >= 0) {
        setSelectedPassageIndex((prev) => (prev !== null ? prev : passIdx));
      }
    } else {
      setSelectedPassageIndex(null);
    }
  }, [activeSectionIndex]);

  const displayContextText = (selectedPassageIndex !== null && sectionPassages[selectedPassageIndex])
    ? sectionPassages[selectedPassageIndex]
    : activeContextText;

  // IntersectionObserver to auto-update activeQuestionId as student scrolls down right column
  const isUserClickingRef = useRef(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sectionQuestions.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserClickingRef.current) return;
        const visible = entries.find((e) => e.isIntersecting && e.intersectionRatio >= 0.2);
        if (visible) {
          const attr = visible.target.getAttribute('data-question-id');
          if (attr) {
            const parsed = parseInt(attr, 10);
            if (!isNaN(parsed) && parsed !== activeQuestionId) {
              setActiveQuestionId(parsed);
            }
          }
        }
      },
      { threshold: [0.2, 0.5] }
    );

    sectionQuestions.forEach((q) => {
      const el = document.getElementById(`question-${q.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeSectionIndex, sectionQuestions, activeQuestionId]);

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#fcf9f8] flex flex-col font-sans">
      {/* 1. EXAM ROOM HEADER WITH ANTI-CHEAT & AUTO-SAVE BADGE */}
      <header className="shrink-0 z-40 bg-[#111827] text-white px-4 sm:px-6 py-2.5 border-b-4 border-[#2563EB]">
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
                {examState.examCode || selectedExam?.examCode ? `${examState.examCode || selectedExam?.examCode}: ` : ''}{selectedExam?.name || 'Đề Thi Mô Phỏng Tiêu Chuẩn Goethe & TELC'}
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
      <div className="shrink-0 z-30 bg-white border-b-2 border-[#111827] px-4 py-2 shadow-xs">
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
      <main className="flex-1 min-h-0 w-full p-3 sm:p-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:overflow-hidden">
        
        {/* LEFT COLUMN (6 COLS): READING TEXT / AUDIO / WRITING PROMPT + HIGHLIGHT & NOTES TOOL (INDEPENDENT SCROLL) */}
        <div className="lg:col-span-6 lg:h-full lg:min-h-0 lg:overflow-y-auto pr-1.5 space-y-4">
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow space-y-4 flex flex-col">
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

            {/* DYNAMIC IMAGE IN LEFT COLUMN (SECTION BANNER OR QUESTION ATTACHED IMAGE) */}
            {Boolean(activeImageUrl) && !leftImageFailed && (
              <div className="relative rounded-xl overflow-hidden border-2 border-[#111827] bg-[#111827] group shrink-0 shadow-xs my-1">
                <img
                  src={activeImageUrl}
                  alt={`Hình ảnh bài đọc / đề thi câu ${displayQuestionNum}`}
                  className="w-full max-h-80 object-contain mx-auto bg-slate-900 transition-transform duration-300 group-hover:scale-102 cursor-pointer p-1"
                  onClick={() => setPreviewBannerUrl(activeImageUrl)}
                  onError={() => setLeftImageFailed(true)}
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 text-white flex items-center justify-between">
                  <span className="text-[10px] font-black font-heading uppercase tracking-wide flex items-center gap-1">
                    🖼️ Hình Ảnh Đề Bài / Ngữ Cảnh (Câu #{displayQuestionNum})
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewBannerUrl(activeImageUrl)}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/40 text-white rounded-lg text-[10px] font-black border border-white/50 cursor-pointer backdrop-blur-sm transition-all"
                  >
                    🔍 Phóng To Ảnh
                  </button>
                </div>
              </div>
            )}

            {/* Audio Player for Listening Exams / Hörverstehen (Dynamic Media Detection) */}
            {Boolean(
              currentAudioUrl ||
              sectionAudioList.length > 0 ||
              currentSectionMeta?.name?.toLowerCase().includes('hör') ||
              currentSectionMeta?.name?.toLowerCase().includes('nghe') ||
              activeSectionIndex === 2
            ) && (
              <div className="p-3.5 bg-[#eff6ff] border-2 border-[#111827] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-[#2563EB]" />
                    <div>
                      <h4 className="text-xs font-black text-[#111827] font-heading uppercase">
                        File Âm Thanh Bài Nghe Goethe / TELC {sectionAudioList.length > 1 ? `(Tùy chọn ${sectionAudioList.length} Audio)` : '(Dùng Chung Cho Các Câu Hỏi)'}
                      </h4>
                      <span className="text-[10px] font-bold text-[#1e40af]">Bài nghe kiểm tra kỹ năng Hörverstehen</span>
                    </div>
                  </div>

                  {sectionAudioList.length > 1 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {sectionAudioList.map((item, idx) => {
                        const isSel = (selectedAudioIndex !== null ? selectedAudioIndex : 0) === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedAudioIndex(idx)}
                            className={`px-2 py-1 rounded-md text-[10px] font-black cursor-pointer border transition-all ${
                              isSel
                                ? 'bg-[#2563eb] text-white border-[#111827] shadow-xs'
                                : 'bg-white text-slate-800 border-slate-300 hover:bg-blue-50'
                            }`}
                          >
                            🔊 {item.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {currentAudioUrl ? (
                  (currentAudioUrl.includes('.mp4') || currentAudioUrl.includes('.webm')) ? (
                    <video
                      controls
                      src={currentAudioUrl}
                      className="w-full max-h-52 rounded-lg border-2 border-[#111827]"
                    />
                  ) : (
                    <audio
                      controls
                      src={currentAudioUrl}
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
              className="p-4 bg-[#fffdfa] border-2 border-slate-200 rounded-xl text-sm sm:text-base text-[#111827] leading-relaxed space-y-4 select-text font-medium"
            >
              <div className="p-2 bg-[#fff8e7] border border-[#d97706]/30 rounded-lg text-[11px] font-bold text-[#b45309] flex items-center justify-between">
                <span>💡 Bôi đen (hoặc nhấp đúp) từ để Dịch & Highlight. Nhấn vào từ đã dịch một lần nữa để Tắt dịch!</span>
                {highlights.length > 0 && (
                  <span className="text-[10px] bg-[#d97706] text-white px-1.5 py-0.5 rounded font-black">
                    {highlights.length} cụm từ
                  </span>
                )}
              </div>

              {/* Dynamic Prominent Passage Notice / Annotation Callout Box */}
              <div className="p-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-2 border-[#111827] rounded-xl shadow-xs space-y-2 my-1">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5 font-black font-heading text-xs uppercase tracking-wide">
                    <span className="p-1 bg-white/20 rounded-md backdrop-blur-xs text-xs">📌</span>
                    <span>CHÚ THÍCH & HƯỚNG DẪN BÀI ĐỌC</span>
                  </div>
                  {sectionPassages.length > 1 && (
                    <span className="px-2.5 py-0.5 bg-yellow-300 text-slate-900 text-[11px] font-black rounded-full border border-yellow-400 shadow-xs uppercase tracking-wider">
                      Đang xem: Bài Đọc {(selectedPassageIndex !== null ? selectedPassageIndex : Math.max(0, sectionPassages.indexOf(activeContextText))) + 1} / {sectionPassages.length}
                    </span>
                  )}
                </div>

                {/* Custom Admin Note (if provided by Admin in form) */}
                {Boolean(currentQuestion?.subSection?.trim()) && (
                  <div className="p-2.5 bg-yellow-300 text-slate-900 border-2 border-[#111827] rounded-lg text-xs font-black shadow-xs leading-relaxed">
                    <span className="uppercase text-[10px] tracking-wider block text-amber-900 font-extrabold mb-0.5">
                      ✍️ Ghi chú từ giáo viên:
                    </span>
                    {currentQuestion.subSection}
                  </div>
                )}

                <p className="text-xs sm:text-sm font-semibold leading-relaxed text-amber-50">
                  {sectionPassages.length > 1 ? (
                    <>
                      <strong>Mẹo làm bài:</strong> Phần thi này bao gồm <mark className="bg-yellow-300 text-slate-900 font-extrabold px-1.5 py-0.5 rounded mx-1 shadow-xs">
                        {sectionPassages.length} bài đọc khác nhau
                      </mark>. Học viên vui lòng bấm các nút tab <strong className="text-white underline decoration-2 underline-offset-2 font-black">[Bài Đọc 1]</strong>, <strong className="text-white underline decoration-2 underline-offset-2 font-black">[Bài Đọc 2]</strong>... bên dưới để chuyển văn bản tương ứng với từng câu hỏi bên phải!
                    </>
                  ) : (
                    <>
                      <strong>Hướng dẫn:</strong> Đọc kỹ văn bản bên dưới để đối chiếu thông tin với các câu hỏi ở cột bên phải. Bôi đen (hoặc nhấp đúp) từ để <mark className="bg-yellow-300 text-slate-900 font-extrabold px-1.5 py-0.5 rounded mx-1 shadow-xs">Dịch ngay</mark>, nhấn vào từ một lần nữa để tắt dịch!
                    </>
                  )}
                </p>
              </div>

              {/* Passage Tabs when section has multiple distinct reading texts */}
              {sectionPassages.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-slate-200">
                  <span className="text-[10px] font-black text-slate-500 uppercase shrink-0">Các bài đọc:</span>
                  {sectionPassages.map((pText, pIdx) => {
                    const activeKey = normalizePassageText(activeContextText);
                    const passageKey = normalizePassageText(pText);
                    const isSelected = (selectedPassageIndex === pIdx || (selectedPassageIndex === null && passageKey === activeKey));
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setSelectedPassageIndex(pIdx)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-all shrink-0 ${
                          isSelected
                            ? 'bg-[#2563EB] text-white border-[#111827] font-black shadow-xs'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        Bài Đọc {pIdx + 1}
                      </button>
                    );
                  })}
                </div>
              )}

              {displayContextText ? (
                <div className="whitespace-pre-line leading-relaxed">
                  {renderHighlightedText(displayContextText)}
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
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#111827] flex items-center gap-1 uppercase font-heading">
                    <Highlighter className="w-3.5 h-3.5 text-[#2563EB]" /> Các từ/cụm từ bạn đã Highlight ({highlights.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setHighlights([])}
                    className="text-[10px] text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer"
                    title="Xóa tất cả highlight"
                  >
                    Xóa tất cả
                  </button>
                </div>
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
                              onClick={() => removeHighlight(h.id)}
                              className="text-slate-400 hover:text-slate-700 ml-1 text-[9px] font-bold cursor-pointer"
                              title="Tắt dịch & xóa highlight"
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

        {/* RIGHT COLUMN (6 COLS): QUESTIONS LIST & QUICK JUMP QUESTION NAVIGATOR (INDEPENDENT SCROLL) */}
        <div className="lg:col-span-6 lg:h-full lg:min-h-0 lg:overflow-y-auto pr-1.5 space-y-4">
          
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
              {questions.map((q, qIndex) => {
                const userAns = examState.answers[q.id];
                const isAnswered = Boolean(userAns);
                const isCorrect = isUserAnswerCorrect(q, userAns);
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
                      let targetSection = activeSectionIndex;
                      if (activeSections.length > 0) {
                        const secIdx = activeSections.findIndex((s) => s.name.trim().toLowerCase() === q.section.trim().toLowerCase());
                        if (secIdx >= 0) {
                          targetSection = secIdx;
                        } else {
                          const partialIdx = activeSections.findIndex((s) =>
                            s.name.toLowerCase().includes(q.section.toLowerCase()) || q.section.toLowerCase().includes(s.name.toLowerCase())
                          );
                          if (partialIdx >= 0) targetSection = partialIdx;
                        }
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
                    {qIndex + 1}
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
                const isWritingQuestion = checkIsWritingQuestion(q);
                const isSpeakingQuestion = checkIsSpeakingQuestion(q);
                const globalIdx = questions.findIndex((item) => item.id === q.id);
                const displayQuestionNum = globalIdx >= 0 ? globalIdx + 1 : q.id;

                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    data-question-id={q.id}
                    onMouseUp={handleHighlightSelection}
                    onClick={() => {
                      if (activeQuestionId !== q.id) {
                        isUserClickingRef.current = true;
                        setActiveQuestionId(q.id);
                        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
                        scrollTimerRef.current = setTimeout(() => {
                          isUserClickingRef.current = false;
                        }, 700);
                      }
                    }}
                    className={`p-5 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4 transition-all scroll-mt-4 cursor-pointer hover:border-[#2563EB] ${
                      q.id === activeQuestionId ? 'ring-2 ring-[#2563EB] border-[#2563EB]' : ''
                    }`}
                  >
                    {/* Title */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5 flex-wrap">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-xs font-black">
                            Câu {displayQuestionNum}
                          </span>
                          {q.subSection && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-300">
                              {q.subSection}
                            </span>
                          )}
                          {(() => {
                            const isQuestionTranslated = highlights.some(
                              (h) => h.text.toLowerCase() === q.title.trim().toLowerCase()
                            );
                            return (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickTranslateText(q.title);
                                }}
                                className={`px-2 py-0.5 rounded border text-[10px] font-black cursor-pointer transition-all flex items-center gap-1 shadow-2xs ${
                                  isQuestionTranslated
                                    ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-300'
                                }`}
                                title={isQuestionTranslated ? 'Nhấn để tắt dịch câu hỏi' : 'Tra từ & dịch Tiếng Việt toàn bộ câu hỏi này'}
                              >
                                <span>{isQuestionTranslated ? '✕ Tắt Dịch Câu Hỏi' : '🌐 Dịch & Phát Âm Câu Hỏi'}</span>
                              </button>
                            );
                          })()}
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-[#111827] font-heading mt-1 leading-relaxed">
                          {renderHighlightedText(q.title)}
                        </h4>
                      </div>

                      {isAnswered && !isReviewMode && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded border border-emerald-300 shrink-0">
                          ✓ Đã chọn
                        </span>
                      )}
                    </div>

                    {/* QUESTION ATTACHED IMAGE (Supports Only Image, or Image + Text) */}
                    {Boolean(isValidImageUrl(q.imageUrl)) && (
                      <div className="relative rounded-xl overflow-hidden border-2 border-[#111827] bg-[#111827] my-3 group shrink-0">
                        <img
                          src={formatImageUrl(q.imageUrl)}
                          alt={`Hình ảnh câu hỏi ${displayQuestionNum}`}
                          className="w-full max-h-72 object-contain mx-auto bg-slate-900 transition-transform duration-300 group-hover:scale-102 cursor-pointer p-1"
                          onClick={() => setPreviewBannerUrl(formatImageUrl(q.imageUrl))}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 text-white flex items-center justify-between">
                          <span className="text-[10px] font-black font-heading uppercase tracking-wide flex items-center gap-1">
                            🖼️ Hình Ảnh Câu Hỏi #{displayQuestionNum}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewBannerUrl(formatImageUrl(q.imageUrl))}
                            className="px-2 py-0.5 bg-white/20 hover:bg-white/40 text-white rounded text-[10px] font-black border border-white/40 cursor-pointer backdrop-blur-sm"
                          >
                            🔍 Phóng To
                          </button>
                        </div>
                      </div>
                    )}

                    {/* WRITING QUESTION TYPE: TỜ GIẤY THI VIẾT THƯ (SCHREIBBOGEN) */}
                    {isWritingQuestion ? (
                      (() => {
                        const wordCount = (userChoice || '').trim().split(/\s+/).filter(Boolean).length;
                        const charCount = (userChoice || '').length;
                        const lineCount = (userChoice || '').split('\n').length;
                        const minWords = q.wordLimit || 100;
                        const isWordCountMet = wordCount >= minWords;

                        return (
                          <div className="space-y-3.5">
                            {/* Thanh công cụ hỗ trợ viết bài thi */}
                            <div className="bg-[#fefce8] border-2 border-[#111827] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-black shadow-xs">
                                  <PenTool className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-[#111827] font-heading uppercase text-xs">
                                      TỜ GIẤY THI VIẾT THƯ (SCHREIBBOGEN)
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#2563EB] text-white font-bold">
                                      Chuẩn Quốc Tế
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-600 font-medium">
                                    Soạn thảo bài viết vào các dòng kẻ bên dưới. Bài làm tự động lưu liên tục.
                                  </span>
                                </div>
                              </div>

                              {/* Bàn phím ký tự tiếng Đức đặc biệt (German Umlauts) */}
                              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#111827]">
                                <span className="text-[10px] font-bold text-slate-500 px-1">Ký tự Đức:</span>
                                {['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'].map((char) => (
                                  <button
                                    key={char}
                                    type="button"
                                    disabled={isReviewMode}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      insertUmlaut(q.id, char);
                                    }}
                                    className="w-6 h-6 bg-slate-100 hover:bg-[#2563EB] hover:text-white rounded text-xs font-black transition-colors border border-slate-300 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                    title={`Chèn ký tự ${char}`}
                                  >
                                    {char}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* TỜ GIẤY THI KẺ DÒNG (RULED / LINED EXAM PAPER) */}
                            <div className="relative bg-white border-[2.5px] border-[#111827] rounded-2xl shadow-md overflow-hidden">
                              {/* Đầu trang giấy thi */}
                              <div className="bg-[#f8fafc] border-b-2 border-[#111827] px-4 py-2 flex items-center justify-between text-[11px] font-bold text-slate-700">
                                <div className="flex items-center gap-3">
                                  <span>Thí sinh: <b className="text-[#111827]">{examState.studentName || 'Học viên'}</b></span>
                                  <span className="text-slate-300">|</span>
                                  <span>Bài thi: <b className="text-[#2563EB]">{examState.examCode}</b></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-700 font-black">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>Tự động lưu bài 2s</span>
                                </div>
                              </div>

                              {/* Vùng viết kẻ dòng có lề đỏ (Margin Line & Ruled Lines) */}
                              <div className="relative p-3 sm:p-5 bg-[#fffdfa] min-h-[360px]">
                                {/* Đường kẻ lề đỏ bên trái (Red Margin Line) */}
                                <div className="absolute top-0 bottom-0 left-10 sm:left-12 border-r-2 border-red-300 pointer-events-none z-10" />

                                <textarea
                                  id={`writing-paper-${q.id}`}
                                  rows={14}
                                  value={userChoice}
                                  readOnly={isReviewMode}
                                  onChange={(e) => !isReviewMode && onAnswerChange(q.id, e.target.value)}
                                  placeholder={`Berlin, den ...\n\nLiebe(r) ...,\n\nvielen Dank für deinen Brief...\n\n(Soạn thảo toàn bộ nội dung bức thư của bạn tại đây theo các dòng kẻ. Đảm bảo đầy đủ Anrede, Einleitung, Hauptteil, Schluss và Grußformel)...`}
                                  className="w-full pl-8 sm:pl-10 pr-2 py-1 text-xs sm:text-sm font-serif leading-[32px] text-[#0f172a] bg-transparent focus:outline-none resize-y relative z-0 selection:bg-blue-200"
                                  style={{
                                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)',
                                    backgroundAttachment: 'local',
                                    lineHeight: '32px',
                                  }}
                                />
                              </div>

                              {/* Chân trang giấy thi: Thống kê số từ & Tiêu chuẩn */}
                              <div className="bg-[#f8fafc] border-t-2 border-[#111827] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                                <div className="flex items-center gap-3">
                                  {/* Đếm số từ */}
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                                    <span>Độ dài:</span>
                                    <span className={`px-2 py-0.5 rounded-md font-black ${
                                      isWordCountMet
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                                        : wordCount >= 50
                                        ? 'bg-blue-100 text-blue-800 border border-blue-400'
                                        : 'bg-amber-100 text-amber-900 border border-amber-400'
                                    }`}>
                                      {wordCount} từ
                                    </span>
                                    <span className="text-slate-500 text-[11px]">
                                      (Yêu cầu: tối thiểu {minWords} từ)
                                    </span>
                                  </div>

                                  <span className="text-slate-400 text-[11px] hidden sm:inline">
                                    • {charCount} ký tự • {lineCount} dòng
                                  </span>
                                </div>

                                {/* Nút chèn dàn ý gợi ý */}
                                {!isReviewMode && (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => insertLetterTemplate(q.id, 'informal')}
                                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-[#111827] text-[10px] font-bold cursor-pointer transition-all shadow-2xs"
                                      title="Chèn khung thư thân mật (Liebe / Lieber...)"
                                    >
                                      ✉️ Mẫu Thân Mật
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertLetterTemplate(q.id, 'formal')}
                                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-[#111827] text-[10px] font-bold cursor-pointer transition-all shadow-2xs"
                                      title="Chèn khung thư trang trọng (Sehr geehrte...)"
                                    >
                                      📋 Mẫu Trang Trọng
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Hướng dẫn bố cục chuẩn 5 phần bức thư tiếng Đức */}
                            <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-xs space-y-1.5">
                              <div className="font-black text-[#1e40af] flex items-center gap-1.5 font-heading uppercase text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Bố Cục Chuẩn Bài Thi Viết Thư (Brief-Struktur):</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
                                <div className="p-2 bg-white rounded border border-blue-200">
                                  <b className="text-[#111827] block">1. Đầu thư:</b>
                                  <span>• Datum & Ort (góc phải)</span><br />
                                  <span>• Anrede thích hợp (Liebe(r)...)</span>
                                </div>
                                <div className="p-2 bg-white rounded border border-blue-200">
                                  <b className="text-[#111827] block">2. Thân bài (Hauptteil):</b>
                                  <span>• Viết thường chữ đầu sau dấu phẩy</span><br />
                                  <span>• Trả lời đủ các ý Leitpunkte</span>
                                </div>
                                <div className="p-2 bg-white rounded border border-blue-200">
                                  <b className="text-[#111827] block">3. Kết thư:</b>
                                  <span>• Lời kết (Ich freue mich...)</span><br />
                                  <span>• Grußformel & Ký tên</span>
                                </div>
                              </div>
                            </div>

                            {/* Nút bấm xem bài viết mẫu & đáp án */}
                            {Boolean(q.explanation && q.explanation.trim()) && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => setRevealedAnswers((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-500 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-2 shadow-2xs font-heading"
                                >
                                  <Sparkles className="w-4 h-4 text-emerald-600" />
                                  <span>{revealedAnswers[q.id] ? '▲ Ẩn Bài Viết Mẫu' : '💡 Xem Bài Viết Mẫu & Đáp Án (Musterbrief)'}</span>
                                </button>

                                {(revealedAnswers[q.id] || isReviewMode) && (
                                  <div className="mt-2.5 p-4 bg-[#f0fdf4] border-2 border-emerald-500 rounded-xl space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-emerald-800 font-black font-heading text-xs uppercase">
                                      <Sparkles className="w-4 h-4 text-emerald-600" />
                                      <span>Bài Viết Thư Mẫu Chuẩn (Musterbrief):</span>
                                    </div>
                                    <div className="whitespace-pre-line font-mono text-slate-800 bg-white/80 p-3 rounded-lg border border-emerald-200 leading-relaxed text-xs">
                                      {renderHighlightedText(q.explanation)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : isSpeakingQuestion ? (
                      <div className="space-y-3.5">
                        {/* Thẻ phần thi Nói (Sprechen) */}
                        <div className="bg-[#ecfdf5] border-2 border-[#111827] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#059669] text-white flex items-center justify-center font-black shadow-xs">
                              <Mic className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#064e3b] font-heading uppercase text-xs">
                                  PHẦN THI NÓI (SPRECHEN) - VẤN ĐÁP
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#059669] text-white font-bold">
                                  Tự Luyện & Xem Mẫu
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-600 font-medium">
                                Chuẩn bị dàn ý và luyện nói theo đề bài. Không dùng trắc nghiệm.
                              </span>
                            </div>
                          </div>

                          {q.audioUrl && (
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#111827]">
                              <span className="text-[10px] font-bold text-slate-600">Audio đề bài:</span>
                              <audio controls src={q.audioUrl} className="h-7 max-w-[200px]" />
                            </div>
                          )}
                        </div>

                        {/* Vùng ngữ cảnh đề bài nếu có */}
                        {Boolean(q.contextText) && (
                          <div className="p-4 bg-amber-50 border-2 border-[#111827] rounded-xl text-xs space-y-2">
                            <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1 font-heading">
                              🎙️ Đề Tài / Câu Hỏi Gợi Ý (Thema & Leitfragen):
                            </span>
                            <div className="text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                              {renderHighlightedText(q.contextText || '')}
                            </div>
                          </div>
                        )}

                        {/* Vùng ghi chú dàn ý chuẩn bị nói (Notizen zur Vorbereitung) */}
                        <div className="bg-white border-2 border-[#111827] rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-[#111827] font-heading flex items-center gap-1.5 uppercase">
                              <PenTool className="w-3.5 h-3.5 text-[#059669]" />
                              <span>Ghi Chú Dàn Ý Chuẩn Bị Nói (Notizen zur Vorbereitung):</span>
                            </label>
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Tự động lưu
                            </span>
                          </div>
                          <textarea
                            rows={6}
                            value={userChoice}
                            readOnly={isReviewMode}
                            onChange={(e) => !isReviewMode && onAnswerChange(q.id, e.target.value)}
                            placeholder={`Ghi nhanh các ý chính bạn sẽ trình bày (Từ khóa, ý tưởng, luận điểm)... \nVí dụ:\n- Thema: Soziale Medien\n- Persönliche Erfahrung: Ich nutze täglich...\n- Vorteile: Schnelle Kommunikation...\n- Nachteile: Zeitverschwendung, Datenschutz...`}
                            className="w-full p-3 bg-[#f8fafc] border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                          />
                        </div>

                        {/* Gợi ý cấu trúc nói chuẩn (Redemittel) */}
                        <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-xs space-y-1.5">
                          <div className="font-black text-[#1e40af] flex items-center gap-1.5 font-heading uppercase text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cấu Trúc Bài Nói Chuẩn (Redemittel für Sprechen):</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                            <div className="p-2 bg-white rounded border border-blue-200">
                              <b className="text-[#111827] block">Mở đầu & Trải nghiệm:</b>
                              <span>• In meiner Präsentation geht es um...</span><br />
                              <span>• Aus persönlicher Erfahrung kann ich sagen...</span>
                            </div>
                            <div className="p-2 bg-white rounded border border-blue-200">
                              <b className="text-[#111827] block">Ưu nhược điểm & Quan điểm:</b>
                              <span>• Ein Vorteil / Nachteil ist sicherlich...</span><br />
                              <span>• Meiner Meinung nach sollte man...</span>
                            </div>
                          </div>
                        </div>

                        {/* Nút bấm xem đáp án / bài nói mẫu */}
                        {Boolean(q.explanation && q.explanation.trim()) && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setRevealedAnswers((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-500 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-2 shadow-2xs font-heading"
                            >
                              <Sparkles className="w-4 h-4 text-emerald-600" />
                              <span>{revealedAnswers[q.id] ? '▲ Ẩn Bài Nói Mẫu' : '💡 Xem Bài Nói Mẫu & Dàn Ý Tham Khảo (Musterantwort)'}</span>
                            </button>

                            {(revealedAnswers[q.id] || isReviewMode) && (
                              <div className="mt-2.5 p-4 bg-[#f0fdf4] border-2 border-emerald-500 rounded-xl space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-emerald-800 font-black font-heading text-xs uppercase">
                                  <Sparkles className="w-4 h-4 text-emerald-600" />
                                  <span>Bài Nói Mẫu & Dàn Ý Câu Trả Lời Chuẩn (Musterantwort):</span>
                                </div>
                                <div className="whitespace-pre-line font-mono text-slate-800 bg-white/80 p-3 rounded-lg border border-emerald-200 leading-relaxed text-xs">
                                  {renderHighlightedText(q.explanation)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* MCQ OPTIONS WITH INLINE TRANSLATE AND HIGHLIGHT SUPPORT */
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userChoice === opt.id;
                          const isCorrectOption = isOptionCorrectForQuestion(q, opt, optIdx);

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
                              buttonStyle = 'bg-[#f8fafc] text-[#111827] border-slate-200 opacity-80';
                            }
                          } else if (isSelected) {
                            buttonStyle = 'bg-[#2563EB] text-white border-[#111827] brutal-shadow font-black';
                            badgeElement = <CheckCircle2 className="w-4 h-4 text-white shrink-0" />;
                          }

                          return (
                            <div
                              key={opt.id}
                              onClick={() => !isReviewMode && onAnswerChange(q.id, opt.id)}
                              className={`w-full text-left p-3 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${
                                isReviewMode ? 'cursor-default' : 'cursor-pointer'
                              } ${buttonStyle}`}
                            >
                              <div className="flex-1 font-medium leading-normal">
                                {renderHighlightedText(opt.text)}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {(() => {
                                  const isOptTranslated = highlights.some(
                                    (h) => h.text.toLowerCase() === opt.text.trim().toLowerCase()
                                  );
                                  return (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickTranslateText(opt.text);
                                      }}
                                      className={`px-1.5 py-0.5 rounded border text-[10px] font-bold cursor-pointer transition-all ${
                                        isOptTranslated
                                          ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-rose-100 hover:text-rose-700'
                                          : isSelected
                                          ? 'bg-white/20 text-white border-white/40 hover:bg-white/30'
                                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-blue-50 hover:text-blue-700'
                                      }`}
                                      title={isOptTranslated ? 'Nhấn để tắt dịch đáp án này' : 'Dịch nghĩa Tiếng Việt đáp án này'}
                                    >
                                      {isOptTranslated ? '✕ Tắt dịch' : '🌐 Dịch'}
                                    </button>
                                  );
                                })()}
                                {badgeElement}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation in Review mode */}
                    {isReviewMode && (
                      <div className="mt-2 p-3 bg-[#eff6ff] border-2 border-[#2563EB] rounded-xl space-y-1">
                        <h5 className="text-[11px] font-black uppercase text-[#1e40af] flex items-center gap-1 font-heading">
                          <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                          💡 {isWritingQuestion
                                ? 'Dàn Ý & Bài Viết Mẫu Tham Khảo (Musterbrief):'
                                : isSpeakingQuestion
                                ? 'Dàn Ý & Bài Nói Mẫu Tham Khảo (Musterantwort):'
                                : 'Giải Thích Đáp Án:'}
                        </h5>
                        <div className="text-xs text-[#1e293b] leading-relaxed font-medium">
                          {renderHighlightedText(
                            q.explanation ||
                            (isWritingQuestion
                              ? 'Khi viết thư, hãy đảm bảo viết đủ các ý (Leitpunkte), có ngày tháng, lời chào phù hợp (Anrede) và lời chúc kết thúc (Grußformel).'
                              : isSpeakingQuestion
                              ? 'Khi nói, hãy chuẩn bị dàn ý rõ ràng: Einleitung, Erfahrungen, Vor-/Nachteile, eigene Meinung và Schluss.'
                              : `Đáp án chính xác là (${q.correctOptionId || 'A'}).`)
                          )}
                        </div>
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
      <footer className="shrink-0 z-30 bg-white border-t-2 border-[#111827] p-3 sm:p-4 shadow-lg sticky bottom-0 lg:static">
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
                  onFinishSection(computeExamResults());
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

      {/* 7. FULLSCREEN SECTION BANNER IMAGE PREVIEW MODAL */}
      {previewBannerUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-white border-4 border-[#111827] rounded-2xl max-w-5xl w-full p-4 brutal-shadow-lg space-y-3 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
              <h3 className="text-sm font-black text-[#111827] font-heading flex items-center gap-2">
                🖼️ Hình Ảnh Banner Phần Thi - {currentSectionMeta?.name}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewBannerUrl(null)}
                className="p-1.5 bg-[#e11d48] text-white rounded-lg border-2 border-[#111827] hover:bg-red-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-950 rounded-xl">
              <img
                src={previewBannerUrl}
                alt="Banner phần thi phóng to"
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewBannerUrl(null)}
                className="px-5 py-2 bg-[#111827] text-white border-2 border-[#111827] rounded-xl text-xs font-black cursor-pointer uppercase font-heading hover:bg-slate-800"
              >
                Đóng Ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
