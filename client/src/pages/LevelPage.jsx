import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { AVATAR_CHARACTERS } from '../components/AvatarDisplay';

const COURSE_THEMES = {
  javascript: {
    gradient: 'linear-gradient(135deg, #1a1a0e 0%, #2d2d00 50%, #4a4a00 100%)',
    accent: '#f7df1e',
    emoji: '⚡',
    decorEmoji: '🌟',
    tag: 'BEGINNER COURSE',
    duration: '12h',
    learners: '3.2K',
  },
  python: {
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #2d5a27 100%)',
    accent: '#4ade80',
    emoji: '🐍',
    decorEmoji: '🌴',
    tag: 'BEGINNER COURSE',
    duration: '10h',
    learners: '2.8K',
  },
  html: {
    gradient: 'linear-gradient(135deg, #0a0a2e 0%, #0d1b4b 50%, #1a3a6b 100%)',
    accent: '#60a5fa',
    emoji: '🌐',
    decorEmoji: '✨',
    tag: 'BEGINNER COURSE',
    duration: '8h',
    learners: '1.9K',
  },
};

const DEFAULT_THEME = {
  gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  accent: '#a78bfa',
  emoji: '🎮',
  decorEmoji: '⭐',
  tag: 'COURSE',
  duration: '10h',
  learners: '1K',
};

const LevelPage = () => {
  const { courseId, levelNum } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [profile, setProfile] = useState(null);
  const [courseChallenges, setCourseChallenges] = useState({}); // { levelNum: [challenges] }
  const [openLevels, setOpenLevels] = useState({ 1: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[LevelPage] Mounting with courseId:', courseId, 'levelNum:', levelNum);
    
    if (!courseId) {
      setError('No course ID provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[LevelPage] Fetching course:', courseId);
        const courseRes = await axios.get(`/courses/${courseId}`);
        console.log('[LevelPage] Course loaded:', courseRes.data);
        setCourse(courseRes.data);

        // Fetch challenges for each level
        const challenges = {};
        if (courseRes.data.levels && Array.isArray(courseRes.data.levels)) {
          const levelsWithChallenges = await Promise.all(
            courseRes.data.levels.map(async (level) => {
              try {
                console.log('[LevelPage] Fetching challenges for level:', level.levelNum);
                const chRes = await axios.get(
                  `/challenges?courseId=${courseId}&levelNum=${level.levelNum}`
                );
                challenges[level.levelNum] = Array.isArray(chRes.data) ? chRes.data : [];
                console.log(`[LevelPage] Level ${level.levelNum} challenges:`, challenges[level.levelNum]);
                return { ...level, challenges: challenges[level.levelNum] };
              } catch (e) {
                console.warn(`[LevelPage] Failed to fetch challenges for level ${level.levelNum}:`, e);
                challenges[level.levelNum] = [];
                return { ...level, challenges: [] };
              }
            })
          );
          // Update course with challenges included
          courseRes.data.levels = levelsWithChallenges;
        }
        setCourseChallenges(challenges);

        if (user) {
          try {
            console.log('[LevelPage] Fetching progress for course:', courseId);
            const progressRes = await axios.get(
              `/gamification/course-progress/${courseId}`
            );
            console.log('[LevelPage] Progress loaded:', progressRes.data);
            setProgress(progressRes.data);
          } catch (e) {
            console.log('[LevelPage] Not enrolled yet (expected):', e.response?.status);
            // not enrolled yet, that's fine
          }

          try {
            const profileRes = await axios.get('/profile');
            console.log('[LevelPage] Profile loaded:', profileRes.data);
            setProfile(profileRes.data);
          } catch (e) {
            console.warn('[LevelPage] Failed to load profile:', e);
            // profile fetch failed, continue without it
          }
        }
      } catch (err) {
        console.error('[LevelPage] Error loading course:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load course.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, user]);

  // Refetch progress when page becomes visible (returning from TheoryPage/ChallengePage)
  useEffect(() => {
    const refetchProgress = async () => {
      if (courseId && user) {
        try {
          console.log('[LevelPage] Refetching progress...');
          const progressRes = await axios.get(
            `/gamification/course-progress/${courseId}`
          );
          console.log('[LevelPage] Progress refreshed:', progressRes.data);
          setProgress(progressRes.data);
        } catch (e) {
          console.log('[LevelPage] Failed to refresh progress:', e);
        }
      }
    };

    // Refetch on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetchProgress();
      }
    };

    // Also refetch when window regains focus
    const handleFocus = () => {
      refetchProgress();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [courseId, user]);

  const getTheme = () => {
    if (!course) return DEFAULT_THEME;
    const lang = course.language?.toLowerCase() ||
      course.title?.toLowerCase();
    if (lang?.includes('python')) return COURSE_THEMES.python;
    if (lang?.includes('javascript') || lang?.includes('js'))
      return COURSE_THEMES.javascript;
    if (lang?.includes('html') || lang?.includes('css'))
      return COURSE_THEMES.html;
    return DEFAULT_THEME;
  };

  const theme = getTheme();

  const toggleLevel = (levelNum) => {
    setOpenLevels((prev) => ({ ...prev, [levelNum]: !prev[levelNum] }));
  };

  const isTheoryComplete = (levelNum) => {
    if (!progress) return false;
    if (!progress.theoryCompleted) return levelNum === 1 ? false : false;
    return progress.theoryCompleted.includes(levelNum);
  };

  const handleStartChallenge = (challengeId) => {
    const levelNum = courseId?.split('/')[1] || 1;
    navigate(`/course/${courseId}/level/${levelNum}/challenge/${challengeId}`);
  };

  const handleEnroll = async () => {
    try {
      await axios.post('/gamification/enroll', { courseId });
      const progressRes = await axios.get(
        `/gamification/course-progress/${courseId}`
      );
      setProgress(progressRes.data);
    } catch (err) {
      console.error('Enroll error:', err);
    }
  };

  const isLevelLocked = (levelNum) => {
    if (levelNum === 1) return false;
    if (!progress) return true;
    return progress.currentLevel < levelNum;
  };

  const getRankColor = (rank) => {
    const colors = {
      Bronze: '#cd7f32',
      Silver: '#c0c0c0',
      Gold: '#ffd700',
      Platinum: '#e5e4e2',
      Diamond: '#b9f2ff',
    };
    return colors[rank] || '#a78bfa';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <div className="text-6xl mb-4" style={{ animation: 'pulse 1s infinite' }}>⚙️</div>
          <p className="text-gray-300 font-mono">Loading course...</p>
          <p className="text-gray-600 font-mono text-xs mt-2">Course ID: {courseId || 'unknown'}</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 font-mono mb-2">{error || 'Course not found'}</p>
          <p className="text-gray-600 font-mono text-xs mb-4">Course ID: {courseId}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-mono text-sm"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-mono text-sm"
            >
              All Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const levels = course.levels || [];
  const completionPct = progress?.completionPercentage || 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO BANNER ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ background: theme.gradient, minHeight: '280px' }}
      >
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Floating decorative emojis */}
        <div
          className="absolute top-6 right-48 text-5xl select-none opacity-60"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          {theme.decorEmoji}
        </div>
        <div
          className="absolute bottom-8 right-24 text-8xl select-none opacity-80"
          style={{ animation: 'float 4s ease-in-out infinite reverse' }}
        >
          {theme.emoji}
        </div>
        <div
          className="absolute top-12 right-96 text-3xl select-none opacity-40"
          style={{ animation: 'float 5s ease-in-out infinite' }}
        >
          {theme.decorEmoji}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl px-8 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-mono px-3 py-1 rounded border"
              style={{
                borderColor: theme.accent,
                color: theme.accent,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
            >
              ● {theme.tag}
            </span>
          </div>

          <h1
            className="text-5xl font-bold font-mono mb-3"
            style={{ color: theme.accent }}
          >
            {course.title}
          </h1>

          <p className="text-gray-200 max-w-xl mb-6 leading-relaxed">
            {course.description ||
              `Master ${course.title} from basics to advanced through 
               interactive challenges and gamified learning.`}
          </p>

          <div className="flex items-center gap-4">
            {!progress ? (
              <button
                onClick={user ? handleEnroll : () => navigate('/login')}
                className="px-6 py-3 font-bold font-mono rounded transition-all
                           hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.accent,
                  color: '#000',
                }}
              >
                {user ? 'Enroll Now — Free' : 'Sign Up to Start'}
              </button>
            ) : (
              <button
                onClick={() => {
                  const currentLevelNum = progress?.currentLevel || 1;
                  navigate(`/course/${courseId}/level/${currentLevelNum}/theory`);
                }}
                className="px-6 py-3 font-bold font-mono rounded transition-all
                           hover:scale-105"
                style={{ backgroundColor: theme.accent, color: '#000' }}
              >
                ▶ Continue Learning
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-gray-300">
            <span>⏱ Time to complete: {theme.duration}</span>
            <span>👥 +{theme.learners} also learning</span>
            {progress && (
              <span style={{ color: theme.accent }}>
                ✓ {Math.round(completionPct)}% complete
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">

        {/* ── LEFT: Chapter Accordion ── */}
        <div className="flex-1">
          <div className="space-y-3">
            {levels.map((level, idx) => {
              const locked = isLevelLocked(level.levelNum);
              const isOpen = openLevels[level.levelNum];
              const challenges = courseChallenges[level.levelNum] || [];
              const theoryComplete = isTheoryComplete(level.levelNum);

              return (
                <div
                  key={level.levelNum}
                  className="rounded-xl border overflow-hidden"
                  style={{
                    borderColor: locked
                      ? 'rgba(255,255,255,0.08)'
                      : `${theme.accent}33`,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  }}
                >
                  {/* Level header with expand/collapse */}
                  <button
                    onClick={() => !locked && toggleLevel(level.levelNum)}
                    className="w-full flex items-center justify-between px-6 py-4
                               transition-colors hover:bg-white/5"
                    disabled={locked}
                  >
                    <div className="flex items-center gap-4">
                      {/* Chapter number circle */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center 
                                   justify-center text-sm font-bold font-mono
                                   border-2 flex-shrink-0"
                        style={{
                          borderColor: locked ? '#4b5563' : theme.accent,
                          color: locked ? '#4b5563' : theme.accent,
                          backgroundColor: locked
                            ? 'transparent'
                            : `${theme.accent}15`,
                        }}
                      >
                        {locked ? '🔒' : level.levelNum}
                      </div>

                      <div className="text-left">
                        <h3
                          className="font-bold font-mono text-base"
                          style={{ color: locked ? '#4b5563' : '#e5e7eb' }}
                        >
                          {level.title}
                        </h3>
                        {locked && (
                          <p className="text-xs text-gray-600 mt-0.5">
                            Complete previous chapter to unlock
                          </p>
                        )}
                        {!locked && progress && (
                          <p className="text-xs mt-0.5"
                             style={{ color: theme.accent }}>
                            📖 Theory + ⚔️ {challenges.length} challenge
                            {challenges.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {!locked && (
                      <span className="text-gray-400 text-lg">
                        {isOpen ? '∧' : '∨'}
                      </span>
                    )}
                  </button>

                  {/* Expanded content with Theory and Challenges sections */}
                  {isOpen && !locked && (
                    <div className="border-t border-white/5">
                      {/* THEORY SECTION */}
                      <div className="flex items-center justify-between px-6 py-3 
                                      border-b border-white/5 hover:bg-white/5 transition">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📖</span>
                          <div>
                            <p className="text-sm font-mono text-gray-200">
                              Theory — {level.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Read theory and run code examples
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(
                            `/course/${courseId}/level/${level.levelNum}/theory`
                          )}
                          className="px-4 py-1.5 text-xs font-mono font-bold rounded-lg 
                                     transition hover:scale-105"
                          style={{ backgroundColor: theme.accent, color: '#000' }}
                        >
                          {theoryComplete ? '✓ Review' : 'Start →'}
                        </button>
                      </div>

                      {/* CHALLENGES SECTION */}
                      <div className={`${!theoryComplete ? 'opacity-40' : ''}`}>
                        <div className="flex items-center justify-between px-6 py-3 
                                        border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">⚔️</span>
                            <div>
                              <p className="text-sm font-mono text-gray-200">
                                Challenges — {level.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {!theoryComplete 
                                  ? '🔒 Complete theory first'
                                  : `${challenges.length} coding challenge${challenges.length !== 1 ? 's' : ''}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Individual challenge list */}
                        {theoryComplete && challenges.length > 0 ? (
                          challenges.map((challenge, cIdx) => {
                            const challengeId = challenge._id || challenge;
                            const challengeTitle = challenge.title || `Challenge ${cIdx + 1}`;

                            return (
                              <div key={challengeId}
                                   className="flex items-center justify-between px-6 py-3 
                                              border-b border-white/5 last:border-0 
                                              hover:bg-white/5 transition">
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-500 text-sm font-mono w-6">
                                    {cIdx + 1}
                                  </span>
                                  <span className="text-gray-300 text-sm">
                                    {challengeTitle}
                                  </span>
                                </div>
                                <button
                                  onClick={() => navigate(
                                    `/course/${courseId}/level/${level.levelNum}/challenge/${challengeId}`
                                  )}
                                  className="px-4 py-1.5 text-xs font-mono font-bold rounded-lg 
                                             transition hover:scale-105"
                                  style={{ backgroundColor: theme.accent, color: '#000' }}
                                >
                                  Solve →
                                </button>
                              </div>
                            );
                          })
                        ) : theoryComplete && challenges.length === 0 ? (
                          <p className="px-6 py-4 text-gray-500 text-sm font-mono">
                            No challenges yet.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-72 flex-shrink-0 space-y-4">

          {/* User progress card */}
          <div className="rounded-xl border border-white/10 p-5"
               style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">
                {AVATAR_CHARACTERS[profile?.avatar?.character]?.emoji || '🧑‍💻'}
              </div>
              <div>
                <p className="font-bold text-sm">
                  {profile?.username || user?.username || 'Your Name'}
                </p>
                <p className="text-xs text-gray-400">
                  Level {profile?.level || 1}
                </p>
                {profile?.rank && (
                  <p className="text-xs font-mono mt-0.5"
                     style={{ color: getRankColor(profile.rank?.name) }}>
                    {profile.rank?.name}
                  </p>
                )}
              </div>
            </div>

            {progress ? (
              <>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Course Progress</span>
                    <span>{Math.round(completionPct)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${completionPct}%`,
                        backgroundColor: theme.accent,
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {progress.totalChallengesCompleted || 0} challenges completed
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3">
                  Enroll to save your progress.
                </p>
                <button
                  onClick={user ? handleEnroll : () => navigate('/login')}
                  className="w-full py-2 text-sm font-mono font-bold rounded-lg
                             border border-white/20 hover:bg-white/10 transition"
                >
                  {user ? 'Enroll Now' : 'Sign Up'}
                </button>
              </>
            )}
          </div>

          {/* Course Badges */}
          <div className="rounded-xl border border-white/10 p-5"
               style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm font-mono">Course Badges</h3>
              <span className="text-xs text-gray-500">
                {profile?.badges?.length || 0} / 8
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Complete a chapter to earn a badge — collect 'em all!
            </p>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg flex items-center 
                             justify-center text-xl"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  title={`Badge ${i + 1}`}
                >
                  <span className="opacity-30">🏅</span>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="rounded-xl border border-white/10 p-5"
               style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-bold text-sm font-mono mb-1">
              Need Help?
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Ask questions in our community!
            </p>
            <button
              onClick={() => navigate('/community')}
              className="w-full py-2 text-sm font-mono font-bold rounded-lg
                         border border-white/20 hover:bg-white/10 transition"
            >
              Go to Community →
            </button>
          </div>
        </div>
      </div>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default LevelPage;
