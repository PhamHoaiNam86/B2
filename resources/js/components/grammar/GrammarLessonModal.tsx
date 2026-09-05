import React, { useState } from 'react';
import { GrammarTopic } from '../../types';
import { X, CheckCircle, Brain, BookOpen, Send } from 'lucide-react';

interface GrammarLessonModalProps {
  topic: GrammarTopic | null;
  onClose: () => void;
  onCompleteTopic: (id: string) => void;
}

export const GrammarLessonModal: React.FC<GrammarLessonModalProps> = ({
  topic,
  onClose,
  onCompleteTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz'>('theory');

  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border-[3px] border-[#1c1b1b] rounded-2xl brutal-shadow-xl p-6 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border-2 border-[#1c1b1b] hover:bg-[#f0edec] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#f36b92] text-white text-[10px] font-black uppercase border border-[#1c1b1b]">
            NGỮ PHÁP {topic.level}
          </span>
          <span className="text-xs font-bold text-[#897175]">{topic.category}</span>
        </div>

        <h2 className="text-xl font-black text-[#1c1b1b] font-heading mb-4">
          {topic.title}
        </h2>

        {/* Tab Header */}
        <div className="flex items-center gap-2 border-b-2 border-[#1c1b1b] pb-2 mb-4">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-1.5 rounded-xl border-2 text-xs font-black cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-[#1c1b1b] text-white border-[#1c1b1b]'
                : 'bg-white text-[#1c1b1b] border-transparent hover:border-[#1c1b1b]'
            }`}
          >
            📖 Lý Thuyết & Quy Tắc
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-xl border-2 text-xs font-black cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-[#1c1b1b] text-white border-[#1c1b1b]'
                : 'bg-white text-[#1c1b1b] border-transparent hover:border-[#1c1b1b]'
            }`}
          >
            ✏️ Bài Tập Củng Cố
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'theory' ? (
            <div className="space-y-4 text-xs sm:text-sm text-[#1c1b1b]">
              <div className="p-4 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl space-y-2">
                <h4 className="font-black text-[#f36b92]">Cấu Trúc Cần Ghi Nhớ (Regeln):</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#564145] font-medium">
                  {topic.rulePoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#e8f1ff] border-2 border-[#1c1b1b] rounded-xl space-y-2">
                <h4 className="font-black text-[#003882]">Ví Dụ Minh Họa (Beispiele):</h4>
                <div className="space-y-2">
                  {topic.examples.map((ex, idx) => (
                    <div key={idx} className="p-2 bg-white border border-[#1c1b1b] rounded text-xs">
                      <p className="font-bold text-[#1c1b1b]">🇩🇪 {ex.de}</p>
                      <p className="text-[#564145]">🇻🇳 {ex.vi}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#fff3d6] border-2 border-[#1c1b1b] rounded-xl space-y-3">
                <h4 className="font-black text-[#734c00]">
                  Câu hỏi 1: Điền từ thích hợp vào chỗ trống
                </h4>
                <p className="font-bold text-[#1c1b1b]">
                  "Ich wäre Ihnen sehr dankbar, _____ Sie mir die Bestätigung zusenden könnten."
                </p>
                <div className="space-y-2">
                  {['wenn', 'dass', 'obwohl', 'weil'].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 p-2 bg-white border border-[#1c1b1b] rounded cursor-pointer font-bold"
                    >
                      <input type="radio" name="grammar-quiz" value={opt} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t-2 border-[#1c1b1b] flex items-center justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border-2 border-[#1c1b1b] rounded-xl text-xs font-bold hover:bg-[#f0edec] cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onCompleteTopic(topic.id);
              onClose();
            }}
            className="px-5 py-2 bg-[#0d5225] text-white border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#083818] cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Hoàn Thành Bài Học
          </button>
        </div>
      </div>
    </div>
  );
};
