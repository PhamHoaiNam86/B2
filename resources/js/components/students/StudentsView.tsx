import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Users, Award, Calendar, Search, Mail, Plus, ShieldAlert, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  currentUser?: 'admin' | 'student';
}

const ITEMS_PER_PAGE = 10;

export const StudentsView: React.FC<StudentsViewProps> = ({ students: initialStudents, onShowToast, currentUser = 'student' }) => {
  const [studentsList, setStudentsList] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  // Fetch real students list from API on mount
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/v1/students').then((r) => r.json());
      if (res.success && Array.isArray(res.data)) {
        setStudentsList(res.data);
      }
    } catch (e) {
      console.warn('Could not fetch students API, using initial props.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleUpdateStatus = async (studentId: string | number, newStatus: 'approved' | 'rejected') => {
    setActionLoadingId(studentId);
    try {
      const res = await fetch(`/api/v1/students/${studentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }).then((r) => r.json());

      if (res.success) {
        onShowToast(
          newStatus === 'approved' ? 'Duyệt Học Viên Thành Công' : 'Từ Chối Học Viên',
          res.message || 'Đã cập nhật trạng thái học viên thành công.',
          newStatus === 'approved' ? 'success' : 'warning'
        );

        // Update local list
        setStudentsList((prev) =>
          prev.map((s) => {
            if (String(s.id) === String(studentId)) {
              return {
                ...s,
                approval_status: newStatus,
                status: newStatus === 'approved' ? 'Đã duyệt' : 'Từ chối',
              };
            }
            return s;
          })
        );
      } else {
        onShowToast('Lỗi Cập Nhật', res.message || 'Không thể cập nhật trạng thái.', 'warning');
      }
    } catch (err) {
      onShowToast('Lỗi Kết Nối', 'Không thể kết nối máy chủ để cập nhật trạng thái.', 'warning');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.className.toLowerCase().includes(search.toLowerCase());

    const appStatus = s.approval_status || (s.status === 'Đã duyệt' ? 'approved' : 'pending');

    if (statusFilter === 'pending') return matchesSearch && appStatus === 'pending';
    if (statusFilter === 'approved') return matchesSearch && appStatus === 'approved';
    if (statusFilter === 'rejected') return matchesSearch && appStatus === 'rejected';

    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pendingCount = studentsList.filter((s) => (s.approval_status || 'pending') === 'pending').length;
  const approvedCount = studentsList.filter((s) => s.approval_status === 'approved').length;
  const rejectedCount = studentsList.filter((s) => s.approval_status === 'rejected').length;

  return (
    <div className="space-[#111827] space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold border border-[#2563EB]/20">
            QUẢN LÝ HỌC VIÊN & DUYỆT TÀI KHOẢN
          </span>
          <h2 className="text-2xl font-black text-[#111827] mt-1 font-heading">
            Danh Sách Học Viên & Xét Duyệt Truy Cập
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin kiểm tra thông tin học viên đăng ký, bấm <strong className="text-emerald-600">Duyệt</strong> để cho phép vào học hoặc <strong className="text-rose-600">Từ chối</strong> nếu chưa thanh toán học phí.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStudents}
            className="px-3.5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Làm Mới
          </button>
          {currentUser === 'admin' && (
            <button
              onClick={() => onShowToast('Thêm học viên', 'Học viên có thể trực tiếp Đăng ký trên web và chờ Admin duyệt.', 'info')}
              className="px-4 py-2.5 bg-[#F97316] text-white rounded-xl text-xs font-bold hover:bg-[#ea580c] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" /> Thêm Học Viên Mới
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-[#111827] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Tất Cả ({studentsList.length})</span>
          </button>

          <button
            onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>⏳ Chờ Duyệt ({pendingCount})</span>
          </button>

          <button
            onClick={() => { setStatusFilter('approved'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✅ Đã Duyệt ({approvedCount})</span>
          </button>

          <button
            onClick={() => { setStatusFilter('rejected'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>❌ Từ Chối ({rejectedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm tên, email học viên..."
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
                <th className="p-4">Trạng Thái Xét Duyệt</th>
                <th className="p-4">Mục Tiêu B2</th>
                <th className="p-4 text-center">Thao Tác Admin Duyệt</th>
                <th className="p-4 text-right">Ngày Đăng Ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Không tìm thấy học viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => {
                  const appStatus = student.approval_status || (student.status === 'Đã duyệt' ? 'approved' : 'pending');

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <span className="text-slate-400 text-xs font-black">#{startIndex + idx + 1}</span>
                        <img
                          src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl border border-slate-200 object-cover shrink-0"
                        />
                        <div>
                          <span className="font-black text-[#111827] text-sm block">{student.name}</span>
                          <span className="text-slate-400 text-[11px] font-normal">{student.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{student.className || 'TELC B2-K26'}</td>
                      
                      {/* Approval Status Badge */}
                      <td className="p-4">
                        {appStatus === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ✅ ĐÃ DUYỆT
                          </span>
                        )}
                        {appStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                            <Clock className="w-3.5 h-3.5" /> ⏳ CHỜ ADMIN DUYỆT
                          </span>
                        )}
                        {appStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            <XCircle className="w-3.5 h-3.5" /> ❌ TỪ CHỐI
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-[#F97316] font-black">{student.targetScore || 300} điểm</td>

                      {/* Admin Approve / Reject Actions */}
                      <td className="p-4 text-center">
                        {currentUser === 'admin' ? (
                          <div className="flex items-center justify-center gap-2">
                            {appStatus !== 'approved' && (
                              <button
                                disabled={actionLoadingId === student.id}
                                onClick={() => handleUpdateStatus(student.id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                              </button>
                            )}
                            {appStatus !== 'rejected' && (
                              <button
                                disabled={actionLoadingId === student.id}
                                onClick={() => handleUpdateStatus(student.id, 'rejected')}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Từ Chối
                              </button>
                            )}
                            {appStatus === 'approved' && (
                              <span className="text-[11px] text-slate-400 font-normal">Đã có quyền học</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-normal">Chỉ Admin được duyệt</span>
                        )}
                      </td>

                      <td className="p-4 text-right text-slate-500">{student.targetExamDate || '---'}</td>
                    </tr>
                  );
                })
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
