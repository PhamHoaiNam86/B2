import React from 'react';
import { GrammarTopic } from '../../types';
import { Brain, CheckCircle, Play, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import { AdminGrammarView } from '../admin/AdminGrammarView';

interface GrammarViewProps {
  topics: GrammarTopic[];
  onSelectTopic: (topic: GrammarTopic) => void;
  onOpenDiagnosticTest: () => void;
  onOpenTrapQuiz: () => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: 'admin' | 'student';
  onAddNewTopic?: () => void;
  onEditTopic?: (topic: GrammarTopic) => void;
  onDeleteTopic?: (id: string) => void;
}

export const GrammarView: React.FC<GrammarViewProps> = ({
  topics,
  onSelectTopic,
  onOpenDiagnosticTest,
  onOpenTrapQuiz,
  onShowToast,
  currentUser = 'admin',
  onAddNewTopic,
  onEditTopic,
  onDeleteTopic,
}) => {
  if (currentUser === 'admin') {
    return (
      <AdminGrammarView
        topics={topics}
        onSelectTopic={onSelectTopic}
        onShowToast={onShowToast}
        onAddNewTopic={onAddNewTopic}
        onEditTopic={onEditTopic}
        onDeleteTopic={onDeleteTopic}
      />
    );
  }
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#fff8e7] border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#ffe082] text-[#3e2723] text-xs font-black border border-[#1c1b1b]">
            CHUYÊN ĐỀ NGỮ PHÁP TELC B2
          </span>
          <h2 className="text-2xl font-black text-[#1c1b1b] mt-1 font-heading">
            Hệ Thống Ngữ Pháp Tiếng Đức B2 & Luyện Bẫy Đề Thi
          </h2>
          <p className="text-xs text-[#564145] mt-0.5">
            Tổng hợp cấu trúc câu ghép, mệnh đề quan hệ, Konjunktiv II và các dạng bài điền từ bẫy trong Sprachbausteine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenDiagnosticTest}
            className="px-4 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Test Chẩn Đoán B2
          </button>
          <button
            onClick={onOpenTrapQuiz}
            className="px-4 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-white" /> Luyện Bẫy Đề Thi
          </button>
        </div>
      </div>

      {/* Grammar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e8f1ff] text-[#003882] text-[10px] font-black border border-[#1c1b1b]">
                  {topic.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-black border border-emerald-400">
                  {topic.badgeLabel}
                </span>
              </div>

              <h3 className="text-base font-black text-[#1c1b1b] font-heading">
                {topic.title}
              </h3>
              <p className="text-xs text-[#564145] leading-relaxed line-clamp-3">
                {topic.summary}
              </p>
            </div>

            {/* Progress bar & Action */}
            <div className="space-y-3 border-t-2 border-[#1c1b1b]/10 pt-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#564145]">Tiến độ:</span>
                <span className="text-[#f36b92] font-black">{topic.progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#f0edec] rounded-full overflow-hidden border border-[#1c1b1b]">
                <div
                  className="h-full bg-[#f36b92]"
                  style={{ width: `${topic.progress}%` }}
                />
              </div>

              <button
                onClick={() => onSelectTopic(topic)}
                className="w-full py-2.5 bg-white border-2 border-[#1c1b1b] rounded-xl text-xs font-black hover:bg-[#f0edec] brutal-shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-[#f36b92]" /> Xem Lý Thuyết & Bài Tập
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
