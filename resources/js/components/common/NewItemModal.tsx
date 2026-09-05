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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border-[3px] border-[#1c1b1b] rounded-2xl brutal-shadow-xl p-6 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border-2 border-[#1c1b1b] hover:bg-[#f0edec] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-black text-[#1c1b1b] font-heading flex items-center gap-2">
          {type === 'vocab' ? <BookOpen className="w-5 h-5 text-[#f36b92]" /> : <FileCheck2 className="w-5 h-5 text-[#003882]" />}
          {type === 'vocab' ? 'Thêm Từ Vựng TELC B2 Mới' : 'Tạo Đề Thi Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-bold">
          {type === 'vocab' && (
            <>
              <div>
                <label className="block text-[#564145] mb-1">Từ vựng (Tiếng Đức):</label>
                <input
                  type="text"
                  required
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="VD: die Ausbildungsvergütung"
                  className="w-full p-2.5 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[#564145] mb-1">Từ loại:</label>
                <select
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full p-2.5 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl"
                >
                  <option value="Nomen">Nomen (Danh từ)</option>
                  <option value="Verb">Verb (Động từ)</option>
                  <option value="Adjektiv">Adjektiv (Tính từ)</option>
                  <option value="Redewendung">Redewendung (Thành ngữ / Cấu trúc)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#564145] mb-1">Nghĩa tiếng Việt:</label>
                <input
                  type="text"
                  required
                  value={meaningVi}
                  onChange={(e) => setMeaningVi(e.target.value)}
                  placeholder="VD: Lương học nghề / Trợ cấp đào tạo"
                  className="w-full p-2.5 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[#564145] mb-1">Ví dụ Tiếng Đức (Beispielsatz):</label>
                <input
                  type="text"
                  value={exampleDe}
                  onChange={(e) => setExampleDe(e.target.value)}
                  placeholder="In Deutschland erhalten Auszubildende..."
                  className="w-full p-2.5 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border-2 border-[#1c1b1b] rounded-xl font-bold hover:bg-[#f0edec] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl font-black brutal-shadow-xs hover:bg-[#a83159] cursor-pointer"
            >
              Lưu Vào Hệ Thống
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
