import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

interface SchreibenViewProps {
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SchreibenView: React.FC<SchreibenViewProps> = ({ onShowToast }) => {
  const [promptType, setPromptType] = useState<'beschwerde' | 'bitte'>('beschwerde');
  const [essayText, setEssayText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    score: number;
    grammarScore: number;
    vocabScore: number;
    structureScore: number;
    feedback: string;
    corrections: string[];
  } | null>(null);

  const handleAiEvaluation = () => {
    if (!essayText.trim() || essayText.length < 50) {
      onShowToast('Bài viết quá ngắn', 'Vui lòng nhập tối thiểu 50 từ để AI Gemini có thể chấm điểm.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResult({
        score: 38,
        grammarScore: 12,
        vocabScore: 13,
        structureScore: 13,
        feedback: 'Bài viết đạt chuẩn TELC B2! Bố cục mạch lạc gồm lời chào, lý do phàn nàn, yêu cầu bồi thường và lời chào kết thúc. Sử dụng tốt Konjunktiv II (Ich wäre Ihnen dankbar).',
        corrections: [
          'Sửa lỗi chính tả: "beschwerde" -> "Beschwerde" (viết hoa Nomen)',
          'Nâng cấp từ vựng: dùng "unverzüglich" thay cho "schnell"',
        ],
      });
      onShowToast('Hoàn tất chấm bài AI', 'Đã phân tích cấu trúc, ngữ pháp và chấm điểm bài viết B2.', 'success');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#e8f1ff] border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow space-y-2">
        <span className="px-2.5 py-0.5 rounded-md bg-[#003882] text-white text-xs font-black border border-[#1c1b1b]">
          MODUL SCHREIBEN TELC B2
        </span>
        <h2 className="text-2xl font-black text-[#1c1b1b] font-heading">
          Luyện Viết Thư B2 Có Công Nghệ AI Gemini Chấm Điểm
        </h2>
        <p className="text-xs text-[#564145]">
          Hỗ trợ 2 dạng đề chính trong đề thi TELC B2: Thư phàn nàn (Beschwerdebrief) và Thư xin thông tin (Bitte um Informationen)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Prompt & Essay Editor */}
        <div className="lg:col-span-7 space-y-4">
          {/* Prompt Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPromptType('beschwerde')}
              className={`px-4 py-2 rounded-xl border-2 text-xs font-black cursor-pointer transition-all ${
                promptType === 'beschwerde'
                  ? 'bg-[#f36b92] text-white border-[#1c1b1b] brutal-shadow-sm'
                  : 'bg-white text-[#1c1b1b] border-[#1c1b1b] hover:bg-[#fcf9f8]'
              }`}
            >
              1. Beschwerdebrief (Thư Phàn Nàn)
            </button>
            <button
              onClick={() => setPromptType('bitte')}
              className={`px-4 py-2 rounded-xl border-2 text-xs font-black cursor-pointer transition-all ${
                promptType === 'bitte'
                  ? 'bg-[#f36b92] text-white border-[#1c1b1b] brutal-shadow-sm'
                  : 'bg-white text-[#1c1b1b] border-[#1c1b1b] hover:bg-[#fcf9f8]'
              }`}
            >
              2. Bitte um Information (Thư Xin Thông Tin)
            </button>
          </div>

          {/* Prompt Text Box */}
          <div className="p-4 bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow text-xs space-y-1">
            <h4 className="font-black text-[#1c1b1b] uppercase">Đề Bài Chi Tiết:</h4>
            {promptType === 'beschwerde' ? (
              <p className="text-[#564145] leading-relaxed">
                Bạn đặt mua thiết bị y tế từ công ty MedTech nhưng giao hàng trễ 3 tuần và thiếu phụ kiện. Hãy viết thư khiếu nại yêu cầu bồi thường hoặc đổi trả sản phẩm (khoảng 150-200 từ).
              </p>
            ) : (
              <p className="text-[#564145] leading-relaxed">
                Viết thư hỏi thông tin chi tiết về khóa đào tạo điều dưỡng chuyển đổi bằng tại Đức: thời gian, học phí, điều kiện tiếng Đức B2 và hỗ trợ nhà ở.
              </p>
            )}
          </div>

          {/* Editor TextArea */}
          <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Nội dung bài viết của bạn:</span>
              <span className="text-[#897175]">{essayText.split(/\s+/).filter(Boolean).length} từ</span>
            </div>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Sehr geehrte Damen und Herren, in Bezug auf Ihre Anzeige..."
              className="w-full h-64 p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#f36b92] resize-none"
            />
            <button
              onClick={handleAiEvaluation}
              disabled={isAnalyzing}
              className="w-full py-3 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl font-black text-xs brutal-shadow-sm hover:bg-[#a83159] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? 'AI Gemini đang phân tích & chấm điểm...' : 'Bắt Đầu AI Chấm Điểm TELC B2'}
            </button>
          </div>
        </div>

        {/* Right 5 Cols: AI Result Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow space-y-4">
            <h3 className="text-base font-black text-[#1c1b1b] font-heading border-b-2 border-[#1c1b1b] pb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f36b92]" />
              Kết Quả Chấm Điểm AI
            </h3>

            {aiResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#ffe082] border-2 border-[#1c1b1b] rounded-xl text-center space-y-1">
                  <span className="text-xs font-bold text-[#3e2723]">Điểm Viết AI Đánh Giá</span>
                  <p className="text-3xl font-black text-[#3e2723] font-heading">{aiResult.score} / 45</p>
                  <span className="px-2.5 py-0.5 rounded bg-white text-[#3e2723] border border-[#1c1b1b] text-[10px] font-black">
                    ĐẠT CHUẨN WRITING B2
                  </span>
                </div>

                <div className="p-3 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl text-xs space-y-2">
                  <h4 className="font-black text-[#1c1b1b]">Nhận xét tổng thể:</h4>
                  <p className="text-[#564145] leading-relaxed">{aiResult.feedback}</p>
                </div>

                <div className="p-3 bg-[#fff3d6] border-2 border-[#1c1b1b] rounded-xl text-xs space-y-1.5">
                  <h4 className="font-black text-[#734c00]">Gợi ý sửa lỗi & nâng cấp:</h4>
                  <ul className="list-disc list-inside space-y-1 text-[#734c00]">
                    {aiResult.corrections.map((cor, idx) => (
                      <li key={idx}>{cor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#897175] space-y-2 border-2 border-dashed border-[#1c1b1b]/30 rounded-xl">
                <FileText className="w-8 h-8 text-[#897175] mx-auto" />
                <p className="font-bold">Chưa có bài chấm nào</p>
                <p>Nhập nội dung bài viết và nhấn "Bắt Đầu AI Chấm Điểm" để xem kết quả.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
