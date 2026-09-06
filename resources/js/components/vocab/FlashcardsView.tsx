import React, { useState } from 'react';
import { VocabItem } from '../../types';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Star, Volume2, Sparkles, BookOpen } from 'lucide-react';

interface FlashcardsViewProps {
  vocabs: VocabItem[];
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  vocabs,
  onBack,
  onToggleFavorite,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

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

  const currentVocab = vocabs[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % vocabs.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + vocabs.length) % vocabs.length);
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentVocab.word);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#111827] pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Kho Từ Vựng</span>
        </button>

        <span className="px-3 py-1 bg-[#2563EB] text-white border border-[#111827] rounded-full text-xs font-black brutal-shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
          THẺ FLASHCARD 3D ({currentIndex + 1} / {vocabs.length})
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-3 border-2 border-[#111827] rounded-full overflow-hidden">
        <div
          className="bg-[#2563EB] h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / vocabs.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div className="relative flex justify-center my-8">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-80 bg-white border-[3px] border-[#111827] rounded-3xl brutal-shadow-lg p-8 flex flex-col items-center justify-between text-center cursor-pointer select-none transition-all duration-300 hover:scale-[1.01]"
        >
          {/* Top Card Controls */}
          <div className="w-full flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-[#eff6ff] text-[#1e40af] border border-[#111827] text-xs font-black uppercase">
              {currentVocab.topic || 'Tiếng Đức B2'}
            </span>
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

          {/* Card Body */}
          {!isFlipped ? (
            <div className="space-y-3 my-auto">
              <span className="px-2.5 py-0.5 rounded bg-[#2563EB] text-white text-xs font-black uppercase">
                {currentVocab.article ? `${currentVocab.article} ` : ''}{currentVocab.pos}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] font-heading">
                {currentVocab.word}
              </h2>
              {currentVocab.plural && (
                <p className="text-xs font-semibold text-[#4b5563]">Số nhiều: {currentVocab.plural}</p>
              )}
              {currentVocab.phonetic && (
                <p className="text-xs font-mono text-[#2563EB]">{currentVocab.phonetic}</p>
              )}
              <span className="text-xs font-bold text-[#F97316] block pt-3 animate-pulse">
                👇 Nhấn vào thẻ để lật xem giải nghĩa & ví dụ
              </span>
            </div>
          ) : (
            <div className="space-y-4 my-auto">
              <h3 className="text-2xl font-black text-[#059669] font-heading">
                🇻🇳 {currentVocab.meaningVi}
              </h3>
              <div className="p-3 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#111827] italic">🇩🇪 "{currentVocab.exampleDe}"</p>
                <p className="text-[#4b5563]">🇻🇳 {currentVocab.exampleVi}</p>
              </div>
            </div>
          )}

          {/* Bottom hint */}
          <span className="text-[10px] font-bold text-[#6b7280]">
            Mặt thẻ: {isFlipped ? 'Sau (Tiếng Việt & Ví dụ)' : 'Trước (Từ vựng Tiếng Đức)'}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          className="px-5 py-3 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" /> Từ Trước
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-6 py-3 bg-[#ffe082] text-[#3e2723] border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#fdd835] cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Lật Thẻ Xem Nghĩa
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-3 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#1d4ed8] cursor-pointer flex items-center gap-2"
        >
          Từ Tiếp <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
