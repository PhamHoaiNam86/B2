import React, { useState } from 'react';
import { VocabItem, ExamModel } from '../../types';
import { X, Plus, BookOpen, FileCheck2 } from 'lucide-react';

interface NewItemModalProps {
  isOpen: boolean;
  type: 'vocab' | 'exam';
  onClose: () => void;
  onAddVocab: (v: VocabItem) => void;
  onAddExam: (e: ExamModel) => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  type,
  onClose,
  onAddVocab,
  onAddExam,
  onShowToast,
}) => {
  const [word, setWord] = useState('');
  const [meaningVi, setMeaningVi] = useState('');
  const [exampleDe, setExampleDe] = useState('');
  const [exampleVi, setExampleVi] = useState('');
  const [topic, setTopic] = useState('Arbeit & Beruf');
  const [pos, setPos] = useState('Nomen');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'vocab') {
      if (!word || !meaningVi) return;
      onAddVocab({
        id: `v-${Date.now()}`,
        word,
        pos,
        meaningVi,
        exampleDe: exampleDe || 'Beispiel Satz',
        exampleVi: exampleVi || 'Ví dụ minh họa',
        topic,
        status: 'learning',
        isFavorite: false,
      });
      onShowToast('Thêm từ vựng mới', `Đã thêm "${word}" vào kho từ vựng B2!`, 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-black text-[#111827] font-heading flex items-center gap-2">
          {type === 'vocab' ? <BookOpen className="w-5 h-5 text-[#2563EB]" /> : <FileCheck2 className="w-5 h-5 text-[#2563EB]" />}
          {type === 'vocab' ? 'Thêm Từ Vựng TELC B2 Mới' : 'Tạo Đề Thi Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-bold">
          {type === 'vocab' && (
            <>
              <div>
                <label className="block text-slate-600 mb-1">Từ vựng (Tiếng Đức):</label>
                <input
                  type="text"
                  required
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="VD: die Ausbildungsvergütung"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-xl outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Từ loại:</label>
                <select
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-xl outline-hidden font-medium"
                >
                  <option value="Nomen">Nomen (Danh từ)</option>
                  <option value="Verb">Verb (Động từ)</option>
                  <option value="Adjektiv">Adjektiv (Tính từ)</option>
                  <option value="Redewendung">Redewendung (Thành ngữ / Cấu trúc)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Nghĩa tiếng Việt:</label>
                <input
                  type="text"
                  required
                  value={meaningVi}
                  onChange={(e) => setMeaningVi(e.target.value)}
                  placeholder="VD: Lương học nghề / Trợ cấp đào tạo"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-xl outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Ví dụ Tiếng Đức (Beispielsatz):</label>
                <input
                  type="text"
                  value={exampleDe}
                  onChange={(e) => setExampleDe(e.target.value)}
                  placeholder="In Deutschland erhalten Auszubildende..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-xl outline-hidden font-medium"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#ea580c] cursor-pointer shadow-md shadow-orange-500/20"
            >
              Lưu Vào Hệ Thống
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
