import React, { useState } from 'react';
import { VocabItem, ExamModel, GrammarTopic } from '../../types';
import { ArrowLeft, PlusCircle, Edit, BookOpen, FileCheck2, Brain, Save } from 'lucide-react';

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
  const [totalQuestions, setTotalQuestions] = useState(editingItem?.totalQuestions || 45);
  const [description, setDescription] = useState(editingItem?.description || '');

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

    const examData: ExamModel = {
      id: editingItem?.id || `exam-${Date.now()}`,
      name: examName,
      examCode,
      level,
      durationMinutes,
      totalQuestions,
      description: description || 'Đề thi thử tiêu chuẩn TELC B2.',
      sections: editingItem?.sections || [
        { name: 'Leseverstehen', questionCount: 20, duration: '45 phút' },
        { name: 'Sprachbausteine', questionCount: 10, duration: '15 phút' },
        { name: 'Hörverstehen', questionCount: 10, duration: '20 phút' },
        { name: 'Schriftlicher Ausdruck', questionCount: 1, duration: '30 phút' },
      ],
      targetScore: editingItem?.targetScore || 225,
      passRate: editingItem?.passRate || '85%',
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
