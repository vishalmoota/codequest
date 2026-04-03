import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Zap, Filter } from 'lucide-react';
import PROJECT_TUTORIALS from '../data/projectTutorials';

const LANG_FILTERS = ['All', 'JS', 'Python', 'HTML', 'React', 'Node.js', 'CSS'];
const DIFFICULTY_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const languageMatches = (project, filter) => {
  if (filter === 'All') return true;
  const tags = (project.tags || []).map((tag) => tag.toLowerCase());
  const language = String(project.language || '').toLowerCase();

  if (filter === 'JS') return language === 'javascript' || tags.includes('javascript');
  if (filter === 'Python') return language === 'python' || tags.includes('python');
  if (filter === 'HTML') return language === 'html' || tags.includes('html');
  if (filter === 'React') return tags.includes('react');
  if (filter === 'Node.js') return tags.includes('node.js');
  if (filter === 'CSS') return tags.includes('css');
  return true;
};

const difficultyClass = {
  Beginner: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Intermediate: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  Advanced: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const ProjectsPage = () => {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const projects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return PROJECT_TUTORIALS.filter((project) => {
      const languageOk = languageMatches(project, language);
      const difficultyOk = difficulty === 'All' || project.difficulty === difficulty;
      const searchable = [project.title, project.description, ...(project.tags || [])].join(' ').toLowerCase();
      const searchOk = !query || searchable.includes(query);
      return languageOk && difficultyOk && searchOk;
    });
  }, [search, language, difficulty]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-gray-900 to-gray-950 px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
            <Filter size={12} /> Project Tutorials
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Build real projects step by step</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
            Codédex-style guided tutorials with step-by-step learning, a split-screen editor, XP rewards, and downloadable finished projects.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search project tutorials..."
              className="w-full rounded-2xl border border-white/10 bg-gray-900/80 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-500/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {LANG_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setLanguage(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${language === filter ? 'border-violet-500/40 bg-violet-500/15 text-violet-200' : 'border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20'}`}
              >
                {filter}
              </button>
            ))}
            {DIFFICULTY_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setDifficulty(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${difficulty === filter ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">Project Catalog</h2>
            <p className="text-sm text-gray-500">{projects.length} tutorial{projects.length === 1 ? '' : 's'} found</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]"
            >
              <div
                className="flex h-44 items-center justify-center bg-gradient-to-br text-6xl"
                style={{ background: project.gradient }}
              >
                <span>{project.icon}</span>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${difficultyClass[project.difficulty] || difficultyClass.Beginner}`}>
                    {project.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{project.author || 'CodeQuest Tutorials'}</span>
                </div>
                <h3 className="text-lg font-bold text-white transition group-hover:text-violet-200">{project.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-400">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {project.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-300">
                    <Zap size={12} /> {project.totalXp} XP
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center text-gray-500">
            No project tutorials match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
