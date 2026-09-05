import React from 'react';
import { ExamModel } from '../../types';
import { X, Clock, Play, FileText, CheckCircle2 } from 'lucide-react';

interface ExamDetailModalProps {
  exam: ExamModel | null;
  onClose: () => void;
  onStartExam: (exam: ExamModel) => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ExamDetailModal: React.FC<ExamDetailModalProps> = ({
  exam,
  onClose,
  onStartExam,
  onShowToast,
}) => {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white border-[3px] border-[#1c1b1b] rounded-2xl brutal-shadow-xl p-6 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border-2 border-[#1c1b1b] hover:bg-[#f0edec] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#f36b92] text-white text-[10px] font-black uppercase border border-[#1c1b1b]">
            {exam.examCode}
          </span>
          <h2 className="text-xl font-black text-[#1c1b1b] font-heading mt-2">
            {exam.name}
          </h2>
          <p className="text-xs text-[#564145] mt-1 leading-relaxed">{exam.description}</p>
        </div>

        {/* Section List */}
        <div className="p-4 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl space-y-2">
          <h4 className="text-xs font-black uppercase text-[#1c1b1b]">Các phần thi trong đề:</h4>
          <div className="space-y-1.5 text-xs font-bold">
            {exam.sections.map((sec, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-[#1c1b1b] rounded-lg">
                <span className="text-[#1c1b1b] font-black">{sec.name}</span>
                <div className="flex items-center gap-3 text-[#564145] text-[11px]">
                  <span>{sec.questionCount} câu</span>
                  <span className="text-[#003882]">{sec.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border-2 border-[#1c1b1b] rounded-xl text-xs font-bold hover:bg-[#f0edec] cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              onStartExam(exam);
            }}
            className="px-5 py-2 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-xs hover:bg-[#a83159] cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-current" /> Bắt Đầu Thi
          </button>
        </div>
      </div>
    </div>
  );
};
