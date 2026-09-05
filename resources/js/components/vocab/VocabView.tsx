import React, { useState } from 'react';
import { VocabItem, VocabStatus } from '../../types';
import { BookOpen, Star, Plus, Volume2, Search, Sparkles, CheckCircle, RotateCcw } from 'lucide-react';

interface VocabViewProps {
  vocabs: VocabItem[];
  onToggleFavorite: (id: string) => void;
  onChangeStatus: (id: string, status: VocabStatus) => void;
  onOpenAddModal: () => void;
  onOpenFlashcardModal: () => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const VocabView: React.FC<VocabViewProps> = ({
  vocabs,
  onToggleFavorite,
  onChangeStatus,
  onOpenAddModal,
  onOpenFlashcardModal,
  onShowToast,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const topics = ['all', ...Array.from(new Set(vocabs.map((v) => v.topic)))];

  const filteredVocabs = vocabs.filter((v) => {
    const matchesTopic = selectedTopic === 'all' || v.topic === selectedTopic;
    const matchesSearch =
      v.word.toLowerCase().includes(search.toLowerCase()) ||
      v.meaningVi.toLowerCase().includes(search.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#e8f1ff] text-[#003882] text-xs font-black border border-[#1c1b1b]">
            KHO TỪ VỰNG CHUYÊN ĐỀ TELC B2
          </span>
          <h2 className="text-2xl font-black text-[#1c1b1b] mt-1 font-heading">
            Quản Lý Từ Vựng & Thẻ Ghi Nhớ Flashcard
          </h2>
          <p className="text-xs text-[#564145] mt-0.5">
            Luyện tập từ vựng chuẩn B2 với âm phiên âm chuẩn, ví dụ minh họa và thẻ lật 3D
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenFlashcardModal}
            className="px-4 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Lật Thẻ Flashcard 3D
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Thêm Từ Mới
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedTopic === t
                  ? 'bg-[#1c1b1b] text-white border-[#1c1b1b]'
                  : 'bg-white text-[#1c1b1b] border-[#1c1b1b] hover:bg-[#fcf9f8]'
              }`}
            >
              {t === 'all' ? 'Tất cả chủ đề' : t}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#564145]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm từ vựng B2..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-[#1c1b1b] rounded-xl text-xs font-bold"
          />
        </div>
      </div>

      {/* Vocab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVocabs.map((vocab) => (
          <div
            key={vocab.id}
            className="p-5 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow space-y-3 relative hover:translate-y-[-2px] transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#fcf9f8] text-[#564145] border border-[#1c1b1b] text-[10px] font-black">
                    {vocab.pos}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#ffe3ea] text-[#800035] border border-[#1c1b1b] text-[10px] font-black">
                    {vocab.topic}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#1c1b1b] mt-1">
                  {vocab.word}
                </h3>
                {vocab.phonetic && (
                  <span className="text-xs text-[#897175] font-mono">{vocab.phonetic}</span>
                )}
              </div>

              <button
                onClick={() => onToggleFavorite(vocab.id)}
                className="p-2 rounded-lg border border-[#1c1b1b] hover:bg-[#fff3d6] cursor-pointer"
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
              <p className="text-[#1c1b1b] font-medium italic">"{vocab.exampleDe}"</p>
              <p className="text-[#564145] text-[11px]">→ {vocab.exampleVi}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
