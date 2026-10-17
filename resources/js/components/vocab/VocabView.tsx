import React, { useState } from 'react';
import { VocabItem, VocabStatus } from '../../types';
import { BookOpen, Star, Plus, Volume2, Search, Sparkles, CheckCircle, RotateCcw, Filter } from 'lucide-react';
import { AdminVocabView } from '../admin/AdminVocabView';

interface VocabViewProps {
  vocabs: VocabItem[];
  onToggleFavorite: (id: string) => void;
  onChangeStatus: (id: string, status: VocabStatus) => void;
  onOpenAddModal: () => void;
  onOpenFlashcardModal: () => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: 'admin' | 'student';
  onEditVocab?: (vocab: VocabItem) => void;
  onDeleteVocab?: (id: string) => void;
}

const CEFR_LEVELS = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const VocabView: React.FC<VocabViewProps> = ({
  vocabs,
  onToggleFavorite,
  onChangeStatus,
  onOpenAddModal,
  onOpenFlashcardModal,
  onShowToast,
  currentUser = 'student',
  onEditVocab,
  onDeleteVocab,
}) => {
  if (currentUser === 'admin') {
    return (
      <AdminVocabView
        vocabs={vocabs}
        onOpenAddModal={onOpenAddModal}
        onShowToast={onShowToast}
        onEditVocab={onEditVocab}
        onDeleteVocab={onDeleteVocab}
      />
    );
  }

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredVocabs = vocabs.filter((v) => {
    const vLevel = (v.level || 'B2').toUpperCase();
    const matchesLevel = selectedLevel === 'all' || vLevel === selectedLevel.toUpperCase();
    const matchesSearch =
      v.word.toLowerCase().includes(search.toLowerCase()) ||
      v.meaningVi.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const speakGermanText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getLevelBadgeStyle = (level?: string) => {
    const l = (level || 'B2').toUpperCase();
    switch (l) {
      case 'A1':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'A2':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'B1':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'B2':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C1':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'C2':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#e8f1ff] text-[#003882] text-xs font-black border border-[#1c1b1b] uppercase">
            KHO TỪ VỰNG TIẾNG ĐỨC CHUẨN A1 - C2
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1c1b1b] mt-1 font-heading">
            Kho Từ Vựng A1 - C2 & Thẻ Ghi Nhớ Flashcard
          </h2>
          <p className="text-xs text-[#564145] mt-0.5">
            Luyện tập từ vựng chuẩn từ A1 đến C2 với phiên âm chuẩn, ví dụ ngữ cảnh và thẻ lật 3D
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenFlashcardModal}
            className="px-4 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Lật Thẻ Flashcard 3D ({filteredVocabs.length})
          </button>
        </div>
      </div>

      {/* Level Filter Bar (A1 - C2) */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-xl p-3.5 brutal-shadow-xs space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-black text-[#111827] shrink-0 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#2563EB]" /> Cấp độ (CEFR):
          </span>
          {CEFR_LEVELS.map((lvl) => {
            const count = lvl === 'all'
              ? vocabs.length
              : vocabs.filter((v) => (v.level || 'B2').toUpperCase() === lvl).length;
            const isSelected = selectedLevel === lvl;

            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-black whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs'
                    : 'bg-slate-50 text-[#111827] border-[#111827] hover:bg-slate-100'
                }`}
              >
                <span>{lvl === 'all' ? 'Tất Cả (A1 - C2)' : `Cấp Độ ${lvl}`}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="pt-2 border-t border-slate-200">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#564145]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm từ vựng, nghĩa tiếng Việt..."
              className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border-2 border-[#1c1b1b] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>
      </div>

      {/* Vocab Cards Grid */}
      {filteredVocabs.length === 0 ? (
        <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-12 text-center brutal-shadow space-y-3">
          <div className="w-14 h-14 bg-[#eff6ff] border-2 border-[#1c1b1b] rounded-2xl flex items-center justify-center mx-auto text-2xl">
            📚
          </div>
          <h3 className="text-lg font-black text-[#1c1b1b] font-heading">Chưa có từ vựng nào</h3>
          <p className="text-xs text-[#564145] max-w-sm mx-auto">
            Không tìm thấy từ vựng nào cho bộ lọc hiện tại ({selectedLevel.toUpperCase() !== 'ALL' ? `Cấp độ ${selectedLevel.toUpperCase()}` : ''}). Vui lòng chọn cấp độ khác!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVocabs.map((vocab) => (
            <div
              key={vocab.id}
              className="p-5 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-3 relative hover:translate-y-[-2px] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getLevelBadgeStyle(vocab.level)}`}>
                      {vocab.level || 'B2'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#fcf9f8] text-[#564145] border border-[#1c1b1b] text-[10px] font-black">
                      {vocab.pos}
                    </span>
                    {vocab.topic && (
                      <span className="px-2 py-0.5 rounded bg-[#ffe3ea] text-[#800035] border border-[#1c1b1b] text-[10px] font-black">
                        {vocab.topic}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    {vocab.article && (
                      <span className="text-xs font-black text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {vocab.article}
                      </span>
                    )}
                    <h3 className="text-lg font-black text-[#1c1b1b]">
                      {vocab.word}
                    </h3>
                    <button
                      onClick={() => speakGermanText(vocab.word)}
                      className="p-1 hover:bg-slate-100 rounded text-[#2563EB] cursor-pointer"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {vocab.phonetic && (
                    <span className="text-xs text-[#897175] font-mono block mt-0.5">{vocab.phonetic}</span>
                  )}
                  {vocab.plural && (
                    <span className="text-[11px] text-slate-500 font-semibold block">Số nhiều: {vocab.plural}</span>
                  )}
                </div>

                <button
                  onClick={() => onToggleFavorite(vocab.id)}
                  className="p-2 rounded-lg border border-[#1c1b1b] hover:bg-[#fff3d6] cursor-pointer shrink-0"
                >
                  <Star
                    className={`w-4 h-4 ${
                      vocab.isFavorite ? 'fill-[#ffe082] text-[#ffe082]' : 'text-[#897175]'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-lg text-xs space-y-1">
                <p className="font-bold text-[#f36b92]">Nghĩa: {vocab.meaningVi}</p>
                {vocab.exampleDe && <p className="text-[#1c1b1b] font-medium italic">"{vocab.exampleDe}"</p>}
                {vocab.exampleVi && <p className="text-[#564145] text-[11px]">→ {vocab.exampleVi}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
