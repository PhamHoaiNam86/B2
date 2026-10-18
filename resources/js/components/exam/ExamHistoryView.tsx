import React, { useState } from 'react';
import { ExamFeedItem, ExamModel } from '../../types';
import { Award, CheckCircle2, XCircle, Search, Sparkles, Filter, Clock, RotateCcw, BookOpen } from 'lucide-react';

interface ExamHistoryViewProps {
  historyItems: ExamFeedItem[];
  exams: ExamModel[];
  onReviewExam: (item: ExamFeedItem) => void;
  onRetakeExam?: (examCode: string) => void;
}

export const ExamHistoryView: React.FC<ExamHistoryViewProps> = ({
  historyItems,
  exams,
  onReviewExam,
  onRetakeExam,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      (item.examCode || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());

    const isPassed = (item.statusText || '').toLowerCase().includes('đạt') || (item.score / (item.maxScore || 100)) >= 0.6;
    if (filterStatus === 'passed') return matchesSearch && isPassed;
    if (filterStatus === 'failed') return matchesSearch && !isPassed;
    return matchesSearch;
  });

  const totalExams = historyItems.length;
  const passedExams = historyItems.filter((i) =>
    (i.statusText || '').toLowerCase().includes('đạt') || (i.score / (i.maxScore || 100)) >= 0.6
  ).length;
  const avgScore = totalExams > 0
    ? Math.round(historyItems.reduce((acc, i) => acc + (i.score || 0), 0) / totalExams * 10) / 10
    : 0;

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB] text-white text-xs font-black uppercase border border-[#111827]">
            LỊCH SỬ THI & BẢNG ĐIỂM
          </span>
          <h2 className="text-2xl font-black text-[#111827] mt-1 font-heading">
            Lịch Sử Làm Bài & Bảng Điểm Thi Thử Chứng Chỉ Tiếng Đức
          </h2>
          <p className="text-xs text-[#4b5563] mt-0.5">
            Xem lại chi tiết từng bài thi đã nộp, đối chiếu đáp án, kiểm tra lỗi sai và học hỏi giải thích chi tiết
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#eff6ff] border-2 border-[#111827] rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] font-black uppercase text-[#1e40af] block">Tổng Bài Thi</span>
            <span className="text-xl font-black text-[#2563EB] font-heading">{totalExams}</span>
          </div>
          <div className="p-3 bg-[#ecfdf5] border-2 border-[#111827] rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] font-black uppercase text-[#065f46] block">Điểm Trung Bình</span>
            <span className="text-xl font-black text-[#059669] font-heading">{avgScore}đ</span>
          </div>
          <div className="p-3 bg-[#fefce8] border-2 border-[#111827] rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] font-black uppercase text-[#854d0e] block">Đạt Chuẩn</span>
            <span className="text-xl font-black text-[#d97706] font-heading">{passedExams}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-2 border-[#111827] rounded-xl p-4 brutal-shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã bài thi, tên học viên, mô tả..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#4b5563] shrink-0">Lọc kết quả:</span>
          {(['all', 'passed', 'failed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-black cursor-pointer transition-all ${
                filterStatus === st
                  ? 'bg-[#111827] text-white border-[#111827]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {st === 'all' && `Tất cả (${totalExams})`}
              {st === 'passed' && `Đạt chuẩn (${passedExams})`}
              {st === 'failed' && `Chưa đạt (${totalExams - passedExams})`}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-12 text-center brutal-shadow space-y-3">
            <div className="w-14 h-14 bg-slate-100 border-2 border-[#111827] rounded-2xl flex items-center justify-center mx-auto text-2xl">
              📋
            </div>
            <h3 className="text-lg font-black text-[#111827] font-heading">Chưa tìm thấy lịch sử bài làm nào</h3>
            <p className="text-xs text-[#4b5563] max-w-sm mx-auto">
              Không có bài thi nào khớp với bộ lọc. Hãy tham gia thi thử tại các mục đề thi trên thanh điều hướng!
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isPassed =
              (item.statusText || '').toLowerCase().includes('đạt') ||
              (item.statusText || '').toLowerCase().includes('hoàn thành') ||
              (item.score / (item.maxScore || 100)) >= 0.6;

            const isGoethe =
              (item.examCode || '').toUpperCase().includes('GOETHE') ||
              item.maxScore === 100;

            const isWritingOrSpeaking =
              (item.examCode || '').toUpperCase().includes('SCHREIBEN') ||
              (item.examCode || '').toUpperCase().includes('SPRECHEN') ||
              (item.writingScore === 100 && item.readingScore === 0);

            return (
              <div
                key={item.id}
                className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow hover:translate-y-[-1px] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB] text-white text-[11px] font-black border border-[#111827]">
                      {item.examCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-300">
                      {isWritingOrSpeaking ? 'TỰ LUẬN' : (isGoethe ? 'GOETHE' : 'TELC')}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.timeAgo || 'Vừa xong'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#111827] font-heading">
                    {item.studentName} — {item.description || `Bài thi ${item.examCode}`}
                  </h3>

                  {/* Skills Score breakdown */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold text-slate-600 pt-0.5">
                    {typeof item.readingScore === 'number' && item.readingScore > 0 && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200">
                        Đọc (Lesen): {item.readingScore}đ
                      </span>
                    )}
                    {typeof item.writingScore === 'number' && item.writingScore > 0 && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded border border-rose-200">
                        {isWritingOrSpeaking ? 'Viết / Nói' : 'Ngữ pháp (Sprachbausteine)'}: {item.writingScore}đ
                      </span>
                    )}
                    {typeof item.listeningScore === 'number' && item.listeningScore > 0 && (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-800 rounded border border-purple-200">
                        Nghe (Hören): {item.listeningScore}đ
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Score Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#111827] font-heading">
                      <span className={isPassed ? 'text-emerald-600' : 'text-rose-600'}>{item.score}</span>
                      <span className="text-sm text-slate-400 font-bold"> / {item.maxScore}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black border inline-flex items-center gap-1 ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : 'bg-rose-100 text-rose-800 border-rose-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isWritingOrSpeaking
                        ? 'ĐÃ NỘP BÀI (HOÀN THÀNH)'
                        : (isPassed ? 'ĐẠT CHUẨN (BESTANDEN)' : 'CHƯA ĐẠT (NICHT BESTANDEN)')}
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => onReviewExam(item)}
                      className="px-4 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-black border-2 border-[#111827] hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-1.5 brutal-shadow-xs font-heading shrink-0"
                      title="Xem lại từng câu hỏi, đáp án đã chọn và giải thích chi tiết"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Xem Lại Bài Làm 💡</span>
                    </button>
                    {onRetakeExam && (
                      <button
                        onClick={() => onRetakeExam(item.examCode)}
                        className="px-3 py-2.5 bg-white text-slate-700 rounded-xl text-xs font-bold border-2 border-[#111827] hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        title="Làm lại đề thi này"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Thi lại</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
