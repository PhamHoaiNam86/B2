import React, { useState, useEffect } from 'react';
import { VocabItem, ExamModel, GrammarTopic } from '../../types';
import { ArrowLeft, PlusCircle, Edit, BookOpen, FileCheck2, Brain, Save, Plus, Trash2, CheckCircle2, Sparkles, FileText } from 'lucide-react';

interface ExamQuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface ExamQuestion {
  id: string;
  questionText: string;
  options: ExamQuestionOption[];
  explanation?: string;
}

interface CreateItemViewProps {
  type: 'vocab' | 'exam' | 'grammar';
  editingItem?: any | null;
  onBack: () => void;
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
  const [examCode, setExamCode] = useState(editingItem?.examCode || 'TELC-B2-MOCK-NEW');
  const [level, setLevel] = useState(editingItem?.level || 'TELC B2');
  const [durationMinutes, setDurationMinutes] = useState(editingItem?.durationMinutes || 90);
  const [description, setDescription] = useState(editingItem?.description || '');

  // Dynamic Exam Questions State
  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    if (editingItem?.questions && Array.isArray(editingItem.questions) && editingItem.questions.length > 0) {
      return editingItem.questions;
    }
    return [
      {
        id: `q-1`,
        questionText: '',
        explanation: '',
        options: [
          { id: `opt-1-1`, text: '', isCorrect: true },
          { id: `opt-1-2`, text: '', isCorrect: false },
        ],
      },
    ];
  });

  const [totalQuestions, setTotalQuestions] = useState(editingItem?.totalQuestions || questions.length);

  const handleAddQuestion = () => {
    const qIndex = questions.length + 1;
    const newQ: ExamQuestion = {
      id: `q-${Date.now()}`,
      questionText: '',
      explanation: '',
      options: [
        { id: `opt-${Date.now()}-1`, text: '', isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
      ],
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setTotalQuestions(updated.length);
    onShowToast('Đã thêm câu hỏi', `Đã mở rộng form thêm Câu ${qIndex}`, 'info');
  };

  const handleDeleteQuestion = (qId: string) => {
    if (questions.length <= 1) {
      onShowToast('Cảnh báo', 'Đề thi cần có ít nhất 1 câu hỏi', 'warning');
      return;
    }
    const updated = questions.filter((q) => q.id !== qId);
    setQuestions(updated);
    setTotalQuestions(updated.length);
  };

  const handleQuestionTextChange = (qId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, questionText: text } : q))
    );
  };

  const handleAddOption = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const newOpt: ExamQuestionOption = {
            id: `opt-${Date.now()}`,
            text: '',
            isCorrect: false,
          };
          return { ...q, options: [...q.options, newOpt] };
        }
        return q;
      })
    );
  };

  const handleDeleteOption = (qId: string, optId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          if (q.options.length <= 2) {
            onShowToast('Cảnh báo', 'Mỗi câu hỏi cần ít nhất 2 lựa chọn đáp án', 'warning');
            return q;
          }
          return { ...q, options: q.options.filter((opt) => opt.id !== optId) };
        }
        return q;
      })
    );
  };

  const getCleanOptionText = (rawText: string) => {
    if (!rawText) return '';
    return rawText.replace(/^(?:Đáp án\s*)?[A-Z][:.]\s*/i, '');
  };

  const handleOptionTextChange = (qId: string, optId: string, optIndex: number, newRawValue: string) => {
    const letter = String.fromCharCode(65 + optIndex);
    const clean = getCleanOptionText(newRawValue);
    const formattedText = clean ? `${letter}: ${clean}` : '';

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            options: q.options.map((opt) => (opt.id === optId ? { ...opt, text: formattedText } : opt)),
          };
        }
        return q;
      })
    );
  };

  const handleSetCorrectOption = (qId: string, optId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
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
      })
    );
  };

  const handleExplanationChange = (qId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, explanation: text } : q))
    );
  };

  const handleInsertSnippet = (qId: string, snippet: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const currentExp = q.explanation || '';
          return {
            ...q,
            explanation: currentExp ? `${currentExp}\n${snippet}` : snippet,
          };
        }
        return q;
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

  useEffect(() => {
    if (!editingItem) {
      if (type === 'exam') {
        setExamName('');
        setExamCode(`TELC-B2-MOCK-${Date.now().toString().slice(-4)}`);
        setLevel('TELC B2');
        setDurationMinutes(90);
        setDescription('');
        setQuestions([
          {
            id: 'q-1',
            questionText: '',
            explanation: '',
            options: [
              { id: 'opt-1-1', text: '', isCorrect: true },
              { id: 'opt-1-2', text: '', isCorrect: false },
            ],
          },
        ]);
        setTotalQuestions(1);
      } else if (type === 'vocab') {
        setWord('');
        setArticle('der');
        setPlural('');
        setPos('Nomen');
        setPhonetic('');
        setMeaningVi('');
        setExampleDe('');
        setExampleVi('');
        setTopic('Arbeit & Beruf');
      } else if (type === 'grammar') {
        setGrammarTitle('');
        setGrammarLevel('B2');
        setGrammarCategory('Verben & Modi');
        setGrammarSummary('');
        setGrammarContent('');
        setGrammarRules('');
      }
      return;
    }

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
              const mappedQuestions: ExamQuestion[] = res.data.map((q: any, idx: number) => ({
                id: String(q.id || `q-${idx + 1}`),
                questionText: q.title || `Câu ${idx + 1}: `,
                contextText: q.context_text || '',
                explanation: q.explanation || '',
                options: q.options_json
                  ? (typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json)
                  : [
                      { id: `opt-${idx}-1`, text: 'Đáp án A: ', isCorrect: true },
                      { id: `opt-${idx}-2`, text: 'Đáp án B: ', isCorrect: false },
                    ],
              }));
              setQuestions(mappedQuestions);
              setTotalQuestions(mappedQuestions.length);
            } else if (editingItem.questions && Array.isArray(editingItem.questions) && editingItem.questions.length > 0) {
              setQuestions(editingItem.questions);
              setTotalQuestions(editingItem.questions.length);
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

    const sanitizedQuestions = questions.map((q) => ({
      ...q,
      options: q.options.map((opt, optIndex) => {
        const letter = String.fromCharCode(65 + optIndex);
        const clean = getCleanOptionText(opt.text);
        return {
          ...opt,
          text: clean ? `${letter}: ${clean}` : `${letter}: `,
        };
      }),
    }));

    const examData: ExamModel = {
      id: editingItem?.id || `exam-${Date.now()}`,
      name: examName,
      examCode,
      level,
      durationMinutes,
      totalQuestions: sanitizedQuestions.length || totalQuestions,
      description: description || 'Đề thi thử tiêu chuẩn TELC B2.',
      sections: editingItem?.sections || [
        { name: 'Leseverstehen', questionCount: 20, duration: '45 phút' },
        { name: 'Sprachbausteine', questionCount: 10, duration: '15 phút' },
        { name: 'Hörverstehen', questionCount: 10, duration: '20 phút' },
        { name: 'Schriftlicher Ausdruck', questionCount: 1, duration: '30 phút' },
      ],
      targetScore: editingItem?.targetScore || 225,
      passRate: editingItem?.passRate || '85%',
      questions: sanitizedQuestions,
    };

    if (isEditMode && onUpdateExam) {
      onUpdateExam(examData);
      onShowToast('Cập nhật thành công', `Đã cập nhật bộ đề thi "${examName}".`, 'success');
    } else {
      onAddExam(examData);
      onShowToast('Thành công', `Đã tạo bộ đề thi mới "${examName}".`, 'success');
    }
    onBack();
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
      onShowToast('Thành công', `Đã tạo chuyên đề ngữ pháp mới "${grammarTitle}".`, 'success');
    }
    onBack();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Navigation Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#111827] pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </button>

        <span className="px-3 py-1 bg-[#2563EB] text-white border border-[#111827] rounded-full text-xs font-black brutal-shadow-xs flex items-center gap-1.5 uppercase">
          {type === 'vocab' ? <BookOpen className="w-3.5 h-3.5" /> : type === 'grammar' ? <Brain className="w-3.5 h-3.5" /> : <FileCheck2 className="w-3.5 h-3.5" />}
          {isEditMode ? 'FORM CHỈNH SỬA DỮ LIỆU' : 'FORM TẠO MỚI DỮ LIỆU'} ({type.toUpperCase()})
        </span>
      </div>

      {type === 'vocab' ? (
        <form onSubmit={handleSubmitVocab} className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h2 className="text-xl font-black text-[#111827] font-heading flex items-center gap-2">
            {isEditMode ? <Edit className="w-5 h-5 text-[#2563EB]" /> : <PlusCircle className="w-5 h-5 text-[#2563EB]" />}
            {isEditMode ? `Chỉnh Sửa Từ Vựng: "${editingItem?.word}"` : 'Thêm Từ Vựng Tiếng Đức B2 Mới'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Quán từ (Artikel)</label>
              <select
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              >
                <option value="der">der (Nam)</option>
                <option value="die">die (Nữ)</option>
                <option value="das">das (Trung)</option>
                <option value="">Không có</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-[#111827] mb-1">Từ vựng tiếng Đức *</label>
              <input
                type="text"
                required
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Ví dụ: die Bestätigung"
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Số nhiều (Plural)</label>
              <input
                type="text"
                value={plural}
                onChange={(e) => setPlural(e.target.value)}
                placeholder="Ví dụ: -en (die Bestätigungen)"
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Nghĩa tiếng Việt *</label>
              <input
                type="text"
                required
                value={meaningVi}
                onChange={(e) => setMeaningVi(e.target.value)}
                placeholder="Ví dụ: Sự xác nhận, giấy chứng nhận"
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#111827] mb-1">Ví dụ Tiếng Đức (Beispiel)</label>
            <input
              type="text"
              value={exampleDe}
              onChange={(e) => setExampleDe(e.target.value)}
              placeholder="Ví dụ: Ich bitte um eine schriftliche Bestätigung."
              className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#111827] mb-1">Dịch nghĩa ví dụ (Ví dụ Tiếng Việt)</label>
            <input
              type="text"
              value={exampleVi}
              onChange={(e) => setExampleVi(e.target.value)}
              placeholder="Ví dụ: Tôi xin một xác nhận bằng văn bản."
              className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
            />
          </div>

          <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer uppercase"
            >
              <Save className="w-4 h-4" /> {isEditMode ? 'Lưu Thay Đổi Từ Vựng' : 'Lưu Từ Vựng Mới'}
            </button>
          </div>
        </form>
      ) : type === 'grammar' ? (
        <form onSubmit={handleSubmitGrammar} className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h2 className="text-xl font-black text-[#111827] font-heading flex items-center gap-2">
            {isEditMode ? <Edit className="w-5 h-5 text-[#2563EB]" /> : <PlusCircle className="w-5 h-5 text-[#2563EB]" />}
            {isEditMode ? `Chỉnh Sửa Bài Học Ngữ Pháp: "${editingItem?.title}"` : 'Tạo Chuyên Đề Ngữ Pháp Mới'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Tên chuyên đề ngữ pháp *</label>
              <input
                type="text"
                required
                value={grammarTitle}
                onChange={(e) => setGrammarTitle(e.target.value)}
                placeholder="Ví dụ: Konjunktiv II & Giả định cách"
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Cấp độ *</label>
              <select
                value={grammarLevel}
                onChange={(e) => setGrammarLevel(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              >
                <option value="B2">B2</option>
                <option value="B1">B1</option>
                <option value="A2">A2</option>
                <option value="A1">A1</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#111827] mb-1">Danh mục *</label>
            <input
              type="text"
              required
              value={grammarCategory}
              onChange={(e) => setGrammarCategory(e.target.value)}
              placeholder="Ví dụ: Verben & Modi / Passivstrukturen"
              className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#111827] mb-1">Tóm tắt chuyên đề *</label>
            <textarea
              rows={2}
              required
              value={grammarSummary}
              onChange={(e) => setGrammarSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn lý thuyết và ứng dụng trong bài thi B2..."
              className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#111827] mb-1">Các quy tắc bẫy đề thi (Mỗi quy tắc 1 dòng)</label>
            <textarea
              rows={3}
              value={grammarRules}
              onChange={(e) => setGrammarRules(e.target.value)}
              placeholder="Nhập mỗi quy tắc trên 1 dòng..."
              className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
            />
          </div>

          <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer uppercase"
            >
              <Save className="w-4 h-4" /> {isEditMode ? 'Lưu Thay Đổi Ngữ Pháp' : 'Lưu Bài Học Ngữ Pháp Mới'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitExam} className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h2 className="text-xl font-black text-[#111827] font-heading flex items-center gap-2">
            {isEditMode ? <Edit className="w-5 h-5 text-[#F97316]" /> : <PlusCircle className="w-5 h-5 text-[#F97316]" />}
            {isEditMode ? `Chỉnh Sửa Bộ Đề Thi: "${editingItem?.name}"` : 'Tạo Bộ Đề Thi Mới'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Mã đề thi *</label>
              <input
                type="text"
                required
                value={examCode}
                onChange={(e) => setExamCode(e.target.value)}
                placeholder="Ví dụ: TELC-B2-MOCK-05"
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Trình độ *</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              >
                <option value="TELC C1">TELC C1</option>
                <option value="Goethe C1">Goethe C1</option>
                <option value="TELC B2">TELC B2</option>
                <option value="TELC B1">TELC B1</option>
                <option value="TELC A2">TELC A2</option>
                <option value="TELC A1">TELC A1</option>
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
              <label className="block text-xs font-black text-[#111827] mb-1">Thời gian làm bài (Phút)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] mb-1">Tổng số câu hỏi</label>
              <input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
                className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#111827] mb-1">Mô tả bộ đề thi</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về cấu trúc và yêu cầu của đề thi..."
              className="w-full p-2.5 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
            />
          </div>

          {/* DYNAMIC QUESTION & ANSWER BUILDER SECTION */}
          <div className="pt-6 border-t-2 border-[#111827] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#eff6ff] p-4 border-2 border-[#111827] rounded-xl brutal-shadow-xs">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#2563EB] text-white text-[10px] font-black uppercase border border-[#111827]">
                  TRÌNH TẠO NỘI DUNG CÂU HỎI & ĐÁP ÁN
                </span>
                <h3 className="text-base font-black text-[#111827] mt-1 font-heading">
                  Danh Sách Câu Hỏi & Đáp Án Chi Tiết ({questions.length} câu)
                </h3>
                <p className="text-xs text-[#4b5563]">
                  Nhập tiêu đề câu hỏi, các lựa chọn đáp án và bấm nút 🔘 để đánh dấu đáp án đúng.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 uppercase"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Thêm Câu Hỏi Mới</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="bg-[#f8fafc] border-2 border-[#111827] rounded-2xl p-5 brutal-shadow-xs space-y-3"
                >
                  {/* Question Header & Delete Question Button */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-3 py-1 bg-[#111827] text-white rounded-lg text-xs font-black uppercase font-mono shrink-0">
                      CÂU HỎI {qIndex + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="px-3 py-1 text-[#e11d48] hover:bg-[#ffe4e6] border border-[#111827] rounded-lg cursor-pointer transition-all shrink-0 font-bold text-xs flex items-center gap-1"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa Câu {qIndex + 1}</span>
                    </button>
                  </div>

                  {/* Question Content Input */}
                  <div>
                    <label className="block text-xs font-black text-[#111827] mb-1">
                      Nội dung / Tiêu đề câu hỏi #{qIndex + 1} *
                    </label>
                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                      placeholder={`Ví dụ: Câu ${qIndex + 1}: Chọn đáp án đúng...`}
                      className="w-full p-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  {/* Options List for this Question */}
                  <div className="pl-2 sm:pl-4 space-y-2 border-l-4 border-[#2563EB] pt-1 mt-2">
                    <label className="block text-[11px] font-black text-[#111827] uppercase tracking-wider">
                      Danh sách các lựa chọn đáp án (Tích chọn đáp án đúng):
                    </label>

                    {q.options.map((opt, optIndex) => {
                      const letter = String.fromCharCode(65 + optIndex);
                      const cleanText = getCleanOptionText(opt.text);

                      return (
                        <div key={opt.id} className="flex items-center gap-2">
                          {/* Toggle Correct Answer Button */}
                          <button
                            type="button"
                            onClick={() => handleSetCorrectOption(q.id, opt.id)}
                            className={`px-3 py-2 rounded-xl border-2 text-[11px] font-black cursor-pointer transition-all shrink-0 flex items-center gap-1.5 ${
                              opt.isCorrect
                                ? 'bg-[#059669] text-white border-[#111827] brutal-shadow-xs'
                                : 'bg-white text-[#4b5563] border-[#111827] hover:bg-slate-100'
                            }`}
                            title={opt.isCorrect ? 'Đáp án đúng' : 'Bấm để chọn làm đáp án đúng'}
                          >
                            {opt.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Đáp án Đúng</span>
                              </>
                            ) : (
                              <span>Chọn Đúng</span>
                            )}
                          </button>

                          {/* Option Text Input with A: B: C: D: Badge */}
                          <div className="flex-1 flex items-center bg-white border-2 border-[#111827] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB]">
                            <span className="px-3 py-2 bg-[#eff6ff] text-[#1e40af] border-r-2 border-[#111827] font-black text-xs shrink-0 select-none">
                              {letter}:
                            </span>
                            <input
                              type="text"
                              required
                              value={cleanText}
                              onChange={(e) => handleOptionTextChange(q.id, opt.id, optIndex, e.target.value)}
                              placeholder={`Nhập nội dung đáp án ${letter}...`}
                              className="w-full p-2 text-xs font-bold text-[#111827] focus:outline-none bg-transparent"
                            />
                          </div>

                          {/* Delete Option Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(q.id, opt.id)}
                            className="p-2 text-[#e11d48] hover:bg-[#ffe4e6] border border-[#111827] rounded-xl cursor-pointer transition-all shrink-0"
                            title="Xóa lựa chọn đáp án này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Add Option Button under each question */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleAddOption(q.id)}
                        className="px-3.5 py-2 bg-[#eff6ff] text-[#1e40af] border-2 border-[#111827] rounded-xl text-xs font-black hover:bg-[#dbeafe] transition-all cursor-pointer inline-flex items-center gap-1.5 brutal-shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Thêm đáp án cho Câu {qIndex + 1}</span>
                      </button>
                    </div>
                  </div>

                  {/* DETAILED EXPLANATION SECTION */}
                  <div className="pt-3 border-t-2 border-[#111827]/10 space-y-1.5 mt-3">
                    <label className="block text-xs font-black text-[#111827]">
                      Giải Thích Chi Tiết Đáp Án
                    </label>
                    <textarea
                      rows={3}
                      value={q.explanation || ''}
                      onChange={(e) => handleExplanationChange(q.id, e.target.value)}
                      placeholder="Nhập nội dung giải thích chi tiết đáp án đúng cho câu hỏi này..."
                      className="w-full p-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add Question Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-3.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#ea580c] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Thêm Câu Hỏi Mới (Câu {questions.length + 1})</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer uppercase"
            >
              <Save className="w-4 h-4" /> {isEditMode ? 'Lưu Thay Đổi Đề Thi' : 'Lưu Bộ Đề Thi Mới'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
