import React, { useState } from 'react';
import { Sparkles, Flame, Trophy, Lock, Send, Smile, UserCheck, AlertTriangle, FileText, CheckCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  level: string;
  time: string;
  text: string;
  isAnonymous?: boolean;
}

interface DocumentMaterialViewProps {
  type: 'schreiben' | 'sprechen';
  onShowToast: (title: string, msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const DocumentMaterialView: React.FC<DocumentMaterialViewProps> = ({ type, onShowToast }) => {
  // Leaderboard state
  const [lbTab, setLbTab] = useState<'exp' | 'streak' | 'done'>('exp');
  const [lbFilter, setLbFilter] = useState<'all' | 'week' | 'month'>('all');

  // Interactive chat stream
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Ẩn danh', level: 'B2', time: '15:14', text: 'có ai ets 18 này k ạ', isAnonymous: true },
    { id: '2', user: 'Minh Huyền', level: 'B2', time: '15:43', text: 'ai thi ở Eurocom cho e hỏi là có trùng đề nói như trong đây ko ạ' },
    { id: '3', user: 'Ẩn danh', level: 'B2', time: '16:11', text: 'có ai tacom m7/9 này k ạ', isAnonymous: true },
    { id: '4', user: 'Ẩn danh', level: 'B2', time: '16:31', text: 'có minh cũng ets 18 nhé', isAnonymous: true },
  ]);
  const [newMsgText, setNewMsgText] = useState('');
  const [isAnonMode, setIsAnonMode] = useState(true);

  // User Stats
  const [userExp, setUserExp] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);
  const [studyMinutes, setStudyMinutes] = useState(0);

  const isSchreiben = type === 'schreiben';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: isAnonMode ? 'Ẩn danh' : 'Phạm Nam',
      level: 'B2',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newMsgText.trim(),
      isAnonymous: isAnonMode,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMsgText('');
    onShowToast('Đã gửi tin nhắn', 'Tin nhắn của bạn đã xuất hiện trên Kênh Thảo Luận.', 'info');
  };

  const schreibenDocs = [
    {
      id: 'doc-s1',
      title: 'TÀI LIỆU SCHREIBEN B2',
      description: 'Tuyển tập đề mẫu & từ vựng chuyên sâu Beschwerdebrief & Bitte um Information',
      isPremium: true,
      badge: 'PREMIUM',
    },
    {
      id: 'doc-s2',
      title: 'BỘ 20 BÀI MẪU BESCHWERDEBRIEF 45/45',
      description: 'Tuyển tập bài mẫu đạt điểm tối đa kèm phân tích cấu trúc từ nối B2',
      isPremium: false,
      badge: 'MIỄN PHÍ',
    },
    {
      id: 'doc-s3',
      title: 'KHO TỪ VỰNG & CẤU TRÚC VIẾT THƯ B2',
      description: 'Hơn 150 mẫu câu chuẩn TELC cho phần Schriftlicher Ausdruck',
      isPremium: false,
      badge: 'HOT',
    },
  ];

  const sprechenDocs = [
    {
      id: 'doc-sp1',
      title: 'BỘ ĐỀ SPRECHEN B2',
      description: 'Tài liệu PDF tham khảo & dàn ý chi tiết 3 phần thi nói TELC B2',
      isPremium: true,
      badge: 'PREMIUM',
    },
    {
      id: 'doc-sp2',
      title: 'MÜNDLICHE PRÜFUNG MP3 + KỊCH BẢN',
      description: 'File ghi âm bài nói mẫu giữa 2 thí sinh B2 đạt kết quả Sehr Gut',
      isPremium: false,
      badge: 'HOT',
    },
    {
      id: 'doc-sp3',
      title: 'CÂU HỎI GEMEINSAM ETWAS PLANEN B2',
      description: 'Tổng hợp 30 tình huống lên kế hoạch theo cặp trong phần thi nói',
      isPremium: false,
      badge: 'MIỄN PHÍ',
    },
  ];

  const currentDocs = isSchreiben ? schreibenDocs : sprechenDocs;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP HEADER & MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 8 COLS: Title, Stats Row, Material Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1b1b] font-heading uppercase tracking-wide">
              {isSchreiben ? 'TÀI LIỆU SCHREIBEN' : 'TÀI LIỆU SPRECHEN'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#564145] mt-1">
              Chọn một kỹ năng bên dưới để bắt đầu luyện tập.
            </p>
          </div>

          {/* 3 STAT CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: EXP */}
            <div className="p-4 bg-[#e2f7e9] border-[2.5px] border-[#1c1b1b] rounded-2xl brutal-shadow space-y-1">
              <span className="text-[11px] font-black uppercase text-[#0d5225] tracking-wider block">
                TỔNG KINH NGHIỆM
              </span>
              <p className="text-2xl font-black text-[#0d5225] font-heading">
                {userExp} <span className="text-sm">EXP</span>
              </p>
            </div>

            {/* Stat 2: Completed */}
            <div className="p-4 bg-[#e8f1ff] border-[2.5px] border-[#1c1b1b] rounded-2xl brutal-shadow space-y-1">
              <span className="text-[11px] font-black uppercase text-[#003882] tracking-wider block">
                BÀI ĐÃ LÀM
              </span>
              <p className="text-2xl font-black text-[#003882] font-heading">
                {completedCount}
              </p>
            </div>

            {/* Stat 3: Time */}
            <div className="p-4 bg-[#fff8e7] border-[2.5px] border-[#1c1b1b] rounded-2xl brutal-shadow space-y-1">
              <span className="text-[11px] font-black uppercase text-[#734c00] tracking-wider block">
                THỜI GIAN HỌC
              </span>
              <p className="text-2xl font-black text-[#734c00] font-heading">
                {studyMinutes}p
              </p>
            </div>
          </div>

          {/* MATERIAL CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {currentDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow space-y-4 relative flex flex-col justify-between hover:translate-y-[-2px] transition-all"
              >
                {/* Premium Gold Tag at Top Right */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#fff3d6] border-2 border-[#1c1b1b] flex items-center justify-center font-black brutal-shadow-xs">
                    <FileText className="w-5 h-5 text-[#1c1b1b]" />
                  </div>

                  {doc.isPremium ? (
                    <span className="px-2.5 py-1 rounded-lg bg-[#ffe082] text-[#3e2723] text-[10px] font-black border-2 border-[#1c1b1b] brutal-shadow-xs flex items-center gap-1">
                      <Lock className="w-3 h-3 fill-current" /> PREMIUM
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-[#e2f7e9] text-[#0d5225] text-[10px] font-black border-2 border-[#1c1b1b] brutal-shadow-xs">
                      {doc.badge}
                    </span>
                  )}
                </div>

                {/* Card Title & Desc */}
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#1c1b1b] font-heading uppercase leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#564145] leading-relaxed font-medium">
                    {doc.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {doc.isPremium ? (
                    <button
                      onClick={() =>
                        onShowToast('Nâng cấp Premium', 'Gói tài liệu Premium bao gồm toàn bộ bài mẫu PDF và MP3 chuẩn TELC B2.', 'info')
                      }
                      className="w-full py-2.5 bg-[#ffe082] text-[#3e2723] border-2 border-[#1c1b1b] rounded-xl font-black text-xs brutal-shadow-xs hover:bg-[#ffd54f] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-heading uppercase"
                    >
                      <Lock className="w-3.5 h-3.5 fill-current" /> PREMIUM
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUserExp((prev) => prev + 5);
                        onShowToast('Mở tài liệu', `Đã mở tài liệu "${doc.title}". +5 EXP!`, 'success');
                      }}
                      className="w-full py-2.5 bg-[#f36b92] text-white border-2 border-[#1c1b1b] rounded-xl font-black text-xs brutal-shadow-xs hover:bg-[#a83159] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-heading uppercase"
                    >
                      XEM TÀI LIỆU &amp; HỌC NGAY
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT 4 COLS: Leaderboard & Streak Tracker */}
        <div className="lg:col-span-4 space-y-6">
          {/* BẢNG XẾP HẠNG (Leaderboard Widget) */}
          <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow space-y-4 relative">
            {/* FlashSale Badge top right */}
            <div className="absolute -top-3.5 right-4 px-3 py-1 bg-[#ba1a1a] text-white text-[10px] font-black rounded-full border-2 border-[#1c1b1b] brutal-shadow-xs flex items-center gap-1 animate-pulse uppercase">
              🔥 FLASHSALE -40%
            </div>

            <h3 className="text-base font-black text-[#1c1b1b] font-heading flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#ffe082] fill-[#ffe082]" />
              BẢNG XẾP HẠNG
            </h3>

            {/* Main Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl text-[10px] font-black">
              <button
                onClick={() => setLbTab('exp')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  lbTab === 'exp' ? 'bg-white text-[#1c1b1b] border border-[#1c1b1b] brutal-shadow-xs' : 'text-[#564145]'
                }`}
              >
                KINH NGHIỆM
              </button>
              <button
                onClick={() => setLbTab('streak')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  lbTab === 'streak' ? 'bg-white text-[#1c1b1b] border border-[#1c1b1b] brutal-shadow-xs' : 'text-[#564145]'
                }`}
              >
                CHUỖI NGÀY
              </button>
              <button
                onClick={() => setLbTab('done')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  lbTab === 'done' ? 'bg-white text-[#1c1b1b] border border-[#1c1b1b] brutal-shadow-xs' : 'text-[#564145]'
                }`}
              >
                BÀI ĐÃ LÀM
              </button>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center justify-end gap-1.5 text-[9px] font-black">
              {(['all', 'week', 'month'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setLbFilter(f)}
                  className={`px-2.5 py-1 rounded-md border border-[#1c1b1b] cursor-pointer ${
                    lbFilter === f ? 'bg-[#1c1b1b] text-white' : 'bg-white text-[#1c1b1b]'
                  }`}
                >
                  {f === 'all' ? 'TẤT CẢ' : f === 'week' ? 'TUẦN' : 'THÁNG'}
                </button>
              ))}
            </div>

            {/* Ranking List */}
            <div className="space-y-2 text-xs font-bold pt-1">
              <div className="flex items-center justify-between p-2.5 bg-[#fff8e7] border-2 border-[#1c1b1b] rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ffe082] text-[#3e2723] border border-[#1c1b1b] text-[10px] font-black flex items-center justify-center">1</span>
                  <span>Phạm Đức Anh</span>
                </div>
                <span className="font-black text-[#734c00]">2,500 EXP</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#e0e0e0] text-[#1c1b1b] border border-[#1c1b1b] text-[10px] font-black flex items-center justify-center">2</span>
                  <span>Nguyễn Văn Minh</span>
                </div>
                <span className="font-black text-[#1c1b1b]">1,800 EXP</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#d7ccc8] text-[#3e2723] border border-[#1c1b1b] text-[10px] font-black flex items-center justify-center">3</span>
                  <span>Trần Thị Thu Thảo</span>
                </div>
                <span className="font-black text-[#1c1b1b]">1,200 EXP</span>
              </div>
            </div>
          </div>

          {/* CHUỖI HỌC TẬP (Streak Tracker Widget matching Screenshot) */}
          <div className="bg-[#fff8e7] border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow text-center space-y-3">
            <h3 className="text-sm font-black text-[#734c00] font-heading uppercase tracking-wider">
              CHUỖI HỌC TẬP
            </h3>

            {/* Fire flame */}
            <div className="w-16 h-16 mx-auto rounded-full bg-[#ffe082] border-2 border-[#1c1b1b] flex items-center justify-center brutal-shadow-xs animate-bounce">
              <Flame className="w-10 h-10 text-[#f36b92] fill-[#f36b92]" />
            </div>

            <div>
              <p className="text-4xl font-black text-[#1c1b1b] font-heading leading-none">1</p>
              <span className="text-[11px] font-black text-[#564145] uppercase tracking-wider block mt-1">
                NGÀY LIÊN TIẾP
              </span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-white text-[#734c00] border-2 border-[#1c1b1b] text-[10px] font-black brutal-shadow-xs">
              🥇 Còn 2 ngày – +5 EXP
            </div>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: KÊNH THẢO LUẬN (Live Community Chat Channel matching Screenshot) */}
      <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-5 brutal-shadow space-y-4">
        {/* Chat Channel Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1c1b1b] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-black text-[#1c1b1b] font-heading uppercase">
              KÊNH THẢO LUẬN
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#fcf9f8] text-[#564145] text-[10px] font-black border border-[#1c1b1b]">
              9
            </span>
          </div>

          <button
            onClick={() => setIsAnonMode(!isAnonMode)}
            className="px-3 py-1 rounded-xl bg-[#fcf9f8] text-[#1c1b1b] border-2 border-[#1c1b1b] text-xs font-bold flex items-center gap-1.5 cursor-pointer brutal-shadow-xs hover:bg-[#ffe3ea]"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#f36b92]" />
            <span>{isAnonMode ? '🕵️‍♂️ Ẩn danh' : '👤 Phạm Nam'}</span>
          </button>
        </div>

        {/* Chat Stream Messages Container */}
        <div className="p-4 bg-[#f8f5ee] border-2 border-[#1c1b1b] rounded-xl space-y-3 max-h-64 overflow-y-auto">
          <div className="text-center">
            <span className="px-3 py-0.5 rounded-full bg-[#e8e2d5] text-[#564145] text-[10px] font-bold">
              Hôm nay
            </span>
          </div>

          {chatMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-full bg-[#ffe082] border border-[#1c1b1b] flex items-center justify-center font-black text-[10px] shrink-0">
                {msg.user.substring(0, 2)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1c1b1b]">{msg.user}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#ffe3ea] text-[#800035] text-[9px] font-black border border-[#1c1b1b]">
                    {msg.level}
                  </span>
                  <span className="text-[10px] text-[#897175]">{msg.time}</span>
                </div>
                <div className="p-2.5 bg-white border border-[#1c1b1b] rounded-xl rounded-tl-none font-semibold text-[#1c1b1b] shadow-xs inline-block">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2.5 rounded-xl border-2 border-[#1c1b1b] bg-[#ffe082] hover:bg-[#ffd54f] cursor-pointer shrink-0"
          >
            <Smile className="w-4 h-4 text-[#3e2723]" />
          </button>
          <input
            type="text"
            value={newMsgText}
            onChange={(e) => setNewMsgText(e.target.value)}
            placeholder="Nhập tin nhắn thắc mắc bài học B2..."
            className="flex-1 px-4 py-2.5 bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f36b92]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl border-2 border-[#1c1b1b] bg-[#f36b92] text-white hover:bg-[#a83159] cursor-pointer shrink-0 brutal-shadow-xs"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};
