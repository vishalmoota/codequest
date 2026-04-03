import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AvatarDisplay from '../components/AvatarDisplay';
import RankBadge from '../components/RankBadge';
import StreakCalendar from '../components/StreakCalendar';
import {
  Trophy, Zap, Star, Target, Flame, Code2, Clock, TrendingUp,
  Award, Shield, Loader2, Share2, ArrowLeft, Crown, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import QuestLoader from '../components/QuestLoader';

// All possible achievements with progress tracking
const ALL_ACHIEVEMENTS = [
  { id: 'first_blood', icon: '🩸', title: 'First Blood', desc: 'Solve your first challenge', category: 'Milestones', xp: 10 },
  { id: 'streak_3', icon: '🔥', title: 'On Fire', desc: '3-day coding streak', category: 'Consistency', xp: 25 },
  { id: 'streak_7', icon: '🌟', title: 'Week Warrior', desc: '7-day coding streak', category: 'Consistency', xp: 50 },
  { id: 'streak_30', icon: '💎', title: 'Monthly Master', desc: '30-day coding streak', category: 'Consistency', xp: 200 },
  { id: 'xp_100', icon: '⚡', title: '100 XP Club', desc: 'Earn 100 XP', category: 'XP Milestones', xp: 0 },
  { id: 'xp_500', icon: '🚀', title: '500 XP Legend', desc: 'Earn 500 XP', category: 'XP Milestones', xp: 0 },
  { id: 'xp_1000', icon: '🌌', title: 'XP Overlord', desc: 'Earn 1000 XP', category: 'XP Milestones', xp: 0 },
  { id: 'level_2_unlock', icon: '🔓', title: 'Level 2 Unlocked', desc: 'Reach level 2', category: 'Levels', xp: 25 },
  { id: 'level_3_unlock', icon: '🔓', title: 'Level 3 Unlocked', desc: 'Reach level 3', category: 'Levels', xp: 25 },
  { id: 'level_4_unlock', icon: '🔓', title: 'Level 4 Unlocked', desc: 'Reach level 4', category: 'Levels', xp: 25 },
  { id: 'level_5_unlock', icon: '🔓', title: 'Level 5 Unlocked', desc: 'Reach level 5', category: 'Levels', xp: 50 },
  { id: 'js_master', icon: '🏆', title: 'JS Master', desc: 'Complete all challenges', category: 'Mastery', xp: 100 },
  { id: 'speed_demon', icon: '⏱️', title: 'Speed Demon', desc: 'Solve a challenge in under 60 seconds', category: 'Speed', xp: 30 },
  { id: 'perfectionist', icon: '✨', title: 'Perfectionist', desc: 'Solve 5 challenges on first try', category: 'Skill', xp: 50 },
  { id: 'battle_victor', icon: '⚔️', title: 'Battle Victor', desc: 'Win a Code Battle', category: 'Battle', xp: 40 },
  { id: 'daily_warrior', icon: '🌅', title: 'Daily Warrior', desc: 'Complete 5 daily challenges', category: 'Daily', xp: 50 },
];

const CATEGORIES = ['All', 'Milestones', 'Consistency', 'XP Milestones', 'Levels', 'Mastery', 'Speed', 'Skill', 'Battle', 'Daily'];

const AchievementsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [tab, setTab] = useState('achievements'); // achievements | heatmap | stats

  useEffect(() => {
    api.get('/profile')
      .then(r => { setProfile(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <QuestLoader size="lg" />
    </div>
  );

  const userBadges = profile?.badges || [];
  const unlockedCount = ALL_ACHIEVEMENTS.filter(a => userBadges.includes(a.id)).length;
  const completionPct = Math.round((unlockedCount / ALL_ACHIEVEMENTS.length) * 100);

  const filtered = filter === 'All'
    ? ALL_ACHIEVEMENTS
    : ALL_ACHIEVEMENTS.filter(a => a.category === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <Link to="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Profile
      </Link>

      {/* Header */}
      <div className="card mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
          <AvatarDisplay avatar={profile?.avatar} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black">{profile?.username}</h1>
              <RankBadge xp={profile?.xp || 0} size="md" />
            </div>
            <p className="text-slate-400 text-sm mb-3">Level {profile?.level} • {profile?.xp} XP</p>

            {/* Achievement completion bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-semibold">{unlockedCount}/{ALL_ACHIEVEMENTS.length} Achievements</span>
                <span className="text-slate-500">{completionPct}%</span>
              </div>
              <div className="h-3 bg-dark-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%`, boxShadow: '0 0 10px rgba(245,158,11,0.4)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-dark-700 rounded-xl border border-dark-400/50 w-fit">
        {[
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'heatmap', label: 'Activity Map', icon: Flame },
          { id: 'stats', label: 'Statistics', icon: TrendingUp },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === t.id ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Achievements Tab */}
      {tab === 'achievements' && (
        <>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${filter === c
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-dark-700 text-slate-400 border border-dark-400 hover:border-yellow-500/20'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(achievement => {
              const unlocked = userBadges.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`relative p-5 rounded-2xl border transition-all duration-300
                    ${unlocked
                      ? 'bg-gradient-to-br from-yellow-500/10 via-dark-700 to-amber-500/5 border-yellow-500/30 hover:border-yellow-400/50 hover:scale-[1.02]'
                      : 'bg-dark-700/50 border-dark-400/20 opacity-50 grayscale'}`}
                >
                  {unlocked && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 size={16} className="text-yellow-400" />
                    </div>
                  )}
                  <span className="text-4xl block mb-3">{achievement.icon}</span>
                  <h3 className="font-bold text-slate-100 mb-0.5">{achievement.title}</h3>
                  <p className="text-xs text-slate-400 mb-2">{achievement.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-600 bg-dark-600 px-2 py-0.5 rounded-full">
                      {achievement.category}
                    </span>
                    {achievement.xp > 0 && (
                      <span className="text-[10px] font-semibold text-yellow-400">
                        +{achievement.xp} XP
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Heatmap Tab */}
      {tab === 'heatmap' && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Flame size={18} className="text-orange-400" />
            Coding Activity Heatmap
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Your coding consistency over the past 5 weeks. Keep the streak going!
          </p>
          <StreakCalendar
            streak={profile?.streak || 0}
            maxStreak={profile?.maxStreak || 0}
            lastChallengeDate={profile?.lastChallengeDate}
          />
        </div>
      )}

      {/* Stats Tab */}
      {tab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total XP', value: profile?.xp, icon: <Zap size={24} className="text-yellow-400" />, color: 'text-yellow-300' },
              { label: 'Current Level', value: profile?.level, icon: <Star size={24} className="text-primary-400" />, color: 'text-primary-300' },
              { label: 'Challenges', value: `${profile?.completedChallenges}/${profile?.totalChallenges}`, icon: <Target size={24} className="text-emerald-400" />, color: 'text-emerald-300' },
              { label: 'Day Streak', value: profile?.streak || 0, icon: <Flame size={24} className="text-orange-400" />, color: 'text-orange-300' },
            ].map(s => (
              <div key={s.label} className="card text-center">
                <div className="flex justify-center mb-2">{s.icon}</div>
                <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Skills radar (visual representation) */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield size={18} className="text-primary-400" />
              Skill Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { skill: 'Variables & Basics', pct: Math.min(100, ((profile?.levelStats?.[1]?.completed || 0) / Math.max(1, profile?.levelStats?.[1]?.total || 1)) * 100), color: 'from-emerald-500 to-emerald-400' },
                { skill: 'Conditionals', pct: Math.min(100, ((profile?.levelStats?.[2]?.completed || 0) / Math.max(1, profile?.levelStats?.[2]?.total || 1)) * 100), color: 'from-blue-500 to-blue-400' },
                { skill: 'Loops', pct: Math.min(100, ((profile?.levelStats?.[3]?.completed || 0) / Math.max(1, profile?.levelStats?.[3]?.total || 1)) * 100), color: 'from-violet-500 to-violet-400' },
                { skill: 'Functions', pct: Math.min(100, ((profile?.levelStats?.[4]?.completed || 0) / Math.max(1, profile?.levelStats?.[4]?.total || 1)) * 100), color: 'from-orange-500 to-orange-400' },
                { skill: 'Arrays & Objects', pct: Math.min(100, ((profile?.levelStats?.[5]?.completed || 0) / Math.max(1, profile?.levelStats?.[5]?.total || 1)) * 100), color: 'from-pink-500 to-pink-400' },
              ].map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{s.skill}</span>
                    <span className="text-slate-500">{Math.round(s.pct)}%</span>
                  </div>
                  <div className="h-2.5 bg-dark-500 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-1000`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Need this import for the CheckCircle2 icon used in achievements

export default AchievementsPage;
