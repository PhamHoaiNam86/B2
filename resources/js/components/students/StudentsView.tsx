import React, { useState } from 'react';
import { Student } from '../../types';
import { Users, Award, Calendar, Search, Mail, Plus, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: 'admin' | 'student';
}

const ITEMS_PER_PAGE = 10;

export const StudentsView: React.FC<StudentsViewProps> = ({ students, onShowToast, currentUser = 'admin' }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.className.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {currentUser === 'student' && (
        <div className="p-4 bg-[#fff8e7] border-2 border-[#1c1b1b] rounded-xl brutal-shadow-sm flex items-center gap-3 text-xs font-bold text-[#3e2723]">
          <ShieldAlert className="w-5 h-5 text-[#d97706] shrink-0" />
          <span>Bạn đang ở chế độ <b>Học Viên B2 (Chỉ xem)</b>. Bạn không có quyền Thêm, Sửa hoặc Xóa dữ liệu học viên.</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold border border-[#2563EB]/20">
            QUẢN LÝ HỌC VIÊN
          </span>
          <h2 className="text-2xl font-black text-[#111827] mt-1 font-heading">
            Danh Sách Học Viên Luyện Thi TELC B2
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi điểm số thi thử, mục tiêu điểm và ngày thi chính thức của từng học viên (10 bản ghi / trang)
          </p>
        </div>

        {currentUser === 'admin' && (
          <button
            onClick={() => onShowToast('Thêm học viên', 'Tính năng thêm học viên mới đã sẵn sàng.', 'info')}
            className="px-4 py-2.5 bg-[#F97316] text-white rounded-xl text-xs font-bold hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" /> Thêm Học Viên Mới
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm tên, email, lớp học viên..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-black text-slate-500">
              <tr>
                <th className="p-4">STT / Học Viên</th>
                <th className="p-4">Lớp Học</th>
                <th className="p-4">Điểm Thi Gần Nhất</th>
                <th className="p-4">Mục Tiêu</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Ngày Thi Dự Kiến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Không tìm thấy học viên nào.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <span className="text-slate-400 text-xs font-black">#{startIndex + idx + 1}</span>
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl border border-slate-200 object-cover shrink-0"
                      />
                      <div>
                        <span className="font-black text-[#111827] text-sm block">{student.name}</span>
                        <span className="text-slate-400 text-[11px] font-normal">{student.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{student.className}</td>
                    <td className="p-4 font-black text-sm text-[#2563EB]">{student.currentScore} / 300</td>
                    <td className="p-4 text-[#F97316]">{student.targetScore} điểm</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-400">
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500">{student.targetExamDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredStudents.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
            <div className="text-slate-500">
              Hiển thị <span className="font-black text-[#111827]">{startIndex + 1}</span> -{' '}
              <span className="font-black text-[#111827]">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)}
              </span>{' '}
              trên tổng số <span className="font-black text-[#2563EB]">{filteredStudents.length}</span> học viên
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg border text-xs font-black cursor-pointer transition-all ${
                    validCurrentPage === page
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white text-[#111827] border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={validCurrentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
