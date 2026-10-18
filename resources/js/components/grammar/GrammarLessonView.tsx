import React, { useState } from 'react';
import { GrammarTopic } from '../../types';
import { ArrowLeft, CheckCircle, Brain, BookOpen, Sparkles, Edit3, FileText, Check } from 'lucide-react';

interface GrammarLessonViewProps {
  topic: GrammarTopic;
  onBack: () => void;
  onCompleteTopic: (id: string) => void;
  onEditTopic?: (topic: GrammarTopic) => void;
}

export const GrammarLessonView: React.FC<GrammarLessonViewProps> = ({
  topic,
  onBack,
  onCompleteTopic,
  onEditTopic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'theory' | 'quiz'>('theory');

  // Filter out dummy/empty rules
  const validRulePoints = Array.isArray(topic.rulePoints)
    ? topic.rulePoints.filter((r) => r && r.trim() !== '' && r.trim() !== 'Quy tắc cơ bản')
    : [];

  // Filter out dummy/empty examples
  const validExamples = Array.isArray(topic.examples)
    ? topic.examples.filter(
        (ex) => ex.de && ex.de.trim() !== '' && ex.de.trim() !== 'Beispiel Sätze auf Deutsch'
      )
    : [];

  const hasDetailContent = Boolean(topic.content && topic.content.trim());

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Navigation Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#111827] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Chuyên Đề Ngữ Pháp</span>
          </button>

          {onEditTopic && (
            <button
              onClick={() => onEditTopic(topic)}
              className="px-3.5 py-2 bg-amber-50 text-amber-900 border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Chỉnh Sửa Bài Này</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-black uppercase border border-[#111827]">
            CẤP ĐỘ {topic.level || 'B2'}
          </span>
          <span className="text-xs font-bold text-[#4b5563] hidden sm:inline bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            {topic.category}
          </span>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] font-heading tracking-tight">
          {topic.title}
        </h1>
        {topic.summary && (
          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed font-medium">
            {topic.summary}
          </p>
        )}
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
          <span>Lý Thuyết & Cấu Trúc Chi Tiết</span>
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
          <span>Bài Tập Củng Cố Nhanh</span>
        </button>
      </div>

      {/* View Content */}
      {activeSubTab === 'theory' ? (
        <div className="space-y-6">
          {/* 1. NỘI DUNG BÀI HỌC CHI TIẾT (LÝ THUYẾT / BÀI GIẢNG ĐÃ NHẬP) */}
          {hasDetailContent && (
            <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                <h3 className="text-base font-black text-[#111827] font-heading flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                  Nội Dung Bài Học & Lý Thuyết Chi Tiết:
                </h3>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Tài Liệu Học Tập
                </span>
              </div>
              <div className="text-xs sm:text-sm text-[#111827] leading-relaxed whitespace-pre-wrap font-sans font-medium bg-[#f8fafc] p-5 rounded-xl border-2 border-[#111827]/10">
                {topic.content}
              </div>
            </div>
          )}

          {/* 2. CẤU TRÚC CẦN GHI NHỚ (NẾU CÓ) */}
          {validRulePoints.length > 0 && (
            <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-3">
              <h3 className="text-base font-black text-[#2563EB] font-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F97316]" />
                Cấu Trúc Cần Ghi Nhớ (Regeln):
              </h3>
              <ul className="space-y-2.5 text-xs text-[#111827] font-semibold">
                {validRulePoints.map((pt, idx) => (
                  <li key={idx} className="p-3 bg-[#f8fafc] border-2 border-[#111827]/10 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. VÍ DỤ MINH HỌA (NẾU CÓ) */}
          {validExamples.length > 0 && (
            <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-3">
              <h3 className="text-base font-black text-[#059669] font-heading flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#059669]" />
                Ví Dụ Minh Họa (Beispiele):
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {validExamples.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs space-y-1">
                    <p className="font-bold text-[#111827] text-sm">🇩🇪 {ex.de}</p>
                    {ex.vi && <p className="text-[#4b5563]">🇻🇳 {ex.vi}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. FALLBACK NẾU CHƯA CÓ NỘI DUNG NÀO */}
          {!hasDetailContent && validRulePoints.length === 0 && validExamples.length === 0 && (
            <div className="p-8 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center space-y-3">
              <BookOpen className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="text-sm font-black text-amber-950 uppercase font-heading">
                Chuyên đề này đang được cập nhật nội dung
              </h4>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                Hiện chưa có văn bản lý thuyết chi tiết cho bài học này. Bạn có thể bấm nút "Chỉnh Sửa Bài Này" ở trên để bổ sung lý thuyết và ví dụ.
              </p>
              {onEditTopic && (
                <button
                  onClick={() => onEditTopic(topic)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black border-2 border-[#111827] brutal-shadow-xs hover:bg-amber-600 transition-all cursor-pointer"
                >
                  Bổ sung nội dung ngay
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#2563EB]" />
            Bài Tập Luyện Tập & Củng Cố Nhanh
          </h3>
          <div className="p-4 bg-[#f8fafc] border-2 border-[#111827] rounded-xl space-y-3 text-xs">
            <p className="font-bold text-[#111827] text-sm">
              "Ich wäre Ihnen sehr dankbar, _____ Sie mir die Bestätigung zusenden könnten."
            </p>
            <div className="space-y-2">
              {['wenn', 'dass', 'obwohl', 'weil'].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 p-3 bg-white border-2 border-[#111827] rounded-xl cursor-pointer font-bold hover:bg-[#eff6ff] transition-all"
                >
                  <input type="radio" name="grammar-quiz" value={opt} className="accent-[#2563EB]" />
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
