import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, Zap, Star, Clock, Filter, ChevronRight, Flame, Trophy, Cpu } from 'lucide-react';

const CATEGORIES = ['All', 'JavaScript', 'Python', 'HTML', 'React', 'Node.js', 'AI', 'Game'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const DIFF_COLORS = {
  Beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const CAT_EMOJIS = {
  JavaScript: '🟡', Python: '🐍', HTML: '🎨', React: '⚛️',
  'Node.js': '🟢', AI: '🤖', Game: '🎮', All: '🗂️',
};

const useScrollReveal = () => {
  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('revealed');
      });
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
    return () => window.removeEventListener('scroll', reveal);
  }, []);
};

const ProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={`/projects/${project._id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block rounded-2xl overflow-hidden border border-dark-400/50 bg-dark-700
        hover:border-primary-500/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl
        hover:shadow-primary-500/10 scroll-reveal"
      style={{ transitionDelay: `${(index % 4) * 60}ms` }}>
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${project.gradient || 'from-primary-600 to-accent-purple'} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:scale-125">
            {project.emoji}
          </span>
        </div>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/30 px-2 py-1 rounded-md">TUTORIAL</span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFF_COLORS[project.difficulty] || DIFF_COLORS.Beginner}`}>
            {project.difficulty}
          </span>
        </div>
        {project.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">⭐ Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-100 group-hover:text-primary-300 transition-colors mb-1 leading-tight">{project.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{project.description}</p>

        {/* Tags + hover topics */}
        <div className={`overflow-hidden transition-all duration-300 ${hovered ? 'max-h-16 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-wrap gap-1">
            {project.tags?.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/20">{t}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={11} /> {project.estimatedTime || '30 min'}
            </span>
            <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
              <Zap size={11} /> {project.xpReward} XP
            </span>
          </div>
          <span className="text-xs text-slate-500">{CAT_EMOJIS[project.category]} {project.category}</span>
        </div>
      </div>
    </Link>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  useScrollReveal();

  useEffect(() => {
    api.get('/projects').then(r => { setProjects(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let arr = [...projects];
    if (category !== 'All') arr = arr.filter(p => p.category === category);
    if (difficulty !== 'All') arr = arr.filter(p => p.difficulty === difficulty);
    if (search) arr = arr.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())));
    setFiltered(arr);
  }, [projects, category, difficulty, search]);

  const beginner = filtered.filter(p => p.group === 'beginner' || p.difficulty === 'Beginner');
  const aiProjects = filtered.filter(p => p.group === 'ai' || p.category === 'AI');
  const hackathon = filtered.filter(p => p.group === 'hackathon');
  const allProjects = filtered;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4 animate-spin">⚙️</div><p className="text-slate-400">Loading projects...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent" />
        <div className="morph-blob absolute w-80 h-80 bg-primary-600/10 blur-3xl top-0 left-1/4" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
            <Cpu size={14} className="text-primary-400" />
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">Build Real Projects</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 orbitron">
            🛠️ Project <span className="gradient-text">Tutorials</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Ready to build? Explore step-by-step project walkthroughs with theory, code, hints, and AI assistance. Build real apps and earn XP.
          </p>
          <div className="flex items-center gap-4 justify-center mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> Earn XP</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-purple-400" /> Step-by-step guides</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Flame size={14} className="text-orange-400" /> AI Hints</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Trophy size={14} className="text-yellow-400" /> Community Comments</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-dark-800/95 backdrop-blur-xl border-b border-dark-400/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-shrink-0 w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-dark-600 border border-dark-400/50 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary-500/50" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${category === c
                  ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-dark-600/50 border-dark-400/40 text-slate-400 hover:border-primary-500/30'}`}>
                {CAT_EMOJIS[c]} {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {DIFFICULTIES.filter(d => d !== 'All').map(d => (
              <button key={d} onClick={() => setDifficulty(difficulty === d ? 'All' : d)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${difficulty === d
                  ? DIFF_COLORS[d] : 'bg-dark-600/50 border-dark-400/40 text-slate-400'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Beginner section */}
        {(category === 'All' && difficulty === 'All' && !search) && beginner.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🌱</span>
              <div>
                <h2 className="text-2xl font-black text-slate-100">Beginner-friendly picks</h2>
                <p className="text-sm text-slate-500">Build your first projects — perfect after completing a course</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {beginner.slice(0, 4).map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </div>
          </section>
        )}

        {/* AI section */}
        {(category === 'All' || category === 'AI') && aiProjects.length > 0 && !search && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🤖</span>
              <div>
                <h2 className="text-2xl font-black text-slate-100">Get AI-ready</h2>
                <p className="text-sm text-slate-500">Dive into AI projects and see what all the buzz is about</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {aiProjects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </div>
          </section>
        )}

        {/* Hackathon section */}
        {(category === 'All') && hackathon.length > 0 && !search && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🚀</span>
              <div>
                <h2 className="text-2xl font-black text-slate-100">Hackathon starter pack</h2>
                <p className="text-sm text-slate-500">Get your next project off the ground with practical deployment guides</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {hackathon.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </div>
          </section>
        )}

        {/* All projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-100">
                {search || category !== 'All' || difficulty !== 'All' ? `Results (${allProjects.length})` : '🗂️ All project tutorials'}
              </h2>
              <p className="text-sm text-slate-500">
                {search ? `Matching "${search}"` : 'Explore our full collection of step-by-step project guides'}
              </p>
            </div>
          </div>
          {allProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-400 text-lg">No projects match your filters</p>
              <button onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }}
                className="mt-4 text-primary-400 hover:text-primary-300 text-sm">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {allProjects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectsPage;
