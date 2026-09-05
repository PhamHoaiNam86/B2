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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 sm:p-8 brutal-shadow text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#ffe082] border-2 border-[#1c1b1b] flex items-center justify-center mx-auto brutal-shadow-sm">
          <Award className="w-8 h-8 text-[#3e2723]" />
        </div>

        <div>
          <span className="px-3 py-1 bg-[#f36b92] text-white rounded-full text-xs font-black border border-[#1c1b1b]">
            BÁO CÁO KẾT QUẢ THI THỬ TELC B2
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1c1b1b] mt-2 font-heading">
            {isPassed ? 'Chúc mừng! Bạn Đã Đạt Chuẩn TELC B2' : 'Cần Cố Gắng Thêm Để Đạt Bằng B2'}
          </h2>
          <p className="text-xs sm:text-sm text-[#564145] mt-1 font-medium">
            Mô phỏng chấm điểm theo tiêu chuẩn TELC GmbH Germany
          </p>
        </div>

        {/* Score Badge */}
        <div className="inline-block p-4 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl brutal-shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#564145]">Tổng Điểm Đạt Được:</span>
          <p className="text-3xl sm:text-4xl font-black text-[#f36b92] font-heading">
            {estimatedScore} <span className="text-base text-[#1c1b1b]">/ 300 Điểm</span>
          </p>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-black border border-[#1c1b1b] inline-block ${
              isPassed ? 'bg-emerald-100 text-emerald-950' : 'bg-red-100 text-red-950'
            }`}
          >
            {isPassed ? 'XẾP LOẠI: GUT (KHÁ GHI NHẬN)' : 'XẾP LOẠI: NICHT BESTANDEN'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetakeExam}
            className="px-5 py-2.5 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#a83159] transition-all cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Làm Lại Bài Thi
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 bg-white border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#f0edec] transition-all cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Về Trang Chủ
          </button>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Score Breakdown */}
        <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#1c1b1b] font-heading border-b-2 border-[#1c1b1b] pb-2">
            Điểm Số Chi Tiết Theo Kỹ Năng
          </h3>

          <div className="space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl">
              <span>📖 Leseverstehen & Sprachbausteine</span>
              <span className="text-[#003882] font-black text-sm">68 / 75 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl">
              <span>🎧 Hörverstehen (Nghe hiểu)</span>
              <span className="text-[#003882] font-black text-sm">65 / 75 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl">
              <span>✍️ Schriftlicher Ausdruck (Viết)</span>
              <span className="text-[#003882] font-black text-sm">54 / 45 Điểm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl">
              <span>🗣️ Mündliche Prüfung (Nói)</span>
              <span className="text-[#003882] font-black text-sm">55 / 75 Điểm</span>
            </div>
          </div>
        </div>

        {/* AI Feedback & Anti-cheat summary */}
        <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#1c1b1b] font-heading border-b-2 border-[#1c1b1b] pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f36b92]" />
            Phân Tích Đánh Giá AI Gemini
          </h3>

          <div className="p-4 bg-[#e8f1ff] border-2 border-[#1c1b1b] rounded-xl text-xs space-y-2 leading-relaxed">
            <p className="font-bold text-[#003882]">
              "Thí sinh phản ứng tốt với dạng bài điền từ Sprachbausteine. Cấu trúc câu ghép và từ nối B2 (in Bezug auf, obwohl, weil) sử dụng chính xác."
            </p>
            <p className="text-[#564145]">
              Khuyến nghị: Cần trau dồi thêm bộ từ vựng chủ đề Y tế & Điều dưỡng (Pflegekräfte) để tự tin hơn ở bài đọc hiểu Teil 3.
            </p>
          </div>

          {/* Anti-cheat summary */}
          <div className="p-3 bg-[#fff3d6] border-2 border-[#1c1b1b] rounded-xl text-xs flex items-center gap-2 text-[#734c00]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Nhật ký giám sát: Ghi nhận {examState.tabSwitchCount} lần rời cửa sổ làm bài.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
