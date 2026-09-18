import React, { useState } from 'react';
import { DiscussionComment } from '../../types';
import { MessageSquare, Send, Heart, User, Sparkles, AlertCircle } from 'lucide-react';

interface ExamDiscussionDrawerProps {
  examCode: string;
  examTitle: string;
  comments: DiscussionComment[];
  onAddComment: (examCode: string, content: string) => void;
  onToggleLike?: (commentId: string) => void;
}

export const ExamDiscussionDrawer: React.FC<ExamDiscussionDrawerProps> = ({
  examCode,
  examTitle,
  comments,
  onAddComment,
  onToggleLike,
}) => {
  const [newCommentText, setNewCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(examCode, newCommentText.trim());
    setNewCommentText('');
  };

  const filteredComments = comments.filter((c) => c.examCode === examCode);

  return (
    <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border-2 border-[#111827] flex items-center justify-center text-[#2563EB]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#111827] font-heading flex items-center gap-2">
              Kênh Thảo Luận & Hỏi Đáp Đề Thi
              <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[11px] font-bold">
                {examCode}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Trao đổi giải thích đáp án & kinh nghiệm làm bài thi {examTitle}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
          {filteredComments.length} bình luận
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={`Viết câu hỏi hoặc chia sẻ mẹo giải đề cho mã thi ${examCode}...`}
            rows={3}
            className="w-full p-3.5 bg-slate-50 border-2 border-[#111827] rounded-xl text-xs text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Tăng +5 EXP khi đóng góp câu trả lời thảo luận có ích!
          </p>
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-5 py-2 bg-[#2563EB] text-white text-xs font-black rounded-xl border-2 border-[#111827] hover:bg-[#1d4ed8] disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 brutal-shadow-xs uppercase font-heading"
          >
            <Send className="w-3.5 h-3.5" /> Gửi Bình Luận
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Chưa có bình luận nào cho đề thi này.</p>
            <p className="text-[11px] text-slate-400">Hãy là người đầu tiên mở bát thảo luận!</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-slate-50 border-2 border-[#111827]/20 rounded-xl space-y-2 hover:border-[#111827] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={comment.avatarUrl}
                    alt={comment.studentName}
                    className="w-7 h-7 rounded-full border border-[#111827] object-cover"
                  />
                  <div>
                    <span className="text-xs font-black text-[#111827]">{comment.studentName}</span>
                    <span className="text-[10px] text-slate-400 block">{comment.createdAt}</span>
                  </div>
                </div>
                {onToggleLike && (
                  <button
                    onClick={() => onToggleLike(comment.id)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      comment.userLiked
                        ? 'bg-rose-100 text-rose-700 border-rose-300'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-current text-rose-600' : ''}`} />
                    <span>{comment.likes}</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium pl-9">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
