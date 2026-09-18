import React, { useState } from 'react';
import { LeaderboardUser } from '../../types';
import { Trophy, Flame, Zap, Award, Star, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LeaderboardViewProps {
  users: LeaderboardUser[];
  currentUserExp?: number;
  currentUserStreak?: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  users,
  currentUserExp = 1450,
  currentUserStreak = 7,
}) => {
  const [filterType, setFilterType] = useState<'exp' | 'streak' | 'score'>('exp');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort users based on filter type
  const sortedUsers = [...users].sort((a, b) => {
    if (filterType === 'exp') return b.exp - a.exp;
    if (filterType === 'streak') return b.streakDays - a.streakDays;
    return b.avgExamScore - a.avgExamScore;
  });

  const filteredUsers = sortedUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = sortedUsers.slice(0, 3);

  return (
    <div className="space-y-6 w-full">
      {/* HEADER BANNER */}
      <div className="bg-[#111827] text-white border-4 border-[#2563EB] rounded-2xl p-6 sm:p-8 brutal-shadow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-black uppercase tracking-wider">
            🏆 BẢNG XẾP HẠNG TRIỆU VỸ DEUTSCH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            Vinh Danh Học Viên Xuất Sắc
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-medium">
            Tích lũy **EXP** từ bài tập từ vựng & bài thi thử, duy trì chuỗi học **Streak** liên tục để chinh phục TOP 1 Bảng Vàng!
          </p>
        </div>

        {/* Current User Stats Card */}
        <div className="bg-white/10 border-2 border-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shrink-0 brutal-shadow-xs">
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-300 font-bold uppercase block">Chuỗi Ngày Học</span>
            <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-500" />
              <span>{currentUserStreak} Ngày</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-300 font-bold uppercase block">Điểm Tích Lũy</span>
            <div className="text-xl font-black text-blue-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 fill-blue-400 text-blue-300" />
              <span>{currentUserExp} EXP</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-4 brutal-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('exp')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border-2 text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 font-heading ${
              filterType === 'exp'
                ? 'bg-[#2563EB] text-white border-[#111827] brutal-shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111827]'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" /> Top EXP (Kinh Nghiệm)
          </button>
          <button
            onClick={() => setFilterType('streak')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border-2 text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 font-heading ${
              filterType === 'streak'
                ? 'bg-[#F97316] text-white border-[#111827] brutal-shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111827]'
            }`}
          >
            <Flame className="w-4 h-4 text-yellow-300" /> Chuỗi Streak 🔥
          </button>
          <button
            onClick={() => setFilterType('score')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border-2 text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 font-heading ${
              filterType === 'score'
                ? 'bg-[#059669] text-white border-[#111827] brutal-shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#111827]'
            }`}
          >
            <Trophy className="w-4 h-4 text-emerald-200" /> Điểm Thi Cao Nhất
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên học viên..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-[#111827] rounded-xl text-xs text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow flex flex-col items-center text-center space-y-3 relative overflow-hidden order-2 md:order-1 mt-0 md:mt-4">
            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black border border-[#111827]">
              HẠNG 2 🥈
            </div>
            <div className="relative mt-2">
              <img
                src={topThree[1].avatarUrl}
                alt={topThree[1].name}
                className="w-16 h-16 rounded-full border-4 border-slate-300 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 text-white font-black text-xs flex items-center justify-center border border-white">
                2
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#111827] font-heading">{topThree[1].name}</h4>
              <span className="text-[10px] font-bold text-slate-500 uppercase">{topThree[1].levelTitle}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-black">
              <span className="text-[#2563EB]">{topThree[1].exp} EXP</span>
              <span className="text-amber-600">🔥 {topThree[1].streakDays} ngày</span>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="bg-[#fffbeb] border-4 border-[#111827] rounded-2xl p-6 brutal-shadow flex flex-col items-center text-center space-y-3 relative overflow-hidden order-1 md:order-2">
            <div className="absolute top-2 left-2 px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black border border-[#111827] animate-pulse">
              QUÁN QUÂN 🥇
            </div>
            <div className="relative mt-2">
              <img
                src={topThree[0].avatarUrl}
                alt={topThree[0].name}
                className="w-20 h-20 rounded-full border-4 border-amber-400 object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center border-2 border-white">
                1
              </div>
            </div>
            <div>
              <h4 className="text-base font-black text-[#111827] font-heading">{topThree[0].name}</h4>
              <span className="text-xs font-black text-amber-700 uppercase">{topThree[0].levelTitle}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-black">
              <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-lg border border-amber-400">
                ⭐ {topThree[0].exp} EXP
              </span>
              <span className="px-3 py-1 bg-orange-200 text-orange-900 rounded-lg border border-orange-400">
                🔥 {topThree[0].streakDays} ngày
              </span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 brutal-shadow flex flex-col items-center text-center space-y-3 relative overflow-hidden order-3 md:order-3 mt-0 md:mt-6">
            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-[#111827]">
              HẠNG 3 🥉
            </div>
            <div className="relative mt-2">
              <img
                src={topThree[2].avatarUrl}
                alt={topThree[2].name}
                className="w-16 h-16 rounded-full border-4 border-amber-600 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center border border-white">
                3
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#111827] font-heading">{topThree[2].name}</h4>
              <span className="text-[10px] font-bold text-slate-500 uppercase">{topThree[2].levelTitle}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-black">
              <span className="text-[#2563EB]">{topThree[2].exp} EXP</span>
              <span className="text-amber-600">🔥 {topThree[2].streakDays} ngày</span>
            </div>
          </div>
        </div>
      )}

      {/* FULL LEADERBOARD TABLE */}
      <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl brutal-shadow overflow-hidden">
        <div className="p-4 bg-slate-50 border-b-2 border-[#111827] font-black text-xs text-[#111827] flex items-center justify-between font-heading">
          <span>DANH SÁCH BẢNG XẾP HẠNG TOÀN DIỆN</span>
          <span>Tổng số {filteredUsers.length} học viên</span>
        </div>

        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl space-y-3">
              <Trophy className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-[#111827] font-heading">Chưa có dữ liệu Bảng Xếp Hạng trong CSDL MySQL</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Bảng xếp hạng sẽ tự động cập nhật khi học viên hoàn thành bài thi hoặc Admin thêm học viên mới!
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-black text-slate-600 uppercase border-b-2 border-slate-200">
                  <th className="p-3.5 text-center w-16">Thứ Hạng</th>
                  <th className="p-3.5">Học Viên</th>
                  <th className="p-3.5">Danh Hiệu</th>
                  <th className="p-3.5 text-center">Chuỗi Streak</th>
                  <th className="p-3.5 text-center">Tổng EXP</th>
                  <th className="p-3.5 text-center">Điểm Thi Trung Bình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-[#111827]">
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-blue-50/50 transition-colors ${
                      idx < 3 ? 'bg-slate-50/80 font-black' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center font-black">
                      {idx === 0 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mx-auto text-xs border border-[#111827]">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center mx-auto text-xs border border-[#111827]">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto text-xs border border-[#111827]">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-9 h-9 rounded-full border border-[#111827] object-cover"
                        />
                        <div>
                          <span className="font-black text-xs block">{user.name}</span>
                          <span className="text-[10px] text-slate-500">{user.passedExamsCount} bài thi đỗ</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black border border-blue-300">
                        {user.levelTitle}
                      </span>
                    </td>
                    <td className="p-3.5 text-center text-amber-600 font-black">
                      🔥 {user.streakDays} ngày
                    </td>
                    <td className="p-3.5 text-center text-[#2563EB] font-black">
                      ⭐ {user.exp.toLocaleString()} EXP
                    </td>
                    <td className="p-3.5 text-center text-emerald-600 font-black">
                      {user.avgExamScore} / 300 điểm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
