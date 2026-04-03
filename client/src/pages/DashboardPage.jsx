import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import XPBar from '../components/XPBar';
import AvatarDisplay from '../components/AvatarDisplay';
import RankBadge from '../components/RankBadge';
import DailyChallengeWidget from '../components/DailyChallengeWidget';
import StreakCalendar from '../components/StreakCalendar';
import QuestLoader from '../components/QuestLoader';
import BadgePopup from '../components/BadgePopup';
import SkillRadarChart from '../components/SkillRadarChart';
import {
  Lock, CheckCircle2, ChevronRight, Trophy, Zap, Target, Sparkles, Loader2,
  Flame, Swords, BookOpen, Award, Star, TrendingUp, Users, ArrowRight, RefreshCw
} from 'lucide-react';

const LEVEL_ICONS = ['🌱', '🔀', '🔄', '⚙️', '📦'];
const LEVEL_COLORS = [
  'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/50',
  'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400/50',
  'from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-400/50',
  'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-400/50',
  'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-400/50',
];

const MOTIVATIONAL_QUOTES = [
  { text: 'Every expert was once a beginner. Keep going! 🚀', author: 'Unknown' },
  { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'The best way to learn to code is to code!', author: 'CodeQuest' },
  { text: 'Programs must be written for people to read.', author: 'Abelson & Sussman' },
  { text: 'Debugging is twice as hard as writing the code.', author: 'Brian Kernighan' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Give a man a program, frustrate him for a day. Teach a man to program, frustrate him for a lifetime.', author: 'Waseem Latif' },
];

const STORY_INTROS = {
  1: { title: 'Chapter 1: The Awakening', desc: 'Your quest begins — learn the foundational concepts...', emoji: '🌅' },
  2: { title: 'Chapter 2: The Crossroads', desc: 'The path splits. Build on what you know with new patterns...', emoji: '🔀' },
  3: { title: 'Chapter 3: The Depths', desc: 'Go deeper — tackle more complex concepts and challenges...', emoji: '🏰' },
  4: { title: 'Chapter 4: The Forge', desc: 'Master advanced techniques and sharpen your skills...', emoji: '📖' },
  5: { title: 'Chapter 5: The Summit', desc: 'The final ascent — prove your mastery with expert challenges...', emoji: '💎' },
};

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const { courseId: paramCourseId } = useParams();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [levelProgress, setLevelProgress] = useState({});
  const [courseProgressMap, setCourseProgressMap] = useState({}); // { courseId: { completed, total, pct } }
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({ streak: 0, maxStreak: 0 });
  const [activityDays, setActivityDays] = useState([]);
  const [badgePopup, setBadgePopup] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      const [coursesRes, profileRes, activityRes] = await Promise.all([
        api.get('/courses'),
        api.get('/profile'),
        api.get('/gamification/activity-days?days=35').catch(() => ({ data: { activityDays: [] } })),
      ]);

      const courses = coursesRes.data;
      setAllCourses(courses);
      setActivityDays(activityRes.data.activityDays || []);

      const enrolledIds = new Set((profileRes.data.enrolledCourses || []).map(c => typeof c === 'string' ? c : c._id));
      const enrolled = courses.filter(c => enrolledIds.has(c._id));
      setEnrolledCourses(enrolled);

      // Determine which course to detail-view
      let detailCourse = null;
      if (paramCourseId) {
        detailCourse = courses.find(c => c._id === paramCourseId);
      }
      if (!detailCourse && enrolled.length > 0) {
        detailCourse = enrolled[0];
      }
      if (!detailCourse && courses.length > 0) {
        detailCourse = courses[0];
      }
      setSelectedCourse(detailCourse);

      // Build per-course progress summaries
      const progressMap = {};
      for (const course of enrolled) {
        let completed = 0;
        let total = 0;
        for (const lvl of course.levels || []) {
          try {
            const chRes = await api.get(`/challenges?courseId=${course._id}&levelNum=${lvl.levelNum}`);
            const challenges = chRes.data;
            const done = challenges.filter(c => c.completed).length;
            completed += done;
            total += challenges.length;
          } catch (e) { /* skip */ }
        }
        progressMap[course._id] = { completed, total, pct: total > 0 ? Math.round(completed / total * 100) : 0 };
      }
      setCourseProgressMap(progressMap);

      // Build level progress for selected course
      if (detailCourse) {
        const lvlProg = {};
        for (const lvl of detailCourse.levels || []) {
          try {
            const chRes = await api.get(`/challenges?courseId=${detailCourse._id}&levelNum=${lvl.levelNum}`);
            const challenges = chRes.data;
            const done = challenges.filter(c => c.completed).length;
            lvlProg[lvl.levelNum] = { total: challenges.length, completed: done };
          } catch (e) { /* skip */ }
        }
        setLevelProgress(lvlProg);
      }

      // Update user context
      updateUser({
        xp: profileRes.data.xp,
        level: profileRes.data.level,
        badges: profileRes.data.badges,
        avatar: profileRes.data.avatar,
        streak: profileRes.data.streak,
        enrolledCourses: profileRes.data.enrolledCourses,
      });
      setStreakData({
        streak: profileRes.data.streak || profileRes.data.currentDayStreak || 0,
        maxStreak: profileRes.data.maxStreak || 0,
      });

      try {
        const streakRes = await api.get('/gamification/streak');
        setStreakData({
          streak: streakRes.data.streak || 0,
          maxStreak: streakRes.data.maxStreak || 0,
        });
      } catch (e) { /* optional */ }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [paramCourseId]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Auto-refresh every 30 seconds for real-time feeling
  useEffect(() => {
    const interval = setInterval(() => {
      api.get('/profile').then(r => {
        updateUser({
          xp: r.data.xp,
          level: r.data.level,
          badges: r.data.badges,
          streak: r.data.streak,
        });
        setStreakData(prev => ({
          streak: r.data.streak || r.data.currentDayStreak || prev.streak,
          maxStreak: r.data.maxStreak || prev.maxStreak,
        }));
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const isLevelUnlocked = (levelNum) => {
    if (levelNum === 1) return true;
    const prev = levelProgress[levelNum - 1];
    if (!prev) return false;
    return prev.completed >= prev.total && prev.total > 0;
  };

  const getCurrentLevel = () => {
    const maxLvl = selectedCourse?.levels?.length || 1;
    for (let i = 1; i <= maxLvl; i++) {
      const prog = levelProgress[i];
      if (!prog) return 1;
      if (prog.completed < prog.total) return i;
    }
    return maxLvl;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <QuestLoader size="lg" />
    </div>
  );

  const currentLevel = getCurrentLevel();
  const currentStory = STORY_INTROS[currentLevel];
  const totalCompleted = Object.values(levelProgress).reduce((a, b) => a + b.completed, 0);
  const totalChallenges = Object.values(levelProgress).reduce((a, b) => a + b.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">

      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-700 via-dark-700 to-primary-900/20 border border-dark-400/30 p-8 mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-accent-purple/5 rounded-full blur-3xl" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              top: `${10 + Math.random() * 80}%`, left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }} />
        ))}

        <div className="relative flex flex-col md:flex-row items-start gap-6">
          <div className="flex items-start gap-4 flex-1">
            <AvatarDisplay avatar={user?.avatar} size="lg" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🖥️</span>
                <div className="bg-dark-600/80 backdrop-blur-sm border border-dark-400/50 rounded-2xl rounded-bl-none px-5 py-3">
                  <p className="text-slate-200 font-medium">
                    Welcome back, <span className="text-primary-300 font-bold">@{user?.username}</span>! Let's get it. 💪
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <XPBar xp={user?.xp || 0} level={user?.level || 1} />
              </div>
            </div>
          </div>

          {/* Quick stats card */}
          <div className="bg-dark-800/60 backdrop-blur-sm border border-dark-400/30 rounded-2xl p-5 min-w-[260px]">
            <div className="flex items-center gap-3 mb-3">
              <AvatarDisplay avatar={user?.avatar} size="sm" />
              <div>
                <div className="font-bold text-slate-100">{user?.username}</div>
                <div className="text-xs text-slate-500">Level {user?.level || 1}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                <div>
                  <div className="text-lg font-bold text-yellow-300">{user?.xp || 0}</div>
                  <div className="text-[10px] text-slate-500">Total XP</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RankBadge xp={user?.xp || 0} size="sm" showLabel={false} />
                <div>
                  <div className="text-sm font-bold text-slate-200">
                    {(user?.xp || 0) >= 2000 ? 'Diamond' : (user?.xp || 0) >= 1000 ? 'Platinum' : (user?.xp || 0) >= 500 ? 'Gold' : (user?.xp || 0) >= 200 ? 'Silver' : 'Bronze'}
                  </div>
                  <div className="text-[10px] text-slate-500">Rank</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-purple-400" />
                <div>
                  <div className="text-lg font-bold text-purple-300">{user?.badges?.length || 0}</div>
                  <div className="text-[10px] text-slate-500">Badges</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-400" />
                <div>
                  <div className="text-lg font-bold text-orange-300">{streakData.streak}</div>
                  <div className="text-[10px] text-slate-500">Day streak</div>
                </div>
              </div>
            </div>

            <Link to="/profile"
              className="block text-center text-sm font-semibold text-slate-300 py-2 bg-dark-600 hover:bg-dark-500 rounded-xl border border-dark-400/50 transition-all hover:border-primary-500/30">
              View profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* My Enrolled Courses */}
          {enrolledCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                <span className="text-xl">📚</span> My Courses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrolledCourses.map((c) => {
                  const prog = courseProgressMap[c._id] || { completed: 0, total: 0, pct: 0 };
                  const isSelected = selectedCourse?._id === c._id;
                  const EMOJIS = { JavaScript: '🌴', Python: '🏔️', 'HTML & CSS': '🌌', React: '🌋', TypeScript: '🌊', 'Node.js': '⚡' };
                  return (
                    <Link
                      key={c._id}
                      to={`/dashboard/${c._id}`}
                      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02]
                        ${isSelected
                          ? 'border-primary-500/50 bg-gradient-to-br from-primary-900/20 to-dark-700 ring-2 ring-primary-500/20'
                          : 'border-dark-400/50 bg-dark-700 hover:border-primary-500/30'}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{EMOJIS[c.language] || '📖'}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-100 truncate text-sm">{c.title}</h3>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{c.language} • {c.levels?.length || 0} chapters</span>
                        </div>
                        {prog.pct === 100 && <CheckCircle2 size={16} className="text-emerald-400" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-dark-500 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full transition-all duration-500"
                            style={{ width: `${prog.pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{prog.pct}%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {prog.completed}/{prog.total} exercises completed
                      </div>
                    </Link>
                  );
                })}
              </div>
              {enrolledCourses.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No courses enrolled yet.</p>
                  <Link to="/courses" className="text-primary-400 text-sm font-semibold hover:text-primary-300">Browse courses →</Link>
                </div>
              )}
            </div>
          )}

          {/* Jump Back In */}
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <span className="text-xl">🎮</span> Jump back in
            </h2>

            {selectedCourse && (
              <div className="relative overflow-hidden rounded-2xl border border-dark-400/30 bg-gradient-to-br from-emerald-900/20 via-dark-700 to-teal-900/10">
                <div className="relative p-6 pb-4">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }} />

                  <div className="mb-4 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-dark-500 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700"
                          style={{ width: `${totalChallenges > 0 ? (totalCompleted / totalChallenges * 100) : 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {totalChallenges > 0 ? Math.round(totalCompleted / totalChallenges * 100) : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">COURSE</div>
                    <h3 className="text-3xl font-black text-slate-100 mb-1">{selectedCourse.language}</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Next exercise: {selectedCourse.levels[currentLevel - 1]?.title || 'Continue'}
                    </p>

                    <div className="flex items-center gap-3">
                      {levelProgress[1]?.completed > 0 || totalCompleted > 0
                        ? <Link to={`/course/${selectedCourse._id}/level/${currentLevel}/theory`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-600/30">
                            Continue Learning <ArrowRight size={16} />
                          </Link>
                        : <Link to={`/course/${selectedCourse._id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-600/30">
                            Start Course <ArrowRight size={16} />
                          </Link>
                      }
                      <Link to="/courses" className="text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium">
                        View course
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Story Preview */}
          {currentStory && (
            <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-r from-primary-900/10 via-dark-700 to-purple-900/10 p-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
              <div className="flex items-start gap-4 relative">
                <span className="text-4xl">{currentStory.emoji}</span>
                <div>
                  <h3 className="font-bold text-primary-300 text-sm">{currentStory.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{currentStory.desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Level Map */}
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-primary-400" />
              {selectedCourse?.title || 'Your Journey'}
            </h2>

            <div className="space-y-3">
              {selectedCourse?.levels?.map((lvl, idx) => {
                const prog = levelProgress[lvl.levelNum] || { total: 0, completed: 0 };
                const unlocked = isLevelUnlocked(lvl.levelNum);
                const done = prog.completed >= prog.total && prog.total > 0;
                const pct = prog.total > 0 ? Math.round(prog.completed / prog.total * 100) : 0;
                const isCurrent = lvl.levelNum === currentLevel;

                return (
                  <div key={lvl.levelNum}
                    className={`relative overflow-hidden border rounded-2xl transition-all duration-300
                      ${isCurrent ? 'ring-2 ring-primary-500/30' : ''}
                      ${unlocked ? 'cursor-pointer hover:scale-[1.01]' : 'level-locked'}`}>
                    <div className={`bg-gradient-to-r ${LEVEL_COLORS[idx]} border p-5`}>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                            ${done ? 'bg-emerald-500/20 border-2 border-emerald-500/40' : unlocked ? 'bg-dark-600 border-2 border-primary-500/30' : 'bg-dark-600 border-2 border-dark-400'}`}>
                            {done ? <CheckCircle2 size={24} className="text-emerald-400" /> : <span>{lvl.icon || LEVEL_ICONS[idx]}</span>}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chapter {lvl.levelNum}</span>
                            {done && <span className="text-xs text-emerald-400 font-semibold">✓ Complete</span>}
                            {!unlocked && <span className="flex items-center gap-1 text-xs text-slate-600"><Lock size={10} /> Locked</span>}
                            {isCurrent && !done && <span className="text-xs text-primary-400 font-semibold animate-pulse">● Current</span>}
                          </div>
                          <h3 className="text-lg font-bold text-slate-100 mb-0.5">{lvl.title}</h3>
                          <p className="text-xs text-slate-400 truncate">{lvl.description}</p>
                          {unlocked && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>{prog.completed}/{prog.total} exercises</span>
                                <span>{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-dark-500 rounded-full">
                                <div className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          {unlocked
                            ? <Link to={`/course/${selectedCourse._id}`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-all hover:scale-105">
                                {done ? 'Review' : isCurrent ? 'Continue' : 'Start'} <ChevronRight size={16} />
                              </Link>
                            : <div className="p-3 bg-dark-500 rounded-xl"><Lock size={20} className="text-slate-600" /></div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explore More */}
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <span className="text-xl">🧭</span> Explore more
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { to: '/battle', icon: Swords, color: 'red', title: 'Code Battle Arena', desc: 'Race against AI in timed coding challenges' },
                { to: '/achievements', icon: Award, color: 'yellow', title: 'Achievements & Stats', desc: 'Track your coding journey milestones' },
                { to: '/courses', icon: BookOpen, color: 'emerald', title: 'Course Catalog', desc: 'Browse all available learning paths' },
                { to: '/leaderboard', icon: Users, color: 'purple', title: 'Leaderboard', desc: 'See where you rank among other coders' },
              ].map(item => (
                <Link key={item.to} to={item.to}
                  className={`group p-5 rounded-2xl border border-${item.color}-500/20 bg-gradient-to-br from-${item.color}-900/10 to-dark-700 hover:border-${item.color}-500/40 transition-all duration-300 hover:scale-[1.02]`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-${item.color}-500/10 rounded-xl border border-${item.color}-500/20 group-hover:bg-${item.color}-500/20 transition-all`}>
                      <item.icon size={24} className={`text-${item.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">{item.title}</h3>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <DailyChallengeWidget onXPEarned={() => fetchDashboard()} />

          <div className="card">
            <StreakCalendar streak={user?.streak || streakData.streak} maxStreak={streakData.maxStreak} activityDaysProp={activityDays} />
          </div>

          {/* Skill Radar */}
          <div className="card">
            <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-cyan-400" /> Skill Radar
            </h3>
            <SkillRadarChart
              xp={user?.xp || 0}
              completedLevels={Object.entries(levelProgress)
                .filter(([, p]) => p.completed >= p.total && p.total > 0)
                .map(([k]) => Number(k))}
            />
          </div>

          {/* Motivational Quote */}
          <div className="card" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <div className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Daily Wisdom</div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{MOTIVATIONAL_QUOTES[new Date().getDay() % MOTIVATIONAL_QUOTES.length].text}"
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  — {MOTIVATIONAL_QUOTES[new Date().getDay() % MOTIVATIONAL_QUOTES.length].author}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                <Trophy size={14} className="text-yellow-400" /> Recent Badges
              </h3>
              <Link to="/achievements" className="text-xs text-primary-400 hover:text-primary-300">View all</Link>
            </div>
            {user?.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.badges.slice(-6).map(b => {
                  const emojis = {
                    first_blood: '🩸', level_2_unlock: '🔓', level_3_unlock: '🔓', level_4_unlock: '🔓', level_5_unlock: '🔓',
                    xp_100: '⚡', xp_500: '🚀', xp_1000: '💎', js_master: '🏆',
                    streak_3: '🔥', streak_7: '🔥', streak_30: '🔥', battle_won: '⚔️', daily_first: '☀️', enrolled_3: '📚',
                  };
                  return (
                    <span key={b} className="text-xl p-2 bg-dark-600 rounded-lg border border-dark-400/50 hover:border-yellow-400/30 transition-all cursor-default hover:scale-110" title={b}>
                      {emojis[b] || '🏅'}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">Complete challenges to earn badges!</p>
            )}
          </div>
        </div>
      </div>

      {/* Badge popup */}
      <BadgePopup badges={badgePopup} onClose={() => setBadgePopup([])} />
    </div>
  );
};

export default DashboardPage;
