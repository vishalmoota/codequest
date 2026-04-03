import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AvatarDisplay from '../components/AvatarDisplay';
import RankBadge from '../components/RankBadge';
import { Trophy, Zap, Crown, Loader2, Medal, Flame, Star, TrendingUp } from 'lucide-react';
import QuestLoader from '../components/QuestLoader';

const BADGE_MAP = {
  first_blood:    '🩸',
  level_2_unlock: '🔓',
  level_3_unlock: '🔓',
  level_4_unlock: '🔓',
  level_5_unlock: '🔓',
  xp_100:         '⚡',
  xp_500:         '🚀',
  js_master:      '🏆',
};

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    api.get('/leaderboard').then(r => {
      setLeaders(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getRankStyle = (idx) => {
    if (idx === 0) return 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/40 shadow-lg shadow-yellow-500/5';
    if (idx === 1) return 'from-slate-400/10 to-slate-500/5 border-slate-400/30';
    if (idx === 2) return 'from-orange-700/20 to-orange-800/5 border-orange-700/30';
    return 'from-dark-700/50 to-dark-700/30 border-dark-400/30';
  };

  const getRankIcon = (idx) => {
    if (idx === 0) return <Crown size={20} className="text-yellow-400" />;
    if (idx === 1) return <Medal size={20} className="text-slate-400" />;
    if (idx === 2) return <Medal size={20} className="text-orange-600" />;
    return <span className="text-slate-500 font-bold text-sm w-5 text-center">{idx + 1}</span>;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <QuestLoader size="lg" />
    </div>
  );

  // Find current user position
  const userIdx = leaders.findIndex(l => l._id === user?._id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-400/10 rounded-2xl border border-yellow-400/20 mb-4">
          <Trophy size={36} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-slate-400">Top coders ranked by XP earned</p>

        {/* Your position card */}
        {userIdx >= 0 && (
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-primary-600/10 rounded-xl border border-primary-500/20">
            <span className="text-sm text-slate-400">Your Rank:</span>
            <span className="text-lg font-bold text-primary-300">#{userIdx + 1}</span>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-yellow-400 flex items-center gap-1">
              <Zap size={13} /> {leaders[userIdx]?.xp} XP
            </span>
          </div>
        )}
      </div>

      {/* Top 3 podium (if 3+ users) */}
      {leaders.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {[1, 0, 2].map(idx => {
            const leader = leaders[idx];
            const isFirst = idx === 0;
            return (
              <div
                key={leader._id}
                className={`flex flex-col items-center transition-all ${isFirst ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}
              >
                <div className="relative mb-2">
                  <AvatarDisplay avatar={leader.avatar} size={isFirst ? 'lg' : 'md'} />
                  {isFirst && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Crown size={20} className="text-yellow-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-200 mb-0.5">{leader.username}</span>
                <RankBadge xp={leader.xp} size="sm" />
                <div className={`mt-2 w-20 rounded-t-xl flex items-center justify-center font-bold text-lg
                  ${isFirst
                    ? 'h-24 bg-yellow-500/20 text-yellow-300 border-t border-x border-yellow-500/30'
                    : idx === 1
                    ? 'h-16 bg-slate-400/10 text-slate-400 border-t border-x border-slate-400/20'
                    : 'h-12 bg-orange-600/10 text-orange-400 border-t border-x border-orange-600/20'}`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs opacity-60">#{idx + 1}</span>
                    <span className="text-sm flex items-center gap-1"><Zap size={11} />{leader.xp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {leaders.map((leader, idx) => {
          const isCurrentUser = leader._id === user?._id;
          return (
            <div
              key={leader._id}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center gap-4 p-4 bg-gradient-to-r border rounded-2xl transition-all duration-200
                ${getRankStyle(idx)} ${isCurrentUser ? 'ring-2 ring-primary-500/50' : ''}
                ${hoveredIdx === idx ? 'scale-[1.01]' : ''}`}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center flex-shrink-0">
                {getRankIcon(idx)}
              </div>

              {/* Avatar */}
              <AvatarDisplay avatar={leader.avatar} size="sm" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isCurrentUser ? 'text-primary-300' : 'text-slate-100'}`}>
                    {leader.username}
                  </span>
                  {isCurrentUser && <span className="text-xs text-primary-400 font-medium bg-primary-500/10 px-1.5 py-0.5 rounded">(you)</span>}
                  <RankBadge xp={leader.xp} size="sm" />
                </div>
                {/* Micro info */}
                <div className="flex items-center gap-3 mt-0.5">
                  {leader.badges?.length > 0 && (
                    <div className="flex gap-0.5">
                      {leader.badges.slice(0, 4).map(b => (
                        <span key={b} className="text-xs">{BADGE_MAP[b] || '🏅'}</span>
                      ))}
                      {leader.badges.length > 4 && <span className="text-xs text-slate-500">+{leader.badges.length - 4}</span>}
                    </div>
                  )}
                  {leader.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-orange-400">
                      <Flame size={10} /> {leader.streak}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 justify-end">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-lg font-bold text-yellow-300">{leader.xp}</span>
                </div>
                <div className="text-xs text-slate-500">Lv. {leader.level}</div>
              </div>
            </div>
          );
        })}

        {leaders.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Trophy size={48} className="mx-auto mb-4 opacity-30" />
            <p>No users yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
