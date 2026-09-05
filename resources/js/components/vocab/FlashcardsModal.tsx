import React, { useState } from 'react';
import { VocabItem } from '../../types';
import { X, ChevronLeft, ChevronRight, RotateCcw, Star, Volume2 } from 'lucide-react';

interface FlashcardsModalProps {
  vocabs: VocabItem[];
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  vocabs,
  isOpen,
  onClose,
  onToggleFavorite,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  if (!isOpen || vocabs.length === 0) return null;

  const currentVocab = vocabs[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % vocabs.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + vocabs.length) % vocabs.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border-[3px] border-[#1c1b1b] rounded-2xl brutal-shadow-xl p-6 relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border-2 border-[#1c1b1b] hover:bg-[#f0edec] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 bg-[#ffe3ea] text-[#800035] border border-[#1c1b1b] rounded-full text-xs font-black mb-4">
          THẺ FLASHCARD {currentIndex + 1} / {vocabs.length}
        </span>

        {/* 3D Flip Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-64 bg-[#fcf9f8] border-[3px] border-[#1c1b1b] rounded-2xl brutal-shadow p-6 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform duration-300 transform active:scale-95"
        >
          {!isFlipped ? (
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded bg-[#f36b92] text-white text-xs font-black uppercase">
                {currentVocab.pos}
              </span>
              <h3 className="text-2xl font-black text-[#1c1b1b] font-heading">
                {currentVocab.word}
              </h3>
              {currentVocab.phonetic && (
                <p className="text-xs font-mono text-[#897175]">{currentVocab.phonetic}</p>
              )}
              <span className="text-[11px] font-bold text-[#f36b92] block pt-2">
                (Nhấn vào thẻ để lật xem nghĩa)
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-lg font-black text-[#003882] font-heading">
                {currentVocab.meaningVi}
              </h4>
              <p className="text-xs font-bold text-[#1c1b1b] italic">"{currentVocab.exampleDe}"</p>
              <p className="text-[11px] text-[#564145]">→ {currentVocab.exampleVi}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="p-3 bg-white border-2 border-[#1c1b1b] rounded-xl brutal-shadow-xs hover:bg-[#f0edec] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2.5 bg-[#ffe082] text-[#3e2723] border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Lật Thẻ
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl brutal-shadow-xs hover:bg-[#a83159] cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
