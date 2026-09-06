import React from 'react';
import { UserExamState } from '../../types';
import { Award, CheckCircle2, RotateCcw, ArrowLeft, Download, Sparkles, AlertCircle } from 'lucide-react';

interface ResultsScreenProps {
  examState: UserExamState;
  onRetakeExam: () => void;
  onBackToDashboard: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  examState,
  onRetakeExam,
  onBackToDashboard,
}) => {
  const answeredCount = Object.keys(examState.answers).length;
  // Calculate simulated score
  const estimatedScore = Math.round((answeredCount / 4) * 240 + 35);
  const isPassed = estimatedScore >= 180;

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8 text-[#2563EB]" />
        </div>

        <div>
          <span className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-xs font-black border border-[#2563EB]/20">
            BÁO CÁO KẾT QUẢ THI THỬ TELC B2
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] mt-2 font-heading">
            {isPassed ? 'Chúc mừng! Bạn Đã Đạt Chuẩn TELC B2' : 'Cần Cố Gắng Thêm Để Đạt Bằng B2'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Mô phỏng chấm điểm theo tiêu chuẩn TELC GmbH Germany
          </p>
        </div>

        {/* Score Badge */}
        <div className="inline-block p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <span className="text-xs font-bold text-slate-500">Tổng Điểm Đạt Được:</span>
          <p className="text-3xl sm:text-4xl font-black text-[#F97316] font-heading">
            {estimatedScore} <span className="text-base text-[#111827]">/ 300 Điểm</span>
          </p>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-black inline-block ${
              isPassed ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-red-100 text-red-950 border border-red-400'
            }`}
          >
            {isPassed ? 'XẾP LOẠI: GUT (KHÁ GHI NHẬN)' : 'XẾP LOẠI: NICHT BESTANDEN'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetakeExam}
            className="px-5 py-2.5 bg-[#F97316] text-white rounded-xl text-xs font-bold hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-orange-500/20"
          >
            <RotateCcw className="w-4 h-4" /> Làm Lại Bài Thi
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 bg-white border border-slate-200 text-[#111827] rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Về Trang Chủ
          </button>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Score Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading border-b border-slate-100 pb-2">
            Điểm Số Chi Tiết Theo Kỹ Năng
          </h3>

          <div className="space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[#111827]">📖 Leseverstehen & Sprachbausteine</span>
              <span className="text-[#2563EB] font-black text-sm">68 / 75 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[#111827]">🎧 Hörverstehen (Nghe hiểu)</span>
              <span className="text-[#2563EB] font-black text-sm">65 / 75 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[#111827]">✍️ Schriftlicher Ausdruck (Viết)</span>
              <span className="text-[#2563EB] font-black text-sm">54 / 45 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[#111827]">🗣️ Mündliche Prüfung (Nói)</span>
              <span className="text-[#2563EB] font-black text-sm">55 / 75 Điểm</span>
            </div>
          </div>
        </div>

        {/* AI Feedback & Anti-cheat summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
            Phân Tích Đánh Giá Kỹ Năng TELC B2
          </h3>

          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-xs space-y-2 leading-relaxed">
            <p className="font-bold text-[#2563EB]">
              "Thí sinh phản ứng tốt với dạng bài điền từ Sprachbausteine. Cấu trúc câu ghép và từ nối B2 (in Bezug auf, obwohl, weil) sử dụng chính xác."
            </p>
            <p className="text-slate-600">
              Khuyến nghị: Cần trau dồi thêm bộ từ vựng chủ đề Y tế & Điều dưỡng (Pflegekräfte) để tự tin hơn ở bài đọc hiểu Teil 3.
            </p>
          </div>

          {/* Anti-cheat summary */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Nhật ký giám sát: Ghi nhận {examState.tabSwitchCount} lần rời cửa sổ làm bài.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
