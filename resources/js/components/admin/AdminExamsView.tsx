import React, { useState } from 'react';
import { ExamModel } from '../../types';
import { Plus, Search, Edit3, Trash2, Eye, FileCheck2, Clock, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AdminExamsViewProps {
  exams: ExamModel[];
  onSelectExam: (exam: ExamModel) => void;
  onOpenNewExamModal: () => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  onDeleteExam?: (id: string) => void;
}

export const AdminExamsView: React.FC<AdminExamsViewProps> = ({
  exams,
  onSelectExam,
  onOpenNewExamModal,
  onShowToast,
  onDeleteExam,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.examCode.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || e.level.includes(selectedLevel);
    return matchesSearch && matchesLevel;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bộ đề thi "${name}" khỏi hệ thống?`)) {
      if (onDeleteExam) {
        onDeleteExam(id);
      }
      onShowToast('Đã xóa', `Đã xóa bộ đề thi "${name}".`, 'info');
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header & Admin Actions */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB] text-white text-xs font-black uppercase border border-[#111827]">
            QUẢN TRỊ VIÊN / ADMIN
          </span>
          <h2 className="text-2xl font-black text-[#111827] mt-1 font-heading">
            Quản Lý Danh Sách Bộ Đề Thi TELC
          </h2>
          <p className="text-xs text-[#4b5563] mt-0.5">
            Quản lý, tạo mới, chỉnh sửa nội dung và cấu trúc đề thi mô phỏng tiêu chuẩn
          </p>
        </div>

        <button
          onClick={onOpenNewExamModal}
          className="px-5 py-3 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-2 font-heading uppercase shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Bộ Đề Thi Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-2 border-[#111827] rounded-xl p-4 brutal-shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm mã đề thi, tên bộ đề..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'B2', 'B1', 'A2', 'A1'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black cursor-pointer transition-all ${
                selectedLevel === lvl
                  ? 'bg-[#111827] text-white border-[#111827]'
                  : 'bg-white text-[#111827] border-[#111827] hover:bg-[#f8fafc]'
              }`}
            >
              {lvl === 'ALL' ? 'Tất cả cấp độ' : `Cấp độ ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Exam Data Table */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] border-b-2 border-[#111827] text-[#111827] font-black uppercase text-[11px]">
              <tr>
                <th className="p-4">STT / Mã Đề</th>
                <th className="p-4">Tên Bộ Đề Thi</th>
                <th className="p-4">Trình Độ</th>
                <th className="p-4">Thời Gian</th>
                <th className="p-4">Số Câu</th>
                <th className="p-4">Tỉ Lệ Đỗ</th>
                <th className="p-4 text-center">Thao Tác Quản Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111827]/10 font-semibold">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#4b5563]">
                    Không tìm thấy đề thi nào phù hợp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam, idx) => (
                  <tr key={exam.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-4 font-black">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6b7280]">#{idx + 1}</span>
                        <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white text-[10px] font-black border border-[#111827]">
                          {exam.examCode}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#111827]">
                      <div>
                        <div className="text-sm font-black">{exam.name}</div>
                        <span className="text-[10px] text-[#4b5563] line-clamp-1">{exam.description}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#1e40af] border border-[#111827] text-[10px] font-black">
                        {exam.level}
                      </span>
                    </td>
                    <td className="p-4 font-black text-[#111827]">
                      ⏱ {exam.durationMinutes} phút
                    </td>
                    <td className="p-4 font-black text-[#111827]">
                      📝 {exam.totalQuestions} câu
                    </td>
                    <td className="p-4 font-black text-[#059669]">
                      🎯 {exam.passRate}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onSelectExam(exam)}
                          className="px-3 py-1.5 bg-[#eff6ff] text-[#1e40af] border border-[#111827] rounded-lg font-bold hover:bg-[#dbeafe] flex items-center gap-1 cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem
                        </button>
                        <button
                          onClick={() => onSelectExam(exam)}
                          className="px-3 py-1.5 bg-[#fef3c7] text-[#92400e] border border-[#111827] rounded-lg font-bold hover:bg-[#fde68a] flex items-center gap-1 cursor-pointer"
                          title="Chỉnh sửa đề thi"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id, exam.name)}
                          className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] border border-[#111827] rounded-lg font-bold hover:bg-[#fecdd3] flex items-center gap-1 cursor-pointer"
                          title="Xóa đề thi"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
