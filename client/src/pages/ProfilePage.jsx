import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import XPBar from '../components/XPBar';
import AvatarDisplay from '../components/AvatarDisplay';
import RankBadge from '../components/RankBadge';
import StreakCalendar from '../components/StreakCalendar';
import {
  User, Zap, Trophy, Target, Calendar, CheckCircle2, Loader2,
  Code2, Star, Flame, Award, Shield, Swords, TrendingUp, Edit3
} from 'lucide-react';
import QuestLoader from '../components/QuestLoader';

const BADGE_INFO = {
  first_blood:    { label: 'First Blood',      emoji: '🩸', desc: 'Solved your first challenge' },
  level_2_unlock: { label: 'Level 2 Unlock',   emoji: '🔓', desc: 'Unlocked Level 2' },
  level_3_unlock: { label: 'Level 3 Unlock',   emoji: '🔓', desc: 'Unlocked Level 3' },
  level_4_unlock: { label: 'Level 4 Unlock',   emoji: '🔓', desc: 'Unlocked Level 4' },
  level_5_unlock: { label: 'Level 5 Unlock',   emoji: '🔓', desc: 'Unlocked Level 5' },
  xp_100:         { label: '100 XP Club',       emoji: '⚡', desc: 'Earned 100+ XP' },
  xp_500:         { label: '500 XP Legend',     emoji: '🚀', desc: 'Earned 500+ XP' },
  js_master:      { label: 'JS Master',         emoji: '🏆', desc: 'Completed all challenges' },
};

const LEVEL_NAMES = ['Basics', 'Conditionals', 'Loops', 'Functions', 'Arrays & Objects'];

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.get('/profile').then(r => {
      setProfile(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <QuestLoader size="lg" />
    </div>
  );

  const completionPct = profile ? Math.round(profile.completedChallenges / Math.max(profile.totalChallenges, 1) * 100) : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'badges', label: 'Badges', icon: Trophy },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      {/* Profile header */}
      <div className="relative overflow-hidden card mb-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-purple/10" />
        <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
          <div className="grid grid-cols-6 gap-1 p-2">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="w-full aspect-square bg-white rounded-sm" />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <AvatarDisplay avatar={profile?.avatar || user?.avatar} size="xl" />
            <div className="absolute -bottom-1 -right-1">
              <RankBadge xp={profile?.xp || 0} size="sm" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">{profile?.username}</h1>
              <RankBadge xp={profile?.xp || 0} size="md" />
            </div>
            <p className="text-slate-400 text-sm mb-3">{profile?.email}</p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                <Zap size={13} /> {profile?.xp} XP
              </span>
              <span className="flex items-center gap-1.5 text-sm text-primary-300 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                <Star size={13} /> Level {profile?.level}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                <Flame size={13} /> {profile?.streak || 0} day streak
              </span>
              <span className="flex items-center gap-1.5 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Calendar size={13} /> Joined {new Date(profile?.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <Link to="/achievements" className="flex items-center gap-2 btn-secondary text-sm">
            <Award size={16} /> Achievements
          </Link>
        </div>

        <div className="relative mt-6 pt-6 border-t border-dark-400/50">
          <XPBar xp={profile?.xp || 0} level={profile?.level || 1} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-dark-700 p-1 rounded-xl border border-dark-400/30 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${activeTab === tab.id
                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-600/50'}`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'XP Earned', value: profile?.xp, icon: <Zap size={22} className="text-yellow-400" />, color: 'text-yellow-300', bg: 'bg-yellow-400/10' },
              { label: 'Level', value: profile?.level, icon: <Star size={22} className="text-primary-400" />, color: 'text-primary-300', bg: 'bg-primary-400/10' },
              { label: 'Day Streak', value: profile?.streak || 0, icon: <Flame size={22} className="text-orange-400" />, color: 'text-orange-300', bg: 'bg-orange-400/10' },
              { label: 'Solved', value: `${profile?.completedChallenges}/${profile?.totalChallenges}`, icon: <Target size={22} className="text-emerald-400" />, color: 'text-emerald-300', bg: 'bg-emerald-400/10' },
            ].map(stat => (
              <div key={stat.label} className="card text-center">
                <div className={`flex justify-center mb-2 w-12 h-12 rounded-xl ${stat.bg} items-center mx-auto`}>{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Streak Calendar */}
          <div className="card">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Flame size={18} className="text-orange-400" /> Activity
            </h2>
            <StreakCalendar streak={profile?.streak || 0} maxStreak={profile?.maxStreak || 0} />
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/battle" className="card flex items-center gap-3 hover:border-red-500/30 group">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <Swords size={20} className="text-red-400" />
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-200 group-hover:text-white">Code Battle</span>
                <p className="text-xs text-slate-500">Challenge the AI</p>
              </div>
            </Link>
            <Link to="/achievements" className="card flex items-center gap-3 hover:border-yellow-500/30 group">
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <Award size={20} className="text-yellow-400" />
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-200 group-hover:text-white">Achievements</span>
                <p className="text-xs text-slate-500">View all badges</p>
              </div>
            </Link>
            <Link to="/leaderboard" className="card flex items-center gap-3 hover:border-primary-500/30 group">
              <div className="p-2 bg-primary-500/10 rounded-xl">
                <Trophy size={20} className="text-primary-400" />
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-200 group-hover:text-white">Leaderboard</span>
                <p className="text-xs text-slate-500">See rankings</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Progress tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card">
            <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Code2 size={18} className="text-primary-400" /> Overall Progress
            </h2>
            <p className="text-sm text-slate-400 mb-4">{completionPct}% complete — {profile?.completedChallenges} of {profile?.totalChallenges} challenges solved</p>
            <div className="h-3 bg-dark-500 rounded-full overflow-hidden mb-6">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${completionPct}%`,
                  background: completionPct === 100
                    ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                    : 'linear-gradient(90deg, #6366f1, #a855f7)',
                }}
              />
            </div>

            <div className="space-y-4">
              {[1,2,3,4,5].map(lvl => {
                const stat = profile?.levelStats?.[lvl] || { completed: 0, total: 0 };
                const pct = stat.total > 0 ? Math.round(stat.completed / stat.total * 100) : 0;
                return (
                  <div key={lvl}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300 font-medium flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-dark-500 flex items-center justify-center text-xs font-bold text-slate-400">{lvl}</span>
                        {LEVEL_NAMES[lvl-1]}
                      </span>
                      <span className="text-slate-500">{stat.completed}/{stat.total} {pct === 100 && '✨'}</span>
                    </div>
                    <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100
                            ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                            : 'linear-gradient(90deg, #6366f1, #a855f7)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Badges tab */}
      {activeTab === 'badges' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" /> Badges Earned
              <span className="text-xs text-slate-500 font-normal ml-auto">{profile?.badges?.length || 0} / {Object.keys(BADGE_INFO).length}</span>
            </h2>
            {profile?.badges?.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Complete challenges to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {profile?.badges?.map(b => {
                  const info = BADGE_INFO[b] || { label: b, emoji: '🏅', desc: '' };
                  return (
                    <div key={b} className="flex flex-col items-center text-center p-4 bg-dark-600 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all hover:scale-105">
                      <span className="text-3xl mb-2">{info.emoji}</span>
                      <span className="text-xs font-semibold text-slate-200">{info.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{info.desc}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Locked badges */}
            {Object.entries(BADGE_INFO).filter(([id]) => !profile?.badges?.includes(id)).length > 0 && (
              <>
                <h3 className="font-semibold text-sm text-slate-500 mt-6 mb-3">Locked</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(BADGE_INFO)
                    .filter(([id]) => !profile?.badges?.includes(id))
                    .map(([id, info]) => (
                      <div key={id} className="flex flex-col items-center text-center p-4 bg-dark-700/50 rounded-xl border border-dark-400/20 opacity-40">
                        <span className="text-3xl mb-2 grayscale">{info.emoji}</span>
                        <span className="text-xs text-slate-500">{info.label}</span>
                        <span className="text-xs text-slate-600 mt-0.5">🔒 Locked</span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
