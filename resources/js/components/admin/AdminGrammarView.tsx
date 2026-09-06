import React, { useState } from 'react';
import { GrammarTopic } from '../../types';
import { Plus, Search, Edit3, Trash2, Eye, Brain, BookOpen, CheckCircle2 } from 'lucide-react';

interface AdminGrammarViewProps {
  topics: GrammarTopic[];
  onSelectTopic: (topic: GrammarTopic) => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  onDeleteTopic?: (id: string) => void;
  onAddNewTopic?: () => void;
}

export const AdminGrammarView: React.FC<AdminGrammarViewProps> = ({
  topics,
  onSelectTopic,
  onShowToast,
  onDeleteTopic,
  onAddNewTopic,
}) => {
  const [search, setSearch] = useState('');

  const filteredTopics = topics.filter((t) => {
    return (
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chuyên đề ngữ pháp "${title}"?`)) {
      if (onDeleteTopic) {
        onDeleteTopic(id);
      }
      onShowToast('Đã xóa', `Đã xóa chuyên đề ngữ pháp "${title}".`, 'info');
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
            Quản Lý Chuyên Đề Ngữ Pháp & Bẫy Đề Thi
          </h2>
          <p className="text-xs text-[#4b5563] mt-0.5">
            Quản lý lý thuyết, câu trúc bẫy đề và bài tập củng cố ngữ pháp chuẩn B2
          </p>
        </div>

        <button
          onClick={() => {
            if (onAddNewTopic) onAddNewTopic();
            onShowToast('Tính năng', 'Đã mở Form thêm chuyên đề ngữ pháp mới.', 'info');
          }}
          className="px-5 py-3 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-2 font-heading uppercase shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Chuyên Đề Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-2 border-[#111827] rounded-xl p-4 brutal-shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm chuyên đề ngữ pháp, danh mục..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Admin Grammar Data Table */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] border-b-2 border-[#111827] text-[#111827] font-black uppercase text-[11px]">
              <tr>
                <th className="p-4">STT</th>
                <th className="p-4">Tên Chuyên Đề Ngữ Pháp</th>
                <th className="p-4">Cấp Độ</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Số Quy Tắc Bẫy</th>
                <th className="p-4">Số Ví Dụ</th>
                <th className="p-4 text-center">Thao Tác Quản Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111827]/10 font-semibold">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#4b5563]">
                    Không tìm thấy chuyên đề ngữ pháp nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic, idx) => (
                  <tr key={topic.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-4 font-black text-[#6b7280]">
                      #{idx + 1}
                    </td>
                    <td className="p-4 font-bold text-[#111827]">
                      <div>
                        <div className="text-sm font-black">{topic.title}</div>
                        <span className="text-[10px] text-[#4b5563] line-clamp-1">{topic.summary}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f36b92] text-white border border-[#111827] text-[10px] font-black">
                        {topic.level}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#2563EB]">
                      {topic.category}
                    </td>
                    <td className="p-4 font-black text-[#111827]">
                      {topic.rulePoints.length} Quy tắc
                    </td>
                    <td className="p-4 font-black text-[#059669]">
                      {topic.examples.length} Ví dụ
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onSelectTopic(topic)}
                          className="px-3 py-1.5 bg-[#eff6ff] text-[#1e40af] border border-[#111827] rounded-lg font-bold hover:bg-[#dbeafe] flex items-center gap-1 cursor-pointer"
                          title="Xem bài học"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem
                        </button>
                        <button
                          onClick={() => onSelectTopic(topic)}
                          className="px-3 py-1.5 bg-[#fef3c7] text-[#92400e] border border-[#111827] rounded-lg font-bold hover:bg-[#fde68a] flex items-center gap-1 cursor-pointer"
                          title="Sửa chuyên đề"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(topic.id, topic.title)}
                          className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] border border-[#111827] rounded-lg font-bold hover:bg-[#fecdd3] flex items-center gap-1 cursor-pointer"
                          title="Xóa chuyên đề"
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
