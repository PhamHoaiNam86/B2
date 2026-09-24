import React from 'react';
import { UserExamState } from '../../types';
import { Award, CheckCircle2, RotateCcw, ArrowLeft, Download, Sparkles, AlertCircle, Zap, ShieldCheck } from 'lucide-react';

interface ResultsScreenProps {
  examState: UserExamState;
  onRetakeExam: () => void;
  onBackToDashboard: () => void;
  onReviewExam?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  examState,
  onRetakeExam,
  onBackToDashboard,
  onReviewExam,
}) => {
  const answeredCount = Object.keys(examState.answers).length;
  const isGoethe = examState.examCode.includes('GOETHE');
  const providerLabel = isGoethe ? 'GOETHE-ZERTIFIKAT' : 'TELC DEUTSCH';

  // Calculate simulated score
  const estimatedScore = Math.round((answeredCount / 4) * 240 + 35);
  const isPassed = estimatedScore >= 180;

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 border-2 border-[#111827] flex items-center justify-center mx-auto text-[#2563EB]">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-black border border-[#111827] uppercase ${
            isGoethe ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#2563EB]/10 text-[#2563EB]'
          }`}>
            BÁO CÁO KẾT QUẢ THI THỬ {providerLabel}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] mt-2 font-heading">
            {isPassed ? `Chúc mừng! Bạn Đã Đạt Chuẩn ${providerLabel}` : `Cần Cố Gắng Thêm Để Đạt Bằng ${providerLabel}`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Mô phỏng chấm điểm theo tiêu chuẩn đánh giá Viện Goethe / TELC GmbH Germany
          </p>
        </div>

        {/* Score Badge */}
        <div className="inline-block p-4 bg-slate-50 border-2 border-[#111827] rounded-2xl space-y-2 brutal-shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Tổng Điểm Đạt Được:</span>
          <p className="text-3xl sm:text-4xl font-black text-[#F97316] font-heading">
            {estimatedScore} <span className="text-base text-[#111827]">/ 300 Điểm</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-black inline-block ${
                isPassed ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-red-100 text-red-950 border border-red-400'
              }`}
            >
              {isPassed ? 'XẾP LOẠI: GUT (KHÁ GHI NHẬN)' : 'XẾP LOẠI: NICHT BESTANDEN'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> +100 EXP
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onReviewExam && (
            <button
              onClick={onReviewExam}
              className="px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-black border-2 border-[#111827] hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-2 brutal-shadow-xs font-heading"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Xem Chi Tiết Bài Làm & Giải Thích 💡
            </button>
          )}
          <button
            onClick={onRetakeExam}
            className="px-5 py-2.5 bg-[#F97316] text-white rounded-xl text-xs font-black border-2 border-[#111827] hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-2 brutal-shadow-xs"
          >
            <RotateCcw className="w-4 h-4" /> Làm Lại Bài Thi
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 bg-white border-2 border-[#111827] text-[#111827] rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Về Danh Sách Đề Thi
          </button>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Score Breakdown */}
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading border-b-2 border-slate-100 pb-2">
            Điểm Số Chi Tiết Theo Kỹ Năng ({providerLabel})
          </h3>

          <div className="space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-[#111827] rounded-xl">
              <span className="text-[#111827]">📖 Lesen (Đọc hiểu)</span>
              <span className="text-[#2563EB] font-black text-sm">68 / 75 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-[#111827] rounded-xl">
              <span className="text-[#111827]">🎧 Hören (Nghe hiểu)</span>
              <span className="text-[#2563EB] font-black text-sm">65 / 75 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-[#111827] rounded-xl">
              <span className="text-[#111827]">✍️ Schreiben (Kỹ năng Viết)</span>
              <span className="text-[#2563EB] font-black text-sm">54 / 75 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-[#111827] rounded-xl">
              <span className="text-[#111827]">🗣️ Sprechen / Sprachbausteine</span>
              <span className="text-[#2563EB] font-black text-sm">55 / 75 Điểm</span>
            </div>
          </div>
        </div>

        {/* AI Feedback & Anti-cheat summary */}
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading border-b-2 border-slate-100 pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
            Phân Tích Đánh Giá Kỹ Năng {providerLabel}
          </h3>

          <div className="p-4 bg-blue-50 border-2 border-[#111827] rounded-xl text-xs space-y-2 leading-relaxed font-medium">
            <p className="font-bold text-[#2563EB]">
              "Thí sinh phản ứng tốt với dạng bài Lesen Teil 2 & Teil 3. Cấu trúc câu ghép và từ nối (in Bezug auf, obwohl, weil) sử dụng chính xác."
            </p>
            <p className="text-slate-600">
              Khuyến nghị: Cần bổ sung thêm từ vựng chuyên ngành y tế & công nghệ để tự tin đạt điểm tối đa ở phần thi Viết Schriftlicher Ausdruck.
            </p>
          </div>

          {/* Anti-cheat summary */}
          <div className="p-3.5 bg-amber-50 border-2 border-[#111827] rounded-xl text-xs flex items-center gap-2 text-amber-900 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Nhật ký giám sát thi: Ghi nhận {examState.tabSwitchCount} lần rời cửa sổ làm bài.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
