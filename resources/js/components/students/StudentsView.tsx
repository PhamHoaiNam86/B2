import React from 'react';
import { Student } from '../../types';
import { Users, Award, Calendar, Search, Mail, Plus } from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ students, onShowToast }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#ffe082] text-[#3e2723] text-xs font-black border border-[#1c1b1b]">
            QUẢN LÝ HỌC VIÊN
          </span>
          <h2 className="text-2xl font-black text-[#1c1b1b] mt-1 font-heading">
            Danh Sách Học Viên Luyện Thi TELC B2
          </h2>
          <p className="text-xs text-[#564145] mt-0.5">
            Theo dõi điểm số thi thử, mục tiêu điểm và ngày thi chính thức của từng học viên
          </p>
        </div>

        <button
          onClick={() => onShowToast('Thêm học viên', 'Tính năng thêm học viên mới đã sẵn sàng.', 'info')}
          className="px-4 py-2.5 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#a83159] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm Học Viên Mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl overflow-hidden brutal-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcf9f8] border-b-2 border-[#1c1b1b] uppercase font-black text-[#564145]">
              <tr>
                <th className="p-4">Học Viên</th>
                <th className="p-4">Lớp Học</th>
                <th className="p-4">Điểm Thi Gần Nhất</th>
                <th className="p-4">Mục Tiêu</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Ngày Thi Dự Kiến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1b1b]/10 font-bold">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-[#fcf9f8] transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-10 h-10 rounded-xl border-2 border-[#1c1b1b] object-cover shrink-0"
                    />
                    <div>
                      <span className="font-black text-[#1c1b1b] text-sm block">{student.name}</span>
                      <span className="text-[#897175] text-[11px] font-normal">{student.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#564145]">{student.className}</td>
                  <td className="p-4 font-black text-sm text-[#003882]">{student.currentScore} / 300</td>
                  <td className="p-4 text-[#f36b92]">{student.targetScore} điểm</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-400">
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[#564145]">{student.targetExamDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
