import React, { useState, useEffect } from 'react';
import { VocabItem } from '../../types';
import { Plus, Search, Edit3, Trash2, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminVocabViewProps {
  vocabs: VocabItem[];
  onOpenAddModal: () => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
  onDeleteVocab?: (id: string) => void;
  onEditVocab?: (vocab: VocabItem) => void;
}

const ITEMS_PER_PAGE = 10;

export const AdminVocabView: React.FC<AdminVocabViewProps> = ({
  vocabs,
  onOpenAddModal,
  onShowToast,
  onDeleteVocab,
  onEditVocab,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination on search or topic change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTopic]);

  const topics = ['all', ...Array.from(new Set(vocabs.map((v) => v.topic)))];

  const filteredVocabs = vocabs.filter((v) => {
    const matchesSearch =
      v.word.toLowerCase().includes(search.toLowerCase()) ||
      v.meaningVi.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || v.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const totalPages = Math.max(1, Math.ceil(filteredVocabs.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVocabs = filteredVocabs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = (id: string, word: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa từ vựng "${word}" khỏi từ điển hệ thống?`)) {
      if (onDeleteVocab) {
        onDeleteVocab(id);
      }
      onShowToast('Đã xóa', `Đã xóa từ vựng "${word}".`, 'info');
    }
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
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
            Quản Lý Kho Từ Vựng B2 & Dữ Liệu Flashcard
          </h2>
          <p className="text-xs text-[#4b5563] mt-0.5">
            Quản lý từ vựng, phiên âm, quán từ, nghĩa tiếng Việt và ví dụ ngữ cảnh (10 bản ghi / trang)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-5 py-3 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center gap-2 font-heading uppercase shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Từ Vựng Mới</span>
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
            placeholder="Tìm kiếm từ vựng, nghĩa tiếng Việt..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#4b5563] shrink-0">Chủ đề:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 bg-[#f8fafc] border-2 border-[#111827] rounded-xl text-xs font-bold"
          >
            {topics.map((tp) => (
              <option key={tp} value={tp}>
                {tp === 'all' ? 'Tất cả chủ đề' : tp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Admin Vocab Data Table */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] border-b-2 border-[#111827] text-[#111827] font-black uppercase text-[11px]">
              <tr>
                <th className="p-4">STT</th>
                <th className="p-4">Từ Vựng Tiếng Đức</th>
                <th className="p-4">Loại Từ</th>
                <th className="p-4">Nghĩa Tiếng Việt</th>
                <th className="p-4">Chủ Đề</th>
                <th className="p-4">Ví Dụ Minh Họa</th>
                <th className="p-4 text-center">Thao Tác Quản Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111827]/10 font-semibold">
              {paginatedVocabs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#4b5563]">
                    Không tìm thấy từ vựng nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedVocabs.map((v, idx) => (
                  <tr key={v.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-4 font-black text-[#6b7280]">
                      #{startIndex + idx + 1}
                    </td>
                    <td className="p-4 font-bold text-[#111827]">
                      <div className="flex items-center gap-2">
                        {v.article && (
                          <span className="px-2 py-0.5 rounded bg-[#eff6ff] text-[#1e40af] border border-[#111827] text-[10px] font-black">
                            {v.article}
                          </span>
                        )}
                        <span className="text-sm font-black text-[#111827]">{v.word}</span>
                        <button
                          onClick={() => playAudio(v.word)}
                          className="p-1 hover:bg-[#e2e8f0] rounded text-[#2563EB] cursor-pointer"
                          title="Phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {v.plural && <span className="text-[10px] text-[#6b7280]">Số nhiều: {v.plural}</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-[#f36b92] text-white border border-[#111827] text-[10px] font-black">
                        {v.pos}
                      </span>
                    </td>
                    <td className="p-4 font-black text-[#059669]">
                      {v.meaningVi}
                    </td>
                    <td className="p-4 font-bold text-[#2563EB]">
                      {v.topic}
                    </td>
                    <td className="p-4 text-[11px]">
                      <p className="font-bold text-[#111827] italic">🇩🇪 "{v.exampleDe}"</p>
                      <p className="text-[#4b5563]">🇻🇳 {v.exampleVi}</p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            if (onEditVocab) onEditVocab(v);
                          }}
                          className="px-3 py-1.5 bg-[#fef3c7] text-[#92400e] border border-[#111827] rounded-lg font-bold hover:bg-[#fde68a] flex items-center gap-1 cursor-pointer"
                          title="Sửa từ vựng"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.word)}
                          className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] border border-[#111827] rounded-lg font-bold hover:bg-[#fecdd3] flex items-center gap-1 cursor-pointer"
                          title="Xóa từ vựng"
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

        {/* Pagination Footer */}
        {filteredVocabs.length > 0 && (
          <div className="p-4 bg-[#f8fafc] border-t-2 border-[#111827] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
            <div className="text-[#4b5563]">
              Hiển thị <span className="font-black text-[#111827]">{startIndex + 1}</span> -{' '}
              <span className="font-black text-[#111827]">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredVocabs.length)}
              </span>{' '}
              trên tổng số <span className="font-black text-[#2563EB]">{filteredVocabs.length}</span> từ vựng
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-2 rounded-lg border-2 border-[#111827] bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg border-2 border-[#111827] text-xs font-black cursor-pointer transition-all ${
                    validCurrentPage === page
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-white text-[#111827] hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={validCurrentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg border-2 border-[#111827] bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-all"
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
