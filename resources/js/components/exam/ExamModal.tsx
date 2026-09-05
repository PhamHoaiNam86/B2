import React, { useState } from 'react';
import { X, Clock, Play, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const ExamModal: React.FC<ExamModalProps> = ({ isOpen, onClose, title }) => {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border-[3px] border-[#1c1b1b] rounded-2xl brutal-shadow-xl p-6 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border-2 border-[#1c1b1b] hover:bg-[#f0edec] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-[#f36b92] text-white text-[10px] font-black uppercase border border-[#1c1b1b]">
            MÔ PHỎNG NGAU NHIÊN
          </span>
          <h2 className="text-lg font-black text-[#1c1b1b] font-heading">{title}</h2>
        </div>

        {!isSubmitted ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl space-y-2">
              <h4 className="font-black text-[#1c1b1b]">
                Câu hỏi 1: Đọc bài và chọn câu trả lời đúng nhất (TELC B2)
              </h4>
              <p className="text-[#564145] leading-relaxed">
                "Der Antrag auf Anerkennung ausländischer Berufsqualifikationen muss bei der zuständigen Stelle des jeweiligen Bundeslandes eingereicht werden..."
              </p>
            </div>

            <div className="space-y-2">
              {[
                'A. Đơn xin công nhận văn bằng gửi về cơ quan có thẩm quyền của Bang',
                'B. Đơn gửi trực tiếp tới Đại sứ quán Đức tại Việt Nam',
                'C. Nộp đơn cho công ty xuất khẩu lao động tại Hà Nội',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOpt(opt)}
                  className={`w-full text-left p-3 rounded-xl border-2 font-bold transition-all cursor-pointer ${
                    selectedOpt === opt
                      ? 'bg-[#f36b92] text-white border-[#1c1b1b] brutal-shadow-xs font-black'
                      : 'bg-white text-[#1c1b1b] border-[#1c1b1b] hover:bg-[#fcf9f8]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsSubmitted(true)}
              className="w-full py-3 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl font-black text-xs brutal-shadow-xs hover:bg-[#a83159] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Nộp Bài Kiểm Tra
            </button>
          </div>
        ) : (
          <div className="p-6 text-center space-y-3 bg-[#e2f7e9] border-2 border-[#1c1b1b] rounded-xl">
            <CheckCircle2 className="w-12 h-12 text-[#0d5225] mx-auto" />
            <h3 className="text-lg font-black text-[#0d5225]">Đã Hoàn Thành Bài Kiểm Tra!</h3>
            <p className="text-xs text-[#0d5225]">Kết quả của bạn đã được lưu vào hồ sơ học viên B2.</p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#0d5225] text-white border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-xs cursor-pointer"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
