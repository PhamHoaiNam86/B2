import React from 'react';
import { UserExamState } from '../../types';
import { Award, CheckCircle2, RotateCcw, ArrowLeft, Sparkles, AlertCircle, Zap, BookOpen, Brain, Check, X } from 'lucide-react';

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
  const isGoethe = (examState.examCode || '').toUpperCase().includes('GOETHE') || examState.maxScore === 100;
  const isListeningGoethe = isGoethe && Boolean(
    (examState.listeningScore && examState.listeningScore > 0) ||
    (examState.examCode || '').toUpperCase().includes('HÖREN') ||
    (examState.examCode || '').toUpperCase().includes('HOREN')
  );
  const providerLabel = isGoethe ? 'GOETHE-ZERTIFIKAT' : 'TELC DEUTSCH';

  // Thang điểm theo yêu cầu khách hàng:
  // - Goethe: Thang điểm 100 (Lesen & Hören độc lập 100 điểm, Đạt từ 60/100)
  // - Telc: Thang điểm 105 (Leseverstehen 20 câu 75đ + Sprachbausteine 20 câu 30đ, đạt từ 63/105)
  const maxScore = examState.maxScore || (isGoethe ? 100 : 105);
  const passScore = isGoethe ? 60 : 63;
  
  const score = typeof examState.score === 'number'
    ? examState.score
    : (isGoethe ? 75 : 82.5);

  const isPassed = score >= passScore;
  const readingScore = typeof examState.readingScore === 'number'
    ? examState.readingScore
    : (isGoethe ? score : Math.round(score * (75 / 105) * 10) / 10);

  const sprachScore = typeof examState.sprachScore === 'number'
    ? examState.sprachScore
    : (isGoethe ? 0 : Math.round((score - readingScore) * 10) / 10);

  const answeredCount = examState.answeredCount ?? Object.keys(examState.answers || {}).length;

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow text-center space-y-4">
        <div className={`w-16 h-16 rounded-2xl border-2 border-[#111827] flex items-center justify-center mx-auto ${
          isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}>
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-black border border-[#111827] uppercase tracking-wider ${
            isGoethe ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#eff6ff] text-[#1e40af]'
          }`}>
            KẾT QUẢ THI THỬ {providerLabel} (THANG ĐIỂM {maxScore})
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] mt-2 font-heading">
            {isPassed ? 'Chúc Mừng! Bạn Đã Đạt Chứng Chỉ' : 'Cần Cố Gắng Thêm Để Đạt Chứng Chỉ'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {isGoethe
              ? 'Thang điểm Goethe chuẩn 100 điểm (Yêu cầu đạt tối thiểu 60/100 điểm)'
              : 'Thang điểm TELC chuẩn 105 điểm (Leseverstehen 75đ + Sprachbausteine 30đ, đạt từ 63/105 điểm)'}
          </p>
        </div>

        {/* Score Badge */}
        <div className="inline-block p-5 bg-slate-50 border-2 border-[#111827] rounded-2xl space-y-2 brutal-shadow-xs min-w-[280px]">
          <span className="text-xs font-bold text-slate-500 uppercase block">Tổng Điểm Bài Thi:</span>
          <p className="text-4xl sm:text-5xl font-black text-[#F97316] font-heading">
            {score} <span className="text-xl text-[#111827]">/ {maxScore} Điểm</span>
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 ${
                isPassed ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-red-100 text-red-950 border border-red-400'
              }`}
            >
              {isPassed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              {isPassed ? 'XẾP LOẠI: BESTANDEN (ĐẠT CHUẨN)' : 'XẾP LOẠI: NICHT BESTANDEN (CHƯA ĐẠT)'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1">
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
              <Sparkles className="w-4 h-4 text-amber-300" /> Xem Chi Tiết Từng Câu & Đáp Án 💡
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
          <h3 className="text-base font-black text-[#111827] font-heading border-b-2 border-slate-100 pb-2 flex items-center justify-between">
            <span>Chi Tiết Điểm Số Theo Phần Thi</span>
            <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {providerLabel}
            </span>
          </h3>

          {/* Breakdown based on TELC (105đ) or GOETHE (100đ) */}
          {!isGoethe ? (
            <div className="space-y-3 text-xs font-bold">
              {/* Phần 1: Leseverstehen 3 phần đầu 20 câu 75đ */}
              <div className="p-3.5 bg-slate-50 border-2 border-[#111827] rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#111827] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <span>1. Leseverstehen (Teil 1, 2, 3)</span>
                  </span>
                  <span className="text-[#2563EB] font-black text-sm">{readingScore} / 75 Điểm</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Đọc hiểu 20 câu (Mỗi câu đúng = 3.75 điểm)
                </p>
              </div>

              {/* Phần 2: Sprachbausteine 2 phần sau 20 câu 30đ */}
              <div className="p-3.5 bg-slate-50 border-2 border-[#111827] rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#111827] flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#F97316]" />
                    <span>2. Sprachbausteine (Teil 4, 5)</span>
                  </span>
                  <span className="text-[#F97316] font-black text-sm">{sprachScore} / 30 Điểm</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Từ vựng & Ngữ pháp 20 câu (Mỗi câu đúng = 1.5 điểm)
                </p>
              </div>

              {/* Tổng cộng */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-950 font-black">
                <span>🎯 TỔNG CỘNG (40 câu):</span>
                <span className="text-base text-emerald-700">{score} / 105 Điểm</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs font-bold">
              {/* Goethe Module */}
              <div className="p-3.5 bg-slate-50 border-2 border-[#111827] rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#111827] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <span>{isListeningGoethe ? '🎧 Modul Hören (Goethe)' : '📖 Modul Lesen (Goethe)'}</span>
                  </span>
                  <span className="text-[#2563EB] font-black text-sm">{score} / 100 Điểm</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Thang điểm kỹ năng chuẩn Viện Goethe (100 điểm, Đạt từ 60/100 điểm)
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-950 font-black">
                <span>🎯 TỔNG ĐIỂM MODUL GOETHE:</span>
                <span className="text-base text-emerald-700">{score} / 100 Điểm</span>
              </div>
            </div>
          )}
        </div>

        {/* AI Feedback & Anti-cheat summary */}
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4">
          <h3 className="text-base font-black text-[#111827] font-heading border-b-2 border-slate-100 pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
            Phân Tích Đánh Giá Kỹ Năng ({providerLabel})
          </h3>

          <div className="p-4 bg-blue-50 border-2 border-[#111827] rounded-xl text-xs space-y-2 leading-relaxed font-medium">
            <p className="font-bold text-[#2563EB]">
              {isPassed
                ? 'Chúc mừng bạn đã hoàn thành bài thi với kết quả xuất sắc! Bạn nắm vững các điểm ngữ pháp then chốt và khả năng suy luận đọc hiểu.'
                : 'Bạn đã nỗ lực rất tốt! Hãy tiếp tục rèn luyện kỹ năng đọc hiểu nhanh và các liên từ, giới từ trong phần Sprachbausteine.'}
            </p>
            <p className="text-slate-600">
              Đã trả lời: <b className="text-[#111827]">{answeredCount} câu</b>. Tỷ lệ chính xác ghi nhận theo tiêu chuẩn chấm thi quốc tế {providerLabel}.
            </p>
          </div>

          {/* Anti-cheat summary */}
          <div className="p-3.5 bg-amber-50 border-2 border-[#111827] rounded-xl text-xs flex items-center gap-2 text-amber-900 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Nhật ký giám sát thi: Ghi nhận {examState.tabSwitchCount || 0} lần rời cửa sổ làm bài.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
