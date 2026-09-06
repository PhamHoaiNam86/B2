import React, { useState } from 'react';
import { VocabItem, ExamModel } from '../../types';
import { ArrowLeft, PlusCircle, BookOpen, FileCheck2, Save } from 'lucide-react';

interface CreateItemViewProps {
  type: 'vocab' | 'exam';
  onBack: () => void;
  onAddVocab: (vocab: VocabItem) => void;
  onAddExam: (exam: ExamModel) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CreateItemView: React.FC<CreateItemViewProps> = ({
  type,
  onBack,
  onAddVocab,
  onAddExam,
  onShowToast,
}) => {
  // Vocab State
  const [word, setWord] = useState('');
  const [article, setArticle] = useState('der');
  const [plural, setPlural] = useState('');
  const [pos, setPos] = useState('Nomen');
  const [phonetic, setPhonetic] = useState('');
  const [meaningVi, setMeaningVi] = useState('');
  const [exampleDe, setExampleDe] = useState('');
  const [exampleVi, setExampleVi] = useState('');
  const [topic, setTopic] = useState('Arbeit & Beruf');

  // Exam State
  const [examName, setExamName] = useState('');
  const [examCode, setExamCode] = useState('TELC-B2-MOCK-NEW');
  const [level, setLevel] = useState('TELC B2');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [totalQuestions, setTotalQuestions] = useState(45);
  const [description, setDescription] = useState('');

  const handleSubmitVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !meaningVi) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập từ vựng và nghĩa tiếng Việt', 'warning');
      return;
    }

    const newVocab: VocabItem = {
      id: `vocab-${Date.now()}`,
      word,
      article,
      plural,
      pos,
      phonetic,
      meaningVi,
      exampleDe,
      exampleVi,
      topic,
      status: 'learning',
      isFavorite: false,
    };

    onAddVocab(newVocab);
    onShowToast('Thành công', `Đã thêm từ vựng "${word}" vào hệ thống.`, 'success');
    onBack();
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !examCode) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập tên đề thi và mã đề thi', 'warning');
      return;
    }

    const newExam: ExamModel = {
      id: `exam-${Date.now()}`,
      name: examName,
      examCode,
      level,
      durationMinutes,
      totalQuestions,
      description: description || 'Đề thi thử mới được tạo trên hệ thống.',
      sections: [
        { name: 'Leseverstehen', questionCount: 20, duration: '45 phút' },
        { name: 'Sprachbausteine', questionCount: 10, duration: '15 phút' },
        { name: 'Hörverstehen', questionCount: 10, duration: '20 phút' },
        { name: 'Schriftlicher Ausdruck', questionCount: 1, duration: '30 phút' },
      ],
      targetScore: 225,
      passRate: '85%',
    };

    onAddExam(newExam);
    onShowToast('Thành công', `Đã tạo đề thi mới "${examName}".`, 'success');
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
          <span>Quay lại</span>
        </button>

        <span className="px-3 py-1 bg-[#2563EB] text-white border border-[#111827] rounded-full text-xs font-black brutal-shadow-xs flex items-center gap-1.5">
          {type === 'vocab' ? <BookOpen className="w-3.5 h-3.5" /> : <FileCheck2 className="w-3.5 h-3.5" />}
          TRANG THÊM {type === 'vocab' ? 'TỪ VỰNG MỚI' : 'ĐỀ THI MỚI'}
        </span>
      </div>

      {type === 'vocab' ? (
        <form onSubmit={handleSubmitVocab} className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h2 className="text-xl font-black text-[#111827] font-heading flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#2563EB]" />
            Thêm Từ Vựng Tiếng Đức B2 Mới
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
              className="px-6 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Lưu Từ Vựng Mới
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitExam} className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h2 className="text-xl font-black text-[#111827] font-heading flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#F97316]" />
            Tạo Bộ Đề Thi Mới
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
              className="px-6 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Lưu Bộ Đề Thi
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
