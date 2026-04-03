import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedCounter from '../components/AnimatedCounter';
import {
  Code2, ChevronRight, Sparkles, Zap, BookOpen, Trophy,
  Swords, Star, Users, Flame, ArrowRight, Play, Target, Cpu
} from 'lucide-react';

/* ════════════════════════════════════
   3D FLOATING CODE GLOBE
════════════════════════════════════ */
const CodeGlobe = () => {
  const ITEMS = [
    'const','let','function','=>','if','for','while',
    'return','class','import','async','await','map()',
    'filter()','reduce()','JSON','Array','Object','.then',
    'try','catch','===','null','true','false','{}','[]',
  ];

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto" style={{ perspective: '800px' }}>
      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary-600/20 blur-2xl animate-pulse" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-primary-500/30 animate-spin"
          style={{ animationDuration: '8s' }} />
        <div className="absolute w-8 h-8 rounded-full bg-primary-500/40" />
        <span className="absolute text-2xl animate-pulse">⚡</span>
      </div>

      {/* Orbiting code labels */}
      {ITEMS.map((item, i) => {
        const total = ITEMS.length;
        const angle = (i / total) * 360;
        const radius = 120 + (i % 3) * 20;
        const speed = 12 + (i % 5) * 3;
        const delay = -(i * (speed / total));
        const tilt = (i % 4) * 15 - 30;
        return (
          <div key={i}
            className="absolute inset-0 flex items-center justify-center"
            style={{ animationDelay: `${delay}s` }}>
            <div
              className="absolute"
              style={{
                animation: `spin ${speed}s linear infinite`,
                animationDelay: `${delay}s`,
                transform: `rotate(${angle}deg)`,
              }}>
              <span
                className="absolute code-tag text-[10px] md:text-xs whitespace-nowrap"
                style={{
                  left: radius,
                  top: '50%',
                  transform: `translateY(-50%) rotateY(${-angle}deg) rotateX(${tilt}deg)`,
                  opacity: 0.7 + (i % 3) * 0.1,
                  animationDelay: `${delay}s`,
                }}
              >
                {item}
              </span>
            </div>
          </div>
        );
      })}

      {/* Ring decorations */}
      {[80, 130, 170].map((r, i) => (
        <div key={i}
          className="absolute top-1/2 left-1/2 rounded-full border border-primary-500/10"
          style={{
            width: r * 2, height: r * 2,
            marginLeft: -r, marginTop: -r,
            animation: `spin ${20 + i * 5}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }}
        />
      ))}
    </div>
  );
};

/* ════════════════════════════════════
   TYPEWRITER
════════════════════════════════════ */
const Typewriter = ({ phrases, className }) => {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timeout;
    if (!deleting) {
      if (charIdx < phrase.length) {
        timeout = setTimeout(() => setCharIdx(c => c + 1), 60);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx(c => c - 1), 35);
      } else {
        setDeleting(false);
        setPhraseIdx(p => (p + 1) % phrases.length);
      }
    }
    setDisplayed(phrase.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-0.5 h-8 bg-yellow-400 ml-1 animate-pulse" />
    </span>
  );
};

/* ════════════════════════════════════
   FLOATING GAME CHARACTER
════════════════════════════════════ */
const FloatingChar = ({ emoji, x, y, delay, size = '3xl' }) => (
  <div
    className={`absolute text-${size} pointer-events-none select-none`}
    style={{
      left: `${x}%`, top: `${y}%`,
      animation: `float 4s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
      zIndex: 2,
    }}
  >
    {emoji}
  </div>
);

/* ════════════════════════════════════
   SCROLL REVEAL HOOK
════════════════════════════════════ */
const useScrollReveal = () => {
  useEffect(() => {
    const revealItems = () => {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) {
          el.classList.add('revealed');
        }
      });
    };
    revealItems();
    window.addEventListener('scroll', revealItems, { passive: true });
    return () => window.removeEventListener('scroll', revealItems);
  }, []);
};

/* ════════════════════════════════════
   XP BAR DEMO
════════════════════════════════════ */
const DemoXPBar = () => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setWidth(68);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-yellow-300 font-bold flex items-center gap-1">
          <Zap size={12} /> 680 / 1000 XP
        </span>
        <span className="text-slate-500">Level 5</span>
      </div>
      <div className="h-3 bg-dark-500 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1500 ease-out"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            boxShadow: '0 0 12px rgba(99,102,241,0.6)',
            transitionDuration: '1.5s',
          }} />
      </div>
    </div>
  );
};

/* ════════════════════════════════════
   LEARNING PATH ROADMAP
════════════════════════════════════ */
const LearningPath = () => {
  const nodes = [
    { emoji: '🌱', label: 'Variables', color: '#10b981', done: true },
    { emoji: '🔀', label: 'Logic', color: '#3b82f6', done: true },
    { emoji: '🔄', label: 'Loops', color: '#a855f7', done: false, current: true },
    { emoji: '⚙️', label: 'Functions', color: '#f59e0b', done: false },
    { emoji: '📦', label: 'Arrays', color: '#ef4444', done: false },
    { emoji: '🏆', label: 'Master', color: '#fbbf24', done: false },
  ];

  return (
    <div className="relative overflow-x-auto py-6">
      <div className="flex items-center gap-0 min-w-[520px]">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-300 ${
                  n.done ? 'scale-110 shadow-lg' :
                  n.current ? 'scale-125 animate-pulse-glow' : 'opacity-50'}`}
                style={{
                  borderColor: n.done || n.current ? n.color : '#334155',
                  background: n.done || n.current ? `${n.color}22` : 'rgba(30,41,59,0.8)',
                  boxShadow: n.current ? `0 0 20px ${n.color}55` : undefined,
                }}
              >
                {n.done ? '✅' : n.emoji}
              </div>
              <span className="text-[10px] text-slate-500 mt-2 font-medium">{n.label}</span>
              {n.current && <span className="text-[9px] text-primary-400 animate-pulse">← You</span>}
            </div>
            {i < nodes.length - 1 && (
              <div className="w-8 h-1 rounded-full mx-1 transition-all"
                style={{ background: n.done ? n.color : '#1e293b' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════
   ANIMATED BADGE SHOWCASE
════════════════════════════════════ */
const BadgeShowcase = () => {
  const badges = [
    { emoji: '🩸', label: 'First Blood', desc: 'Solved first challenge', color: '#ef4444' },
    { emoji: '🔥', label: '7-Day Streak', desc: 'Coded 7 days in a row', color: '#f97316' },
    { emoji: '⚡', label: '100 XP', desc: 'Earned first 100 XP', color: '#fbbf24' },
    { emoji: '🏆', label: 'JS Master', desc: 'Completed JS course', color: '#a855f7' },
    { emoji: '⚔️', label: 'Battle Won', desc: 'Won first code battle', color: '#6366f1' },
    { emoji: '💎', label: '1000 XP', desc: 'Earned 1000 XP', color: '#06b6d4' },
  ];
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {badges.map((b, i) => (
        <div
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="relative flex flex-col items-center cursor-pointer"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-300"
            style={{
              borderColor: hovered === i ? b.color : 'rgba(51,65,85,0.5)',
              background: hovered === i ? `${b.color}22` : 'rgba(26,26,46,0.8)',
              transform: hovered === i ? 'scale(1.2) translateY(-4px)' : 'scale(1)',
              boxShadow: hovered === i ? `0 8px 25px ${b.color}44` : 'none',
            }}
          >
            {b.emoji}
          </div>
          {hovered === i && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-dark-600 border border-dark-400/70 rounded-lg px-3 py-2 text-center w-28 z-20 animate-slide-up">
              <div className="text-xs font-bold text-slate-200">{b.label}</div>
              <div className="text-[10px] text-slate-400">{b.desc}</div>
            </div>
          )}
          <span className="text-[10px] text-slate-500 mt-1">{b.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════
   RANK PROGRESSION BAR
════════════════════════════════════ */
const RankBar = () => {
  const ranks = [
    { label: 'Bronze', emoji: '🥉', xp: 0, color: '#cd7f32' },
    { label: 'Silver', emoji: '🥈', xp: 200, color: '#9ca3af' },
    { label: 'Gold', emoji: '🥇', xp: 500, color: '#fbbf24' },
    { label: 'Platinum', emoji: '💠', xp: 1000, color: '#38bdf8' },
    { label: 'Diamond', emoji: '💎', xp: 2000, color: '#a855f7' },
  ];

  return (
    <div className="flex items-end justify-between gap-2 mt-4">
      {ranks.map((r, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xl">{r.emoji}</span>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 40 + i * 12, background: 'rgba(30,41,59,0.8)' }}>
            <div className="w-full h-full rounded-full scroll-reveal"
              style={{
                background: `linear-gradient(180deg, ${r.color}44, ${r.color}22)`,
                border: `1px solid ${r.color}44`,
                transition: 'all 1s ease',
              }} />
          </div>
          <span className="text-[9px] text-slate-500">{r.label}</span>
          <span className="text-[9px] text-slate-600">{r.xp} XP</span>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════
   FEATURE CARDS DATA
════════════════════════════════════ */
const FEATURES = [
  { icon: BookOpen, title: 'Rich Theory Content', desc: 'Every chapter has a complete theory panel with animated diagrams, SVG visualizations, interactive code examples, mini-quizzes, and links to the best programming books.', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { icon: Swords, title: 'Code Battle Arena', desc: 'Race against AI opponents in timed coding duels. Think fast, code faster! Earn bonus XP for speed and accuracy.', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { icon: Trophy, title: 'Achievements & Ranks', desc: 'Earn XP, unlock badges, climb from Bronze to Diamond. 15+ unique achievements to collect. Your progress is tracked in real time.', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { icon: Flame, title: 'Daily Streaks', desc: 'Build your coding habit with daily challenges. Miss a day and your streak resets! Streak multipliers boost your XP earnings.', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { icon: Target, title: 'Mini-Quizzes in Theory', desc: 'Every theory section has multiple-choice quizzes with instant feedback. Learn by doing, get immediate explanations.', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
  { icon: Cpu, title: 'AI-Powered Hints', desc: 'Stuck on a challenge? Use hints that get progressively more specific. Learn the right approach without giving away the answer.', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
];

const COURSES_PREVIEW = [
  { title: 'JavaScript', emoji: '🟡', color: 'from-yellow-600/30 to-orange-700/20', level: 'Beginner', chapters: 5, topics: ['Variables & Types', 'Functions', 'Arrays & Objects', 'Closures', 'Async/Await'] },
  { title: 'Python', emoji: '🐍', color: 'from-blue-600/30 to-green-700/20', level: 'Beginner', chapters: 5, topics: ['Syntax', 'Lists & Dicts', 'OOP', 'File I/O', 'Libraries'] },
  { title: 'HTML & CSS', emoji: '🎨', color: 'from-orange-600/30 to-pink-700/20', level: 'Beginner', chapters: 4, topics: ['HTML Structure', 'CSS Styling', 'Flexbox', 'Animations'] },
  { title: 'React', emoji: '⚛️', color: 'from-cyan-600/30 to-blue-700/20', level: 'Intermediate', chapters: 5, topics: ['Components', 'Hooks', 'State', 'Context', 'React Router'] },
  { title: 'TypeScript', emoji: '🔷', color: 'from-blue-600/30 to-indigo-700/20', level: 'Intermediate', chapters: 4, topics: ['Types', 'Interfaces', 'Generics', 'Decorators'] },
  { title: 'Node.js', emoji: '🟢', color: 'from-green-600/30 to-emerald-700/20', level: 'Intermediate', chapters: 4, topics: ['Modules', 'Express', 'APIs', 'Databases'] },
];

const STATS = [
  { value: 50, label: 'Challenges', suffix: '+' },
  { value: 6, label: 'Courses', suffix: '' },
  { value: 30, label: 'Chapters', suffix: '+' },
  { value: 15, label: 'Badges', suffix: '+' },
];

const HOW_IT_WORKS = [
  { step: 1, emoji: '🎮', title: 'Pick a Course', desc: 'Choose JavaScript, Python, HTML, React — whatever excites you. Every course is a story-driven adventure with chapters, lore, and characters.' },
  { step: 2, emoji: '📖', title: 'Read Rich Theory', desc: 'Each chapter has a complete theory panel: animated diagrams, flowcharts, memory models, mini-quizzes, and links to the best programming books.' },
  { step: 3, emoji: '💻', title: 'Solve Challenges', desc: 'Write real code in the in-browser Monaco editor. Get instant feedback, use hints, and earn XP for every challenge you complete.' },
  { step: 4, emoji: '🏆', title: 'Level Up & Compete', desc: 'Earn XP, unlock ranks from Bronze to Diamond, collect badges, fight in Code Battle Arena, and climb the leaderboard.' },
];

/* ════════════════════════════════════
   MAIN HOME PAGE
════════════════════════════════════ */
const HomePage = () => {
  const { user } = useAuth();
  const [hoveredCourse, setHoveredCourse] = useState(null);

  useScrollReveal();

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="morph-blob absolute w-80 h-80 bg-primary-600/20 blur-3xl"
            style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
          <div className="morph-blob absolute w-96 h-96 bg-accent-purple/15 blur-3xl"
            style={{ top: '50%', right: '5%', animationDelay: '3s' }} />
          <div className="morph-blob absolute w-64 h-64 bg-accent-cyan/10 blur-3xl"
            style={{ bottom: '10%', left: '40%', animationDelay: '6s' }} />
          {/* Scan line */}
          <div className="scan-line" style={{ opacity: 0.3 }} />
        </div>

        {/* Twinkling stars */}
        {[...Array(50)].map((_, i) => (
          <div key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }} />
        ))}

        {/* Floating characters */}
        <FloatingChar emoji="🧙‍♂️" x={5} y={15} delay={0} size="4xl" />
        <FloatingChar emoji="🤖" x={88} y={12} delay={1} size="4xl" />
        <FloatingChar emoji="🐉" x={80} y={58} delay={2} size="5xl" />
        <FloatingChar emoji="⚔️" x={10} y={65} delay={0.5} size="3xl" />
        <FloatingChar emoji="🏆" x={92} y={40} delay={1.5} size="3xl" />
        <FloatingChar emoji="🌟" x={45} y={5} delay={0.8} size="2xl" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

        {/* Hero content + Globe side by side on desktop */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* LEFT: Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6 animate-bounce-in">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">The #1 Gamified Coding Platform</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 animate-slide-up orbitron leading-tight">
                <span className="text-yellow-400">Code</span>
                <span className="text-slate-100">Quest</span>
              </h1>

              <div className="text-xl md:text-2xl text-slate-300 mb-4 h-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Typewriter
                  phrases={[
                    'Learn JavaScript by adventuring! 🗺️',
                    'Earn XP & level up your skills! ⚡',
                    'Compete in epic Code Battles! ⚔️',
                    'Unlock badges & climb ranks! 🏆',
                    'Build real-world projects! 💻',
                  ]}
                  className="text-primary-300 font-semibold"
                />
              </div>

              <p className="text-sm text-slate-500 mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Interactive courses • Rich theory diagrams • Code battles • Achievements • Free to start ✨
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                {user ? (
                  <Link to="/dashboard"
                    className="relative overflow-hidden bg-yellow-400 hover:bg-yellow-300 text-dark-900 font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20 flex items-center gap-2 group">
                    <Play size={20} />
                    Continue Journey
                    <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl transition-transform duration-300" />
                  </Link>
                ) : (
                  <>
                    <Link to="/signup"
                      className="relative overflow-hidden bg-yellow-400 hover:bg-yellow-300 text-dark-900 font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20 flex items-center gap-2 group">
                      <Zap size={20} />
                      Start Your Quest — Free
                      <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl transition-transform duration-300" />
                    </Link>
                    <Link to="/login" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                      Sign In <ArrowRight size={18} />
                    </Link>
                  </>
                )}
              </div>

              {/* Animated stats */}
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 md:gap-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                {STATS.map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-white">
                      <AnimatedCounter target={s.value} suffix={s.suffix} duration={1200} />
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: 3D Globe */}
            <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CodeGlobe />
              {/* Rank preview below globe */}
              <div className="mt-6 max-w-xs mx-auto">
                <DemoXPBar />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-slate-500">Scroll to explore</span>
            <div className="w-5 h-8 rounded-full border-2 border-slate-600 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-slate-400 rounded-full animate-slide-up" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ GAMIFICATION SHOWCASE ═══════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-800/30 to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-4xl block mb-4">🎮</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Coding Feels Like a Game</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              XP, ranks, badges, streaks, and battles — every mechanism is designed to keep you motivated and growing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Badge showcase */}
            <div className="card scroll-reveal-left" style={{ transitionDelay: '0ms' }}>
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-400" /> Achievements
              </h3>
              <p className="text-xs text-slate-500 mb-4">Hover to preview</p>
              <BadgeShowcase />
            </div>

            {/* Rank progression */}
            <div className="card scroll-reveal" style={{ transitionDelay: '150ms' }}>
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Star size={18} className="text-purple-400" /> Rank Progression
              </h3>
              <p className="text-xs text-slate-500 mb-2">Climb from Bronze to Diamond</p>
              <RankBar />
            </div>

            {/* Learning path */}
            <div className="card scroll-reveal-right" style={{ transitionDelay: '300ms' }}>
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Target size={18} className="text-cyan-400" /> Chapter Roadmap
              </h3>
              <p className="text-xs text-slate-500 mb-2">Your visual learning path</p>
              <LearningPath />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COURSES ═══════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-4xl block mb-4">🗺️</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">The Legend Begins</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Choose your first language. Each course is a world with its own story, chapters, rich theory, interactive challenges, and boss battles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES_PREVIEW.map((c, i) => (
              <Link
                key={c.title}
                to={user ? '/courses' : '/signup'}
                onMouseEnter={() => setHoveredCourse(i)}
                onMouseLeave={() => setHoveredCourse(null)}
                className="group block overflow-hidden rounded-2xl border border-dark-400/50 bg-dark-700 hover:border-primary-500/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary-500/10 scroll-reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`relative h-36 bg-gradient-to-br ${c.color} overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-125">
                      {c.emoji}
                    </span>
                  </div>
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }} />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                      ${c.level === 'Beginner' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-blue-500/30 text-blue-300'}`}>
                      {c.level}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">COURSE</div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary-300 transition-colors mb-2">{c.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{c.chapters} chapters • {c.topics.length} topics</p>

                  {/* Hover expanded topics */}
                  <div className={`overflow-hidden transition-all duration-300 ${hoveredCourse === i ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-dark-400/30 pt-2 mb-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">What you'll learn:</div>
                      <div className="flex flex-wrap gap-1">
                        {c.topics.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/20">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Zap size={11} /> {c.chapters * 10 * 10} XP available
                    </div>
                    <span className="text-xs text-primary-400 group-hover:text-primary-300 font-semibold flex items-center gap-1">
                      Explore <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 scroll-reveal">
            <Link to={user ? '/courses' : '/signup'}
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors text-lg">
              View all courses <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-24 px-4 bg-dark-800/50 border-y border-dark-400/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-black mb-4">More Than Just Coding</h2>
            <p className="text-slate-400 text-lg">Every feature is designed to make learning addictive, effective, and fun</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card card-3d flex flex-col gap-4 ${
                  i % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
                style={{ transitionDelay: `${(i % 3) * 120}ms` }}
              >
                <div className={`p-3 rounded-xl ${f.bg} border ${f.border} self-start`}>
                  <f.icon size={24} className={f.color} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Your coding adventure in 4 epic steps</p>
          </div>

          <div className="space-y-0 relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-yellow-400 via-primary-500 to-accent-purple hidden md:block" />
            {HOW_IT_WORKS.map((s, i) => (
              <div
                key={s.step}
                className={`flex items-start gap-6 py-6 scroll-reveal`}
                style={{ transitionDelay: `${i * 180}ms` }}
              >
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-dark-700 border border-dark-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg hover:scale-110 transition-transform cursor-default">
                  {s.emoji}
                </div>
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Step {s.step}</div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24 px-4 scroll-reveal">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-3xl border border-primary-500/20 p-12"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(26,26,46,0.9), rgba(168,85,247,0.15))' }}>
            <div className="morph-blob absolute w-40 h-40 bg-primary-600/15 blur-3xl top-0 left-0" />
            <div className="morph-blob absolute w-40 h-40 bg-accent-purple/15 blur-3xl bottom-0 right-0" style={{ animationDelay: '4s' }} />
            {[...Array(12)].map((_, i) => (
              <div key={i}
                className="absolute w-1.5 h-1.5 rounded-sm bg-primary-400/20"
                style={{
                  left: `${8 + i * 7.5}%`, top: `${15 + (i % 4) * 22}%`,
                  animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.25}s`,
                }} />
            ))}
            <div className="relative z-10">
              <span className="text-6xl mb-6 block" style={{ animation: 'float 2s ease-in-out infinite' }}>🚀</span>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Begin?</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Join thousands of learners on their coding adventure. Free forever to start.
              </p>
              {user ? (
                <Link to="/dashboard" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                  <Play size={20} /> Go to Dashboard
                </Link>
              ) : (
                <Link to="/signup"
                  className="relative overflow-hidden bg-yellow-400 hover:bg-yellow-300 text-dark-900 font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-xl shadow-yellow-400/20 inline-flex items-center gap-2">
                  <Zap size={20} /> Start Your Quest — Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-dark-400/30 bg-dark-800/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                    <Code2 size={14} className="text-dark-900" />
                  </div>
                </div>
                <span className="text-lg font-black orbitron">
                  <span className="text-yellow-400">Code</span><span className="text-slate-100">Quest</span>
                </span>
              </div>
              <p className="text-sm text-slate-500">Made with ❤️ for coders everywhere</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">LEARN</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {['All Courses', 'JavaScript', 'Python', 'HTML & CSS'].map(l => (
                  <li key={l}><Link to="/courses" className="hover:text-slate-300 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">PRACTICE</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/battle" className="hover:text-slate-300 transition-colors">Code Battle</Link></li>
                <li><Link to="/leaderboard" className="hover:text-slate-300 transition-colors">Leaderboard</Link></li>
                <li><Link to="/achievements" className="hover:text-slate-300 transition-colors">Achievements</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">COMMUNITY</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><span className="cursor-default">About</span></li>
                <li><span className="cursor-default">Discord</span></li>
                <li><span className="cursor-default">Help Center</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-400/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2026 CodeQuest. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
