import React, { useState } from 'react';
import { GrammarTopic } from '../../types';
import { ArrowLeft, CheckCircle, Brain, BookOpen, Send, Sparkles } from 'lucide-react';

interface GrammarLessonViewProps {
  topic: GrammarTopic;
  onBack: () => void;
  onCompleteTopic: (id: string) => void;
}

export const GrammarLessonView: React.FC<GrammarLessonViewProps> = ({
  topic,
  onBack,
  onCompleteTopic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'theory' | 'quiz'>('theory');

  return (
    <div className="space-y-6 w-full">
      {/* Navigation Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#111827] pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Chuyên Đề Ngữ Pháp</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-black uppercase border border-[#111827]">
            NGỮ PHÁP {topic.level}
          </span>
          <span className="text-xs font-bold text-[#4b5563] hidden sm:inline">{topic.category}</span>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-2">
        <h1 className="text-2xl font-black text-[#111827] font-heading">
          {topic.title}
        </h1>
        <p className="text-xs text-[#4b5563] leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Sub Tabs Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveSubTab('theory')}
          className={`px-5 py-2.5 rounded-xl border-2 text-xs font-black cursor-pointer flex items-center gap-2 transition-all ${
            activeSubTab === 'theory'
              ? 'bg-[#111827] text-white border-[#111827] brutal-shadow-xs'
              : 'bg-white text-[#111827] border-[#111827] hover:bg-[#f8fafc]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#F97316]" />
          <span>Lý Thuyết & Cấu Trúc Bẫy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`px-5 py-2.5 rounded-xl border-2 text-xs font-black cursor-pointer flex items-center gap-2 transition-all ${
            activeSubTab === 'quiz'
              ? 'bg-[#111827] text-white border-[#111827] brutal-shadow-xs'
              : 'bg-white text-[#111827] border-[#111827] hover:bg-[#f8fafc]'
          }`}
        >
          <Brain className="w-4 h-4 text-[#2563EB]" />
          <span>Bài Tập Củng Cố Ngay</span>
        </button>
      </div>

      {/* View Content */}
      {activeSubTab === 'theory' ? (
        <div className="space-y-5">
          {/* Rules Section */}
          <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-3">
            <h3 className="text-base font-black text-[#2563EB] font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F97316]" />
              Cấu Trúc Cần Ghi Nhớ (Regeln):
            </h3>
            <ul className="space-y-2.5 text-xs text-[#111827] font-semibold">
              {topic.rulePoints.map((pt, idx) => (
                <li key={idx} className="p-3 bg-[#f8fafc] border-2 border-[#111827]/10 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples Section */}
          <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-3">
            <h3 className="text-base font-black text-[#059669] font-heading flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#059669]" />
              Ví Dụ Minh Họa ChuẩnTELC (Beispiele):
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {topic.examples.map((ex, idx) => (
                <div key={idx} className="p-4 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs space-y-1">
                  <p className="font-bold text-[#111827]">🇩🇪 {ex.de}</p>
                  <p className="text-[#4b5563]">🇻🇳 {ex.vi}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading">
            Bài Tập Luyện Tập Nhanh
          </h3>
          <div className="p-4 bg-[#f8fafc] border-2 border-[#111827] rounded-xl space-y-3 text-xs">
            <p className="font-bold text-[#111827]">
              "Ich wäre Ihnen sehr dankbar, _____ Sie mir die Bestätigung zusenden könnten."
            </p>
            <div className="space-y-2">
              {['wenn', 'dass', 'obwohl', 'weil'].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 p-3 bg-white border border-[#111827] rounded-xl cursor-pointer font-bold hover:bg-[#eff6ff]"
                >
                  <input type="radio" name="grammar-quiz" value={opt} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Complete Action Footer */}
      <div className="pt-4 border-t-2 border-[#111827] flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-white border-2 border-[#111827] rounded-xl text-xs font-bold hover:bg-[#f8fafc] cursor-pointer"
        >
          Quay lại
        </button>
        <button
          onClick={() => {
            onCompleteTopic(topic.id);
            onBack();
          }}
          className="px-6 py-3 bg-[#059669] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#047857] cursor-pointer flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Hoàn Thành Bài Học & Lưu Tiến Độ
        </button>
      </div>
    </div>
  );
};
