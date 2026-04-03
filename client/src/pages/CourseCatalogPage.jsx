import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import QuestLoader from '../components/QuestLoader';
import BadgePopup from '../components/BadgePopup';
import { BookOpen, Star, ChevronRight, Sparkles, Search, CheckCircle2, Loader2 } from 'lucide-react';

const CATEGORY_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const LANGUAGE_FILTERS = ['All', 'JavaScript', 'Python', 'HTML', 'CSS'];

const COURSE_TOPICS = {
  JavaScript: ['Variables & Types', 'Conditionals', 'Loops', 'Functions & Closures', 'Arrays & Objects'],
  Python: ['Syntax & Variables', 'Lists & Tuples', 'Dictionaries', 'OOP', 'File I/O & Libraries'],
  'HTML & CSS': ['HTML Structure', 'CSS Styling', 'Flexbox & Grid', 'Animations & Transitions'],
  React: ['Components & JSX', 'useState & useEffect', 'Props & State', 'Context API', 'React Router'],
  TypeScript: ['Types & Interfaces', 'Generics', 'Enums', 'Decorators & Utilities'],
  'Node.js': ['Modules & npm', 'Express Framework', 'REST APIs', 'Database Integration'],
};

const DIFFICULTY_COLORS = {
  JavaScript: '#fbbf24', Python: '#3b82f6', 'HTML & CSS': '#f97316',
  React: '#06b6d4', TypeScript: '#6366f1', 'Node.js': '#10b981',
};

const BADGES_MAP = {
  JavaScript: ['Popular 🔥', 'Beginner Friendly ⭐'],
  React: ['Trending 📈'],
  TypeScript: ['Hot 🔥'],
};

const COURSE_BANNERS = [
  { gradient: 'from-emerald-600/40 via-teal-600/30 to-cyan-600/20', emoji: '🌴', scene: 'Jungle Quest' },
  { gradient: 'from-blue-600/40 via-indigo-600/30 to-purple-600/20', emoji: '🏔️', scene: 'Mountain Peak' },
  { gradient: 'from-purple-600/40 via-pink-600/30 to-rose-600/20', emoji: '🌌', scene: 'Cosmic Voyage' },
  { gradient: 'from-orange-600/40 via-red-600/30 to-pink-600/20', emoji: '🌋', scene: 'Volcano Forge' },
  { gradient: 'from-cyan-600/40 via-blue-600/30 to-indigo-600/20', emoji: '🌊', scene: 'Ocean Depths' },
  { gradient: 'from-yellow-600/40 via-amber-600/30 to-orange-600/20', emoji: '⚡', scene: 'Lightning Keep' },
];

const CourseCatalogPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [enrollingId, setEnrollingId] = useState(null);
  const [badgePopup, setBadgePopup] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, profileRes] = await Promise.all([
          api.get('/courses'),
          api.get('/profile'),
        ]);
        setCourses(coursesRes.data);
        setEnrolledIds(new Set((profileRes.data.enrolledCourses || []).map(c => typeof c === 'string' ? c : c._id)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      const res = await api.post('/gamification/enroll', { courseId });
      setEnrolledIds(new Set((res.data.enrolledCourses || []).map(c => typeof c === 'string' ? c : c._id)));
      updateUser({ enrolledCourses: res.data.enrolledCourses });
      if (res.data.newBadges?.length > 0) {
        setBadgePopup(res.data.newBadges);
      }
      // Navigate to the course dashboard after enrollment
      setTimeout(() => navigate(`/dashboard/${courseId}`), 600);
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <QuestLoader size="lg" />
    </div>
  );

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary-900/20 via-dark-800 to-dark-900 border-b border-dark-400/30">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-accent-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Pixel stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
            <Sparkles size={14} className="text-primary-400" />
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">Explore the World of</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">CodeQuest</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            Start your coding journey with interactive programming exercises paired with
            real-world projects. Explore for free! ✨
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-11 text-center"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${categoryFilter === f
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-dark-700 text-slate-400 border border-dark-400 hover:border-primary-500/30 hover:text-slate-200'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* All Courses title */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📚</span>
          <h2 className="text-2xl font-black tracking-tight">All Courses</h2>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            const banner = COURSE_BANNERS[idx % COURSE_BANNERS.length];
            const isEnrolled = enrolledIds.has(course._id);
            const isEnrolling = enrollingId === course._id;
            const isHovered = hoveredId === course._id;
            const topics = COURSE_TOPICS[course.language] || [];
            const courseBadges = BADGES_MAP[course.language] || [];
            const diffColor = DIFFICULTY_COLORS[course.language] || '#6366f1';
            return (
              <div
                key={course._id}
                onMouseEnter={() => setHoveredId(course._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group block overflow-hidden rounded-2xl border border-dark-400/50 bg-dark-700
                  hover:border-primary-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Banner */}
                <div className={`relative h-40 bg-gradient-to-br ${banner.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-30 group-hover:opacity-50 transition-opacity group-hover:scale-110 transform duration-500">
                      {banner.emoji}
                    </span>
                  </div>
                  {/* Pixel overlay */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }}
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 bg-dark-900/60 backdrop-blur-sm rounded text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {course.language}
                    </span>
                  </div>
                  {isEnrolled && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 size={10} /> Enrolled
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">COURSE</div>
                    <div className="flex gap-1">
                      {courseBadges.map(b => (
                        <span key={b} className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/20 font-bold">{b}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-primary-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {course.description}
                  </p>

                  {/* Difficulty bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Difficulty</span>
                      <span className="capitalize">{course.difficulty || 'Beginner'}</span>
                    </div>
                    <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: course.difficulty === 'Advanced' ? '90%' : course.difficulty === 'Intermediate' ? '55%' : '25%', background: diffColor }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <BookOpen size={12} />
                        {course.levels?.length || 0} chapters
                      </span>
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Star size={12} />
                        Beginner
                      </span>
                    </div>
                  </div>

                  {/* Hover expanded topics */}
                  <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-28 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-dark-400/30 pt-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">What you'll learn:</div>
                      <div className="flex flex-wrap gap-1">
                        {topics.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/20">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  {isEnrolled ? (
                    <Link
                      to={`/course/${course._id}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-600 hover:bg-primary-500 
                        text-white font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95
                        shadow-lg shadow-primary-600/20"
                    >
                      Continue Learning <ChevronRight size={16} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolling}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 
                        hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all duration-200 
                        hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {isEnrolling ? (
                        <><Loader2 size={16} className="animate-spin" /> Enrolling...</>
                      ) : (
                        <><Sparkles size={16} /> Enroll Now — Free</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No courses found. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Badge popup */}
      <BadgePopup badges={badgePopup} onClose={() => setBadgePopup([])} />
    </div>
  );
};

export default CourseCatalogPage;
