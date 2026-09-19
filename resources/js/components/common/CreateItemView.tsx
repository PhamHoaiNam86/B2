import React, { useState, useEffect } from 'react';
import { VocabItem, ExamModel, GrammarTopic } from '../../types';
import { ArrowLeft, PlusCircle, Edit, BookOpen, FileCheck2, Brain, Save, Plus, Trash2, CheckCircle2, Sparkles, FileText, FolderPlus, HelpCircle, Upload } from 'lucide-react';

interface ExamQuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface ExamQuestion {
  id: string;
  type?: 'choice' | 'writing' | 'listening';
  questionText: string;
  contextText?: string;
  audioUrl?: string;
  options: ExamQuestionOption[];
  explanation?: string;
}

interface ExamSection {
  id: string;
  name: string;
  duration: string;
  questions: ExamQuestion[];
}

interface CreateItemViewProps {
  type: 'vocab' | 'exam' | 'grammar';
  editingItem?: any | null;
  initialLevel?: string;
  onBack: (targetLevel?: string) => void;
  onAddVocab: (vocab: VocabItem) => void;
  onAddExam: (exam: ExamModel) => void;
  onAddGrammar?: (topic: GrammarTopic) => void;
  onUpdateVocab?: (vocab: VocabItem) => void;
  onUpdateExam?: (exam: ExamModel) => void;
  onUpdateGrammar?: (topic: GrammarTopic) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CreateItemView: React.FC<CreateItemViewProps> = ({
  type,
  editingItem,
  initialLevel,
  onBack,
  onAddVocab,
  onAddExam,
  onAddGrammar,
  onUpdateVocab,
  onUpdateExam,
  onUpdateGrammar,
  onShowToast,
}) => {
  const isEditMode = !!editingItem;

  // Vocab State
  const [word, setWord] = useState(editingItem?.word || '');
  const [article, setArticle] = useState(editingItem?.article || 'der');
  const [plural, setPlural] = useState(editingItem?.plural || '');
  const [pos, setPos] = useState(editingItem?.pos || 'Nomen');
  const [phonetic, setPhonetic] = useState(editingItem?.phonetic || '');
  const [meaningVi, setMeaningVi] = useState(editingItem?.meaningVi || '');
  const [exampleDe, setExampleDe] = useState(editingItem?.exampleDe || '');
  const [exampleVi, setExampleVi] = useState(editingItem?.exampleVi || '');
  const [topic, setTopic] = useState(editingItem?.topic || 'Arbeit & Beruf');

  // Exam State
  const [examName, setExamName] = useState(editingItem?.name || '');
  const [examCode, setExamCode] = useState(editingItem?.examCode || `MOCK-${Date.now().toString().slice(-4)}`);
  const [level, setLevel] = useState(editingItem?.level || initialLevel || 'TELC B2');
  const [durationMinutes, setDurationMinutes] = useState(editingItem?.durationMinutes || 90);
  const [description, setDescription] = useState(editingItem?.description || '');
  const [uploadingAudioQId, setUploadingAudioQId] = useState<string | null>(null);

  // Dynamic Exam Sections State (Admin freely creates and names sections)
  const [sections, setSections] = useState<ExamSection[]>(() => {
    return [
      {
        id: `sec-${Date.now()}`,
        name: '',
        duration: '30 phút',
        questions: [
          {
            id: `q-1-1`,
            questionText: '',
            contextText: '',
            explanation: '',
            options: [
              { id: `opt-1-1-1`, text: '', isCorrect: true },
              { id: `opt-1-1-2`, text: '', isCorrect: false },
            ],
          },
        ],
      },
    ];
  });

  // Calculate Total Questions Count across all sections
  const totalQuestionsCount = sections.reduce((acc, sec) => acc + sec.questions.length, 0);

  // Pre-fill fields on Edit Mode
  useEffect(() => {
    if (!editingItem) return;

    if (type === 'vocab') {
      setWord(editingItem.word || '');
      setArticle(editingItem.article || 'der');
      setPlural(editingItem.plural || '');
      setPos(editingItem.pos || 'Nomen');
      setPhonetic(editingItem.phonetic || '');
      setMeaningVi(editingItem.meaningVi || '');
      setExampleDe(editingItem.exampleDe || '');
      setExampleVi(editingItem.exampleVi || '');
      setTopic(editingItem.topic || 'Arbeit & Beruf');
    } else if (type === 'exam') {
      setExamName(editingItem.name || '');
      setExamCode(editingItem.examCode || '');
      setLevel(editingItem.level || 'TELC B2');
      setDurationMinutes(editingItem.durationMinutes || 90);
      setDescription(editingItem.description || '');

      if (editingItem.examCode) {
        fetch(`/api/v1/questions/${editingItem.examCode}`)
          .then((res) => res.json())
          .then((res) => {
            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
              const sectionsMap: Record<string, ExamQuestion[]> = {};

              res.data.forEach((q: any, idx: number) => {
                const mappedQ: ExamQuestion = {
                  id: String(q.id || `q-${idx + 1}`),
                  type: q.type || 'choice',
                  questionText: q.title || `Câu ${idx + 1}: `,
                  contextText: q.context_text || q.contextText || '',
                  audioUrl: q.audio_url || q.audioUrl || '',
                  explanation: q.explanation || '',
                  options: q.options_json
                    ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json)
                    : [],
                };

                const secName = q.section || 'Phần 1';
                if (!sectionsMap[secName]) {
                  sectionsMap[secName] = [];
                }
                sectionsMap[secName].push(mappedQ);
              });

              const builtSections: ExamSection[] = Object.keys(sectionsMap).map((secName, sIdx) => ({
                id: `sec-${sIdx + 1}`,
                name: secName,
                duration: '30 phút',
                questions: sectionsMap[secName],
              }));

              if (builtSections.length > 0) {
                setSections(builtSections);
              }
            }
          })
          .catch(() => {});
      }
    } else if (type === 'grammar') {
      setGrammarTitle(editingItem.title || '');
      setGrammarLevel(editingItem.level || 'B2');
      setGrammarCategory(editingItem.category || 'Verben & Modi');
      setGrammarSummary(editingItem.summary || '');
      setGrammarContent(editingItem.content || '');
      setGrammarRules(editingItem.rulePoints ? editingItem.rulePoints.join('\n') : '');
    }
  }, [editingItem, type]);

  // Section Handlers
  const handleAddSection = () => {
    const secIdx = sections.length + 1;
    const newSec: ExamSection = {
      id: `sec-${Date.now()}`,
      name: '',
      duration: '30 phút',
      questions: [],
    };
    setSections((prev) => [...prev, newSec]);
    onShowToast('Đã thêm phần thi', `Đã mở rộng thêm Phần thi số ${secIdx}`, 'info');
  };

  const handleDeleteSection = (secId: string) => {
    if (sections.length <= 1) {
      onShowToast('Cảnh báo', 'Đề thi cần có ít nhất 1 phần thi', 'warning');
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== secId));
    onShowToast('Đã xóa phần thi', 'Đã xóa phần thi khỏi cấu trúc đề thi', 'info');
  };

  const handleSectionNameChange = (secId: string, name: string) => {
    setSections((prev) => prev.map((s) => (s.id === secId ? { ...s, name } : s)));
  };

  const handleSectionDurationChange = (secId: string, duration: string) => {
    setSections((prev) => prev.map((s) => (s.id === secId ? { ...s, duration } : s)));
  };

  // Question Handlers inside targeted section
  const handleAddQuestionToSection = (secId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          const newQ: ExamQuestion = {
            id: `q-${Date.now()}`,
            questionText: '',
            contextText: '',
            explanation: '',
            options: [
              { id: `opt-${Date.now()}-1`, text: '', isCorrect: true },
              { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
            ],
          };
          return { ...sec, questions: [...sec.questions, newQ] };
        }
        return sec;
      })
    );
    onShowToast('Thêm câu hỏi', 'Đã tạo 1 câu hỏi mới vào phần thi này', 'info');
  };

  const handleDeleteQuestionFromSection = (secId: string, qId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return { ...sec, questions: sec.questions.filter((q) => q.id !== qId) };
        }
        return sec;
      })
    );
  };

  const handleQuestionTextChange = (secId: string, qId: string, text: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => (q.id === qId ? { ...q, questionText: text } : q)),
          };
        }
        return sec;
      })
    );
  };

  const handleContextTextChange = (secId: string, qId: string, contextText: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => (q.id === qId ? { ...q, contextText } : q)),
          };
        }
        return sec;
      })
    );
  };

  const handleQuestionTypeChange = (secId: string, qId: string, type: 'choice' | 'writing' | 'listening') => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => (q.id === qId ? { ...q, type } : q)),
          };
        }
        return sec;
      })
    );
  };

  const handleAudioUrlChange = (secId: string, qId: string, audioUrl: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => (q.id === qId ? { ...q, audioUrl } : q)),
          };
        }
        return sec;
      })
    );
  };

  const handleFileUpload = async (secId: string, qId: string, file: File) => {
    setUploadingAudioQId(qId);
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/v1/upload-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.url) {
        handleAudioUrlChange(secId, qId, data.url);
        onShowToast('Tải file thành công!', 'Đã tải file âm thanh MP3 thành công cho bài nghe.', 'success');
      } else {
        onShowToast('Lỗi tải file', data.message || 'Không thể tải file âm thanh', 'warning');
      }
    } catch (err) {
      onShowToast('Lỗi tải file', 'Không thể kết nối đến máy chủ để tải file âm thanh', 'warning');
    } finally {
      setUploadingAudioQId(null);
    }
  };

  const getCleanOptionText = (rawText: string) => {
    if (!rawText) return '';
    return rawText.replace(/^(?:Đáp án\s*)?[A-Z][:.]\s*/i, '');
  };

  const handleOptionTextChange = (secId: string, qId: string, optId: string, optIndex: number, newRawValue: string) => {
    const letter = String.fromCharCode(65 + optIndex);
    const clean = getCleanOptionText(newRawValue);
    const formattedText = clean ? `${letter}: ${clean}` : '';

    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.id === qId) {
                return {
                  ...q,
                  options: q.options.map((opt) => (opt.id === optId ? { ...opt, text: formattedText } : opt)),
                };
              }
              return q;
            }),
          };
        }
        return sec;
      })
    );
  };

  const handleSetCorrectOption = (secId: string, qId: string, optId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.id === qId) {
                return {
                  ...q,
                  options: q.options.map((opt) => ({
                    ...opt,
                    isCorrect: opt.id === optId,
                  })),
                };
              }
              return q;
            }),
          };
        }
        return sec;
      })
    );
  };

  const handleAddOption = (secId: string, qId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.id === qId) {
                const newOpt: ExamQuestionOption = {
                  id: `opt-${Date.now()}`,
                  text: '',
                  isCorrect: false,
                };
                return { ...q, options: [...q.options, newOpt] };
              }
              return q;
            }),
          };
        }
        return sec;
      })
    );
  };

  const handleDeleteOption = (secId: string, qId: string, optId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.id === qId) {
                if (q.options.length <= 2) {
                  onShowToast('Cảnh báo', 'Mỗi câu hỏi cần ít nhất 2 đáp án', 'warning');
                  return q;
                }
                return { ...q, options: q.options.filter((opt) => opt.id !== optId) };
              }
              return q;
            }),
          };
        }
        return sec;
      })
    );
  };

  const handleExplanationChange = (secId: string, qId: string, text: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => (q.id === qId ? { ...q, explanation: text } : q)),
          };
        }
        return sec;
      })
    );
  };

  // Grammar State
  const [grammarTitle, setGrammarTitle] = useState(editingItem?.title || '');
  const [grammarLevel, setGrammarLevel] = useState(editingItem?.level || 'B2');
  const [grammarCategory, setGrammarCategory] = useState(editingItem?.category || 'Verben & Modi');
  const [grammarSummary, setGrammarSummary] = useState(editingItem?.summary || '');
  const [grammarContent, setGrammarContent] = useState(editingItem?.content || '');
  const [grammarRules, setGrammarRules] = useState(
    editingItem?.rulePoints ? editingItem.rulePoints.join('\n') : ''
  );

  const handleSubmitVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !meaningVi) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập từ vựng và nghĩa tiếng Việt', 'warning');
      return;
    }

    const vocabData: VocabItem = {
      id: editingItem?.id || `vocab-${Date.now()}`,
      word,
      article,
      plural,
      pos,
      phonetic,
      meaningVi,
      exampleDe,
      exampleVi,
      topic,
      status: editingItem?.status || 'learning',
      isFavorite: editingItem?.isFavorite || false,
    };

    if (isEditMode && onUpdateVocab) {
      onUpdateVocab(vocabData);
      onShowToast('Cập nhật thành công', `Đã chỉnh sửa từ vựng "${word}".`, 'success');
    } else {
      onAddVocab(vocabData);
      onShowToast('Thành công', `Đã thêm từ vựng mới "${word}".`, 'success');
    }
    onBack();
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !examCode) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập tên đề thi và mã đề thi', 'warning');
      return;
    }

    const flattenedQuestions: any[] = [];
    sections.forEach((sec, sIdx) => {
      const fallbackSecName = sec.name.trim() || `Phần ${sIdx + 1}`;
      sec.questions.forEach((q) => {
        flattenedQuestions.push({
          id: q.id,
          section: fallbackSecName,
          type: q.type || 'choice',
          questionText: q.questionText,
          contextText: q.contextText || '',
          audioUrl: q.audioUrl || '',
          explanation: q.explanation || '',
          options: q.options.map((opt, optIndex) => {
            const letter = String.fromCharCode(65 + optIndex);
            const clean = getCleanOptionText(opt.text);
            return {
              ...opt,
              text: clean ? `${letter}: ${clean}` : `${letter}: `,
            };
          }),
        });
      });
    });

    const formattedSections = sections.map((sec, sIdx) => ({
      name: sec.name.trim() || `Phần ${sIdx + 1}`,
      questionCount: sec.questions.length,
      duration: sec.duration || '30 phút',
    }));

    const examData: ExamModel = {
      id: editingItem?.id || `exam-${Date.now()}`,
      name: examName,
      examCode,
      level,
      durationMinutes,
      totalQuestions: flattenedQuestions.length || totalQuestionsCount,
      description: description || 'Đề thi thử tiếng Đức chuẩn hóa.',
      sections: formattedSections,
      targetScore: editingItem?.targetScore || 225,
      passRate: editingItem?.passRate || '85%',
      questions: flattenedQuestions,
    };

    if (isEditMode && onUpdateExam) {
      onUpdateExam(examData);
      onShowToast('Cập nhật thành công', `Đã cập nhật bộ đề thi "${examName}".`, 'success');
    } else {
      onAddExam(examData);
      onShowToast('Thành công', `Đã tạo bộ đề thi mới "${examName}".`, 'success');
    }
    onBack(level);
  };

  const handleSubmitGrammar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grammarTitle || !grammarSummary) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập tên chuyên đề và tóm tắt ngữ pháp', 'warning');
      return;
    }

    const topicData: GrammarTopic = {
      id: editingItem?.id || `grammar-${Date.now()}`,
      title: grammarTitle,
      level: grammarLevel,
      category: grammarCategory,
      summary: grammarSummary,
      content: grammarContent || grammarSummary,
      rulePoints: grammarRules
        ? grammarRules.split('\n').filter((r: string) => r.trim() !== '')
        : ['Quy tắc cơ bản'],
      examples: editingItem?.examples || [
        { de: 'Beispiel Sätze auf Deutsch', vi: 'Ví dụ minh họa Tiếng Việt' },
      ],
      status: editingItem?.status || 'in_progress',
      progress: editingItem?.progress || 0,
      score: editingItem?.score || 0,
      badgeLabel: editingItem?.badgeLabel || 'MỚI TẠO',
    };

    if (isEditMode && onUpdateGrammar) {
      onUpdateGrammar(topicData);
      onShowToast('Cập nhật thành công', `Đã chỉnh sửa chuyên đề ngữ pháp "${grammarTitle}".`, 'success');
    } else if (onAddGrammar) {
      onAddGrammar(topicData);
      onShowToast('Thành công', `Đã thêm chuyên đề ngữ pháp mới "${grammarTitle}".`, 'success');
    }
    onBack();
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#111827] pb-4">
        <button
          type="button"
          onClick={() => onBack()}
          className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#2563EB] text-white rounded-full text-xs font-black uppercase border border-[#111827]">
            {isEditMode ? 'CHỈNH SỬA DỮ LIỆU' : 'TẠO MỚI DỮ LIỆU'}
          </span>
          <span className="px-3 py-1 bg-[#eff6ff] text-[#1e40af] rounded-full text-xs font-black uppercase border border-[#111827]">
            {type === 'vocab' ? 'TỪ VỰNG' : type === 'grammar' ? 'NGỮ PHÁP' : 'ĐỀ THI'}
          </span>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#111827] font-heading flex items-center gap-2">
            {type === 'vocab' && <BookOpen className="w-6 h-6 text-[#2563EB]" />}
            {type === 'exam' && <FileCheck2 className="w-6 h-6 text-[#F97316]" />}
            {type === 'grammar' && <Brain className="w-6 h-6 text-[#059669]" />}
            <span>
              {isEditMode ? 'Chỉnh Sửa' : 'Thêm Mới'}{' '}
              {type === 'vocab' ? 'Từ Vựng B2' : type === 'grammar' ? 'Chuyên Đề Ngữ Pháp' : 'Bộ Đề Thi Thử'}
            </span>
          </h2>
          <p className="text-xs text-[#4b5563]">
            Nhập đầy đủ các trường thông tin bên dưới để lưu dữ liệu vào hệ thống CSDL.
          </p>
        </div>

        {/* 1. FORM VOCAB */}
        {type === 'vocab' && (
          <form onSubmit={handleSubmitVocab} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Giống từ (Article)</label>
                <select
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                >
                  <option value="der">der (Giống đực)</option>
                  <option value="die">die (Giống cái)</option>
                  <option value="das">das (Giống trung)</option>
                  <option value="">Không có (Verb/Adj)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Từ tiếng Đức *</label>
                <input
                  type="text"
                  required
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Ví dụ: Berufsausbildung"
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Dạng số nhiều (Plural)</label>
                <input
                  type="text"
                  value={plural}
                  onChange={(e) => setPlural(e.target.value)}
                  placeholder="Ví dụ: die Ausbildungen"
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Loại từ (POS)</label>
                <select
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                >
                  <option value="Nomen">Nomen (Danh từ)</option>
                  <option value="Verb">Verb (Động từ)</option>
                  <option value="Adjektiv">Adjektiv (Tính từ)</option>
                  <option value="Redewendung">Redewendung (Cụm từ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Phiên âm (Phonetic)</label>
                <input
                  type="text"
                  value={phonetic}
                  onChange={(e) => setPhonetic(e.target.value)}
                  placeholder="Ví dụ: /bəˈʁuːfsʔaʊsˌbɪldʊŋ/"
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Chủ đề (Topic)</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Arbeit & Beruf"
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Nghĩa Tiếng Việt *</label>
              <input
                type="text"
                required
                value={meaningVi}
                onChange={(e) => setMeaningVi(e.target.value)}
                placeholder="Ví dụ: Đào tạo nghề nghiệp"
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Ví dụ Tiếng Đức</label>
                <textarea
                  rows={2}
                  value={exampleDe}
                  onChange={(e) => setExampleDe(e.target.value)}
                  placeholder="Ví dụ: Eine duale Berufsausbildung kombiniert Theorie und Praxis."
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Dịch nghĩa câu ví dụ</label>
                <textarea
                  rows={2}
                  value={exampleVi}
                  onChange={(e) => setExampleVi(e.target.value)}
                  placeholder="Dịch: Đào tạo nghề kép kết hợp lý thuyết và thực hành."
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onBack()}
                className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer uppercase"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Từ Vựng</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. DYNAMIC ADMIN EXAM BUILDER (ADMIN TỰ TẠO VÀ ĐẶT TÊN CÁC PHẦN THI) */}
        {type === 'exam' && (
          <form onSubmit={handleSubmitExam} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Mã bộ đề thi (Exam Code) *</label>
                <input
                  type="text"
                  required
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  placeholder="Ví dụ: TELC-B2-MOCK-05"
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Trình độ (Level)</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                >
                  <option value="TELC A1">Goethe / TELC A1</option>
                  <option value="TELC A2">Goethe / TELC A2</option>
                  <option value="TELC B1">Goethe / TELC B1</option>
                  <option value="TELC B2">TELC B2 Deutsch</option>
                  <option value="TELC C1">TELC C1 Hochschule</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Tên bộ đề thi *</label>
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Ví dụ: Đề Thi Thử TELC B2 Tổng Hợp Số 5"
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Thời gian làm bài tổng (Phút)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Tổng số câu hỏi (Tự động tính)</label>
                <input
                  type="number"
                  disabled
                  value={totalQuestionsCount}
                  className="w-full p-2.5 bg-slate-100 border-2 border-[#111827] rounded-xl text-xs font-black text-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Mô tả bộ đề thi</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn về cấu trúc và yêu cầu của đề thi..."
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            {/* DYNAMIC SECTIONS & QUESTIONS BUILDER */}
            <div className="pt-6 border-t-2 border-[#111827] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#eff6ff] p-4 border-2 border-[#111827] rounded-xl brutal-shadow-xs">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-[#2563EB] text-white text-[10px] font-black uppercase border border-[#111827]">
                    TỰ ĐỊNH NGHĨA PHẦN THI & CÂU HỎI
                  </span>
                  <h3 className="text-base font-black text-[#111827] mt-1 font-heading">
                    Cấu Trúc Đề Thi ({sections.length} Phần Thi - Tổng {totalQuestionsCount} Câu)
                  </h3>
                  <p className="text-xs text-[#4b5563]">
                    Admin chủ động gõ tên và tạo các Phần Thi. Bấm nút "+ Thêm câu hỏi" trong từng Phần Thi tương ứng.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-4 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 uppercase font-heading"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>+ Thêm Phần Thi Mới</span>
                </button>
              </div>

              {/* Sections Cards Loop */}
              <div className="space-y-6">
                {sections.map((sec, secIdx) => (
                  <div
                    key={sec.id}
                    className="bg-[#f8fafc] border-2 border-[#111827] rounded-2xl p-5 brutal-shadow-xs space-y-4"
                  >
                    {/* Section Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 border-2 border-[#111827] rounded-xl">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-black uppercase font-mono shrink-0">
                          PHẦN THI #{secIdx + 1}
                        </span>

                        <input
                          type="text"
                          required
                          value={sec.name}
                          onChange={(e) => handleSectionNameChange(sec.id, e.target.value)}
                          placeholder={`Nhập tên phần thi (Ví dụ: Phần ${secIdx + 1}, Nghe, Đọc, Bài 1...)`}
                          className="w-full p-2 bg-[#eff6ff] border-2 border-[#111827] rounded-lg text-xs font-black text-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="text"
                          value={sec.duration}
                          onChange={(e) => handleSectionDurationChange(sec.id, e.target.value)}
                          placeholder="30 phút"
                          className="w-28 p-2 bg-white border-2 border-[#111827] rounded-lg text-xs font-bold text-center"
                        />

                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-2 text-[#e11d48] hover:bg-[#ffe4e6] border-2 border-[#111827] rounded-lg cursor-pointer transition-all"
                          title="Xóa phần thi này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Questions List Inside This Section */}
                    <div className="space-y-4 pl-0 sm:pl-3">
                      {sec.questions.length === 0 ? (
                        <div className="p-4 bg-white border-2 border-dashed border-[#111827]/30 rounded-xl text-center text-xs font-bold text-[#64748b]">
                          Chưa có câu hỏi nào trong {sec.name || `Phần Thi #${secIdx + 1}`}. Bấm nút bên dưới để thêm câu hỏi!
                        </div>
                      ) : (
                        sec.questions.map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="bg-white border-2 border-[#111827] rounded-xl p-4 brutal-shadow-xs space-y-3"
                          >
                            {/* Question Title & Delete Button */}
                            <div className="flex items-center justify-between gap-3">
                              <span className="px-2.5 py-0.5 bg-[#111827] text-white rounded text-[11px] font-black uppercase font-mono shrink-0">
                                CÂU {qIdx + 1} ({sec.name || `Phần ${secIdx + 1}`})
                              </span>

                              <button
                                type="button"
                                onClick={() => handleDeleteQuestionFromSection(sec.id, q.id)}
                                className="px-2.5 py-1 text-[#e11d48] hover:bg-[#ffe4e6] border border-[#111827] rounded-lg cursor-pointer transition-all font-bold text-[11px] flex items-center gap-1"
                                title="Xóa câu hỏi này"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Xóa Câu này</span>
                              </button>
                            </div>

                            {/* Question Type Selector */}
                            <div className="p-2.5 bg-slate-100 border-2 border-[#111827] rounded-xl space-y-1.5">
                              <label className="block text-[11px] font-black text-[#111827]">
                                Chọn Loại Câu Hỏi / Nội Dung Thi:
                              </label>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuestionTypeChange(sec.id, q.id, 'choice')}
                                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                                    (!q.type || q.type === 'choice')
                                      ? 'bg-[#2563eb] text-white border-[#111827] brutal-shadow-xs'
                                      : 'bg-white text-[#334155] border-[#111827] hover:bg-slate-200'
                                  }`}
                                >
                                  🔘 Trắc nghiệm (Default)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuestionTypeChange(sec.id, q.id, 'listening')}
                                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                                    q.type === 'listening'
                                      ? 'bg-[#d97706] text-white border-[#111827] brutal-shadow-xs'
                                      : 'bg-white text-[#334155] border-[#111827] hover:bg-slate-200'
                                  }`}
                                >
                                  🎧 Nghe (Hören)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuestionTypeChange(sec.id, q.id, 'writing')}
                                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                                    q.type === 'writing'
                                      ? 'bg-[#7c3aed] text-white border-[#111827] brutal-shadow-xs'
                                      : 'bg-white text-[#334155] border-[#111827] hover:bg-slate-200'
                                  }`}
                                >
                                  📝 Viết (Schreiben)
                                </button>
                              </div>
                            </div>

                            {/* Audio File Upload Box for Listening Type */}
                            {q.type === 'listening' && (
                              <div className="p-3.5 bg-[#fffbe6] border-2 border-[#111827] rounded-xl space-y-2">
                                <label className="block text-[11px] font-black text-[#854d0e] flex items-center gap-1.5 font-heading uppercase">
                                  <Upload className="w-4 h-4 text-[#d97706]" />
                                  Tải File Âm Thanh MP3 Cho Bài Nghe:
                                </label>
                                
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <label className="px-4 py-2 bg-[#d97706] text-white border-2 border-[#111827] rounded-xl text-xs font-black hover:bg-[#b45309] transition-all cursor-pointer inline-flex items-center justify-center gap-2 brutal-shadow-xs shrink-0">
                                    <Upload className="w-4 h-4" />
                                    <span>{uploadingAudioQId === q.id ? 'Đang tải file lên...' : '📁 Chọn File MP3 Tải Lên'}</span>
                                    <input
                                      type="file"
                                      accept="audio/*,.mp3,.wav,.m4a,.ogg"
                                      className="hidden"
                                      disabled={uploadingAudioQId === q.id}
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleFileUpload(sec.id, q.id, e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>

                                  <div className="flex-1 flex items-center bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111827]">
                                    {q.audioUrl ? (
                                      <span className="text-emerald-700 truncate font-semibold">✓ Đã lưu file: {q.audioUrl}</span>
                                    ) : (
                                      <span className="text-slate-400 font-normal">Vui lòng bấm chọn file MP3 từ máy tính của bạn...</span>
                                    )}
                                  </div>
                                </div>

                                {q.audioUrl && (
                                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#d97706]/20">
                                    <audio controls src={q.audioUrl} className="h-8 max-w-full rounded-lg" />
                                    <button
                                      type="button"
                                      onClick={() => handleAudioUrlChange(sec.id, q.id, '')}
                                      className="px-2.5 py-1 text-[11px] font-black text-[#ef4444] hover:bg-[#fee2e2] border border-[#ef4444] rounded-lg transition-all cursor-pointer"
                                    >
                                      Xóa file này
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Question Content Input */}
                            <div>
                              <label className="block text-[11px] font-black text-[#111827] mb-1">
                                Nội dung / Tiêu đề câu hỏi #{qIdx + 1} *
                              </label>
                              <input
                                type="text"
                                required
                                value={q.questionText}
                                onChange={(e) => handleQuestionTextChange(sec.id, q.id, e.target.value)}
                                placeholder={q.type === 'writing' ? 'Ví dụ: Bài thi Viết thư phàn nàn B2 (Schriftlicher Ausdruck)' : `Ví dụ: Câu ${qIdx + 1}: Chọn đáp án đúng...`}
                                className="w-full p-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                              />
                            </div>

                            {/* Context Text / Reading Text / Prompt Instructions */}
                            <div>
                              <label className="block text-[11px] font-black text-[#111827] mb-1">
                                {q.type === 'writing' ? 'Đề bài & Yêu cầu bài viết (Prompt / Instructions)' : 'Đoạn văn bản / Ngữ cảnh (Lesetext / Hörtext)'}
                              </label>
                              <textarea
                                rows={q.type === 'writing' ? 4 : 2}
                                value={q.contextText || ''}
                                onChange={(e) => handleContextTextChange(sec.id, q.id, e.target.value)}
                                placeholder={q.type === 'writing' ? 'Nhập chi tiết yêu cầu bài viết, các ý bắt buộc cần có trong thư B2...' : 'Nhập bài văn đọc hiểu hoặc ngữ cảnh liên quan cho câu hỏi này...'}
                                className="w-full p-2 bg-[#fff8e7] border-2 border-[#111827] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                              />
                            </div>

                            {/* Options List (Only for Choice or Listening) */}
                            {q.type !== 'writing' && (
                              <div className="pl-2 sm:pl-3 space-y-2 border-l-4 border-[#2563EB] pt-1 mt-1">
                                <label className="block text-[10px] font-black text-[#111827] uppercase tracking-wider">
                                  Danh sách các lựa chọn đáp án (Tích chọn đáp án đúng):
                                </label>

                                {q.options.map((opt, optIndex) => {
                                  const letter = String.fromCharCode(65 + optIndex);
                                  const cleanText = getCleanOptionText(opt.text);

                                  return (
                                    <div key={opt.id} className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleSetCorrectOption(sec.id, q.id, opt.id)}
                                        className={`px-3 py-1.5 rounded-xl border-2 text-[11px] font-black cursor-pointer transition-all shrink-0 flex items-center gap-1.5 ${
                                          opt.isCorrect
                                            ? 'bg-[#059669] text-white border-[#111827] brutal-shadow-xs'
                                            : 'bg-white text-[#4b5563] border-[#111827] hover:bg-slate-100'
                                        }`}
                                      >
                                        {opt.isCorrect ? (
                                          <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Đáp án Đúng</span>
                                          </>
                                        ) : (
                                          <span>Chọn Đúng</span>
                                        )}
                                      </button>

                                      <div className="flex-1 flex items-center bg-white border-2 border-[#111827] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB]">
                                        <span className="px-3 py-1.5 bg-[#eff6ff] text-[#1e40af] border-r-2 border-[#111827] font-black text-xs shrink-0 select-none">
                                          {letter}:
                                        </span>
                                        <input
                                          type="text"
                                          required
                                          value={cleanText}
                                          onChange={(e) => handleOptionTextChange(sec.id, q.id, opt.id, optIndex, e.target.value)}
                                          placeholder={`Nội dung phương án ${letter}...`}
                                          className="w-full p-1.5 text-xs font-semibold text-[#111827] focus:outline-none"
                                        />
                                      </div>

                                      {q.options.length > 2 && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteOption(sec.id, q.id, opt.id)}
                                          className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg border border-[#111827] transition-all cursor-pointer"
                                          title="Xóa lựa chọn này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}

                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAddOption(sec.id, q.id)}
                                    className="px-3 py-1 bg-[#eff6ff] text-[#1e40af] border-2 border-[#111827] rounded-xl text-[11px] font-black hover:bg-[#dbeafe] transition-all cursor-pointer inline-flex items-center gap-1 brutal-shadow-xs"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Thêm đáp án cho Câu này</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Explanation Section */}
                            <div className="pt-2 border-t border-[#111827]/10 space-y-1">
                              <label className="block text-[11px] font-black text-[#111827]">
                                Giải Thích Chi Tiết Đáp Án
                              </label>
                              <textarea
                                rows={2}
                                value={q.explanation || ''}
                                onChange={(e) => handleExplanationChange(sec.id, q.id, e.target.value)}
                                placeholder="Nhập nội dung giải thích chi tiết đáp án đúng cho câu hỏi này..."
                                className="w-full p-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                              />
                            </div>
                          </div>
                        ))
                      )}

                      {/* Add Question Button inside section */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddQuestionToSection(sec.id)}
                          className="w-full py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-heading uppercase"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>+ Thêm Câu Hỏi Mới Cho {sec.name || `Phần Thi #${secIdx + 1}`}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Add Section Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="w-full py-3.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider font-heading"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>+ Thêm Phần Thi Mới (Phần {sections.length + 1})</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onBack()}
                className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer uppercase font-heading"
              >
                <Save className="w-4 h-4" />
                <span>Lưu & Xuất Bản Bộ Đề Thi</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. FORM GRAMMAR */}
        {type === 'grammar' && (
          <form onSubmit={handleSubmitGrammar} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Trình độ (Level)</label>
                <select
                  value={grammarLevel}
                  onChange={(e) => setGrammarLevel(e.target.value)}
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                >
                  <option value="A1">Trình độ A1</option>
                  <option value="A2">Trình độ A2</option>
                  <option value="B1">Trình độ B1</option>
                  <option value="B2">Trình độ B2</option>
                  <option value="C1">Trình độ C1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Danh mục (Category)</label>
                <select
                  value={grammarCategory}
                  onChange={(e) => setGrammarCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                >
                  <option value="Verben & Modi">Verben & Modi (Động từ & Thể)</option>
                  <option value="Satzbau & Konnektoren">Satzbau (Cấu trúc câu & Liên từ)</option>
                  <option value="Nomen & Kasus">Nomen & Kasus (Danh từ & Biến thể)</option>
                  <option value="Passiv & Ersatzformen">Passiv (Thể bị động & Dạng thay thế)</option>
                  <option value="Sprachbausteine Traps">Sprachbausteine (Bẫy đề thi B2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#111827] mb-1">Tên chuyên đề ngữ pháp *</label>
                <input
                  type="text"
                  required
                  value={grammarTitle}
                  onChange={(e) => setGrammarTitle(e.target.value)}
                  placeholder="Ví dụ: Konjunktiv II in der Vergangenheit"
                  className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Tóm tắt chuyên đề (Summary) *</label>
              <textarea
                rows={2}
                required
                value={grammarSummary}
                onChange={(e) => setGrammarSummary(e.target.value)}
                placeholder="Tóm tắt ngắn gọn cấu trúc ngữ pháp và cách dùng trong đề thi..."
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Nội dung bài học chi tiết (Markdown/Text)</label>
              <textarea
                rows={5}
                value={grammarContent}
                onChange={(e) => setGrammarContent(e.target.value)}
                placeholder="Nhập chi tiết lý thuyết, công thức và ví dụ..."
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Các quy tắc cốt lõi (Mỗi quy tắc 1 dòng)</label>
              <textarea
                rows={3}
                value={grammarRules}
                onChange={(e) => setGrammarRules(e.target.value)}
                placeholder="Công thức: hätte / wäre + Partizip II&#10;Dùng để diễn tả ước muốn trong quá khứ..."
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onBack()}
                className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#059669] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer uppercase font-heading"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Chuyên Đề Ngữ Pháp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
