import React, { useState } from 'react';
import { GrammarTopic } from '../../types';
import { Brain, CheckCircle, Play, Sparkles, BookOpen, AlertTriangle, Search, Filter } from 'lucide-react';
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

const getLevelBadgeClass = (lvl?: string) => {
  switch ((lvl || '').toUpperCase()) {
    case 'A1':
      return 'bg-emerald-100 text-emerald-800 border-emerald-500';
    case 'A2':
      return 'bg-teal-100 text-teal-800 border-teal-500';
    case 'B1':
      return 'bg-blue-100 text-blue-800 border-blue-500';
    case 'B2':
      return 'bg-rose-100 text-rose-800 border-rose-500';
    case 'C1':
      return 'bg-purple-100 text-purple-800 border-purple-500';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-500';
  }
};

export const GrammarView: React.FC<GrammarViewProps> = ({
  topics,
  onSelectTopic,
  onOpenDiagnosticTest,
  onOpenTrapQuiz,
  onShowToast,
  currentUser = 'student',
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

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];

  const filteredTopics = topics.filter((t) => {
    const tLevel = (t.level || 'B2').toUpperCase();
    const matchesLevel = selectedLevel === 'all' || tLevel === selectedLevel.toUpperCase();
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#fff8e7] border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#ffe082] text-[#3e2723] text-xs font-black border border-[#1c1b1b]">
            CHUYÊN ĐỀ NGỮ PHÁP TIẾNG ĐỨC A1 - C1
          </span>
          <h2 className="text-2xl font-black text-[#1c1b1b] mt-1 font-heading">
            Hệ Thống Ngữ Pháp Tiếng Đức & Luyện Đề Thi
          </h2>
          <p className="text-xs text-[#564145] mt-0.5">
            Tổng hợp lý thuyết ngữ pháp từ A1 đến C1, cấu trúc câu ghép, mệnh đề quan hệ và bài tập củng cố
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenDiagnosticTest}
            className="px-4 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Test Chẩn Đoán
          </button>
          <button
            onClick={onOpenTrapQuiz}
            className="px-4 py-2.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-white" /> Luyện Bẫy Đề Thi
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-4 brutal-shadow space-y-3">
        {/* CEFR Level Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <span className="text-xs font-black text-[#111827] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#2563EB]" /> Phân loại trình độ:
          </span>
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const count = lvl === 'all'
              ? topics.length
              : topics.filter((t) => (t.level || 'B2').toUpperCase() === lvl.toUpperCase()).length;
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
                <span>{lvl === 'all' ? 'Tất Cả (A1 - C1)' : `Cấp Độ ${lvl}`}</span>
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
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#564145]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm chuyên đề ngữ pháp, danh mục, nội dung tóm tắt..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border-2 border-[#1c1b1b] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Grammar Cards Grid */}
      {filteredTopics.length === 0 ? (
        <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-12 text-center brutal-shadow space-y-3">
          <div className="w-14 h-14 bg-[#fff8e7] border-2 border-[#1c1b1b] rounded-2xl flex items-center justify-center mx-auto text-2xl">
            🧠
          </div>
          <h3 className="text-lg font-black text-[#1c1b1b] font-heading">Không tìm thấy chuyên đề ngữ pháp phù hợp</h3>
          <p className="text-xs text-[#564145] max-w-sm mx-auto">
            Không có chuyên đề nào khớp với cấp độ "{selectedLevel === 'all' ? 'Tất cả' : selectedLevel}" hoặc từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black ${getLevelBadgeClass(topic.level)}`}>
                      {topic.level || 'B2'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#e8f1ff] text-[#003882] text-[10px] font-black border border-[#1c1b1b]">
                      {topic.category}
                    </span>
                  </div>
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
      )}
    </div>
  );
};

