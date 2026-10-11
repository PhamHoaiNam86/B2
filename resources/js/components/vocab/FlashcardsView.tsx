import React, { useState } from 'react';
import { VocabItem } from '../../types';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Star, Volume2, Sparkles, BookOpen, Filter } from 'lucide-react';

interface FlashcardsViewProps {
  vocabs: VocabItem[];
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
}

const CEFR_LEVELS = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  vocabs,
  onBack,
  onToggleFavorite,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const activeVocabs = vocabs.filter(
    (v) => selectedLevel === 'all' || (v.level || 'B2').toUpperCase() === selectedLevel.toUpperCase()
  );

  const handleSelectLevel = (lvl: string) => {
    setSelectedLevel(lvl);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (vocabs.length === 0) {
    return (
      <div className="p-8 text-center bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
        <BookOpen className="w-12 h-12 text-[#2563EB] mx-auto" />
        <h3 className="text-xl font-black font-heading text-[#111827]">Chưa có từ vựng nào</h3>
        <p className="text-xs text-[#4b5563]">Vui lòng thêm từ vựng mới vào kho trước khi luyện Flashcard.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-bold brutal-shadow-xs"
        >
          Quay lại Kho Từ Vựng
        </button>
      </div>
    );
  }

  const currentVocab = activeVocabs[currentIndex] || activeVocabs[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (activeVocabs.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % activeVocabs.length);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (activeVocabs.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + activeVocabs.length) % activeVocabs.length);
    }
  };

  const playAudio = () => {
    if (currentVocab && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentVocab.word);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#111827] pb-4 gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Kho Từ Vựng</span>
        </button>

        <span className="px-3 py-1 bg-[#2563EB] text-white border border-[#111827] rounded-full text-xs font-black brutal-shadow-xs flex items-center gap-1.5 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          THẺ FLASHCARD 3D ({activeVocabs.length > 0 ? currentIndex + 1 : 0} / {activeVocabs.length})
        </span>
      </div>

      {/* Level Filter Bar */}
      <div className="bg-white border-2 border-[#111827] rounded-xl p-3 brutal-shadow-xs flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <span className="text-xs font-black text-[#111827] shrink-0 uppercase flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#2563EB]" /> Cấp độ:
        </span>
        {CEFR_LEVELS.map((lvl) => {
          const count = lvl === 'all'
            ? vocabs.length
            : vocabs.filter((v) => (v.level || 'B2').toUpperCase() === lvl).length;
          const isSelected = selectedLevel === lvl;

          return (
            <button
              key={lvl}
              onClick={() => handleSelectLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg border-2 text-xs font-black whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs'
                  : 'bg-slate-50 text-[#111827] border-[#111827] hover:bg-slate-100'
              }`}
            >
              <span>{lvl === 'all' ? 'Tất cả (A1 - C2)' : `Cấp độ ${lvl}`}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {activeVocabs.length === 0 ? (
        <div className="p-12 text-center bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-3">
          <div className="text-3xl">📚</div>
          <h4 className="text-base font-black text-[#111827]">Không có thẻ từ vựng cấp độ {selectedLevel.toUpperCase()}</h4>
          <p className="text-xs text-slate-500">Vui lòng chọn cấp độ khác để tiếp tục luyện tập.</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-3 border-2 border-[#111827] rounded-full overflow-hidden">
            <div
              className="bg-[#2563EB] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeVocabs.length) * 100}%` }}
            />
          </div>

          {/* 3D Flip Card Container */}
          <div className="relative flex justify-center my-6">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-xl min-h-[320px] bg-white border-[3px] border-[#111827] rounded-3xl brutal-shadow-lg p-6 sm:p-8 flex flex-col items-center justify-between text-center cursor-pointer select-none transition-all duration-300 hover:scale-[1.01]"
            >
              {/* Top Card Controls */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 border border-[#111827] text-xs font-black uppercase">
                    {currentVocab.level || 'B2'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#eff6ff] text-[#1e40af] border border-[#111827] text-xs font-black uppercase">
                    {currentVocab.topic || 'Chủ đề'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio();
                    }}
                    className="p-2 bg-amber-100 border border-[#111827] rounded-lg hover:bg-amber-200 transition-colors"
                    title="Phát âm Tiếng Đức"
                  >
                    <Volume2 className="w-4 h-4 text-amber-800" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(currentVocab.id);
                    }}
                    className="p-2 bg-red-50 border border-[#111827] rounded-lg hover:bg-red-100 transition-colors"
                    title="Yêu thích"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        currentVocab.isFavorite ? 'fill-[#e11d48] text-[#e11d48]' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Card Face: Front or Back */}
              {!isFlipped ? (
                <div className="space-y-3 my-auto py-4">
                  <span className="px-3 py-1 rounded bg-[#f36b92] text-white text-xs font-black uppercase inline-block">
                    {currentVocab.pos}
                  </span>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {currentVocab.article && (
                      <span className="text-xl sm:text-2xl font-black text-[#2563EB]">
                        {currentVocab.article}
                      </span>
                    )}
                    <h2 className="text-3xl sm:text-4xl font-black text-[#111827] font-heading">
                      {currentVocab.word}
                    </h2>
                  </div>
                  {currentVocab.phonetic && (
                    <p className="text-sm font-mono text-[#6b7280]">{currentVocab.phonetic}</p>
                  )}
                  {currentVocab.plural && (
                    <p className="text-xs text-slate-500 font-semibold">Số nhiều: {currentVocab.plural}</p>
                  )}
                  <span className="text-xs font-bold text-[#F97316] block pt-3 animate-pulse">
                    💡 Nhấp chuột để lật xem nghĩa & câu ví dụ
                  </span>
                </div>
              ) : (
                <div className="space-y-4 my-auto py-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Ý nghĩa tiếng Việt</span>
                    <h3 className="text-2xl font-black text-[#059669] font-heading mt-1">
                      {currentVocab.meaningVi}
                    </h3>
                  </div>

                  {currentVocab.exampleDe && (
                    <div className="p-3 bg-[#f8fafc] border border-slate-300 rounded-xl space-y-1 text-left">
                      <p className="text-xs font-bold text-[#111827] italic">
                        🇩🇪 "{currentVocab.exampleDe}"
                      </p>
                      {currentVocab.exampleVi && (
                        <p className="text-xs text-slate-600 font-medium">
                          🇻🇳 {currentVocab.exampleVi}
                        </p>
                      )}
                    </div>
                  )}

                  <span className="text-xs font-bold text-slate-400 block">
                    🔄 Nhấp lại để quay về mặt trước
                  </span>
                </div>
              )}

              {/* Bottom Instructions */}
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Thẻ {currentIndex + 1} / {activeVocabs.length}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="px-5 py-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Từ Trước
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#1d4ed8] transition-all flex items-center gap-2 cursor-pointer font-heading"
            >
              <RotateCcw className="w-4 h-4" /> Lật Thẻ (Xem Nghĩa)
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              Từ Tiếp <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
