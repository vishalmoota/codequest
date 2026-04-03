import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, Tag, Trophy } from 'lucide-react';
import PROJECT_TUTORIALS from '../data/projectTutorials';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = useMemo(
    () => PROJECT_TUTORIALS.find((item) => item.id === id),
    [id]
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <h1 className="text-3xl font-black">Project not found</h1>
          <button
            onClick={() => navigate('/projects')}
            className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white transition hover:bg-violet-500"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
                <Sparkles size={12} /> Project Tutorial
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">{project.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">{project.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                  <Trophy size={12} className="text-amber-300" /> {project.totalXp} XP
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                  <Clock size={12} /> {project.duration}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                  <Tag size={12} /> {project.difficulty}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {(project.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={`/projects/${project.id}/build?mode=start`}
                  className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
                >
                  Start Building
                </Link>
                <Link
                  to={`/projects/${project.id}/build?mode=continue`}
                  className="rounded-2xl border border-violet-500/30 bg-violet-500/10 px-6 py-3 text-sm font-bold text-violet-100 transition hover:border-violet-400/50 hover:bg-violet-500/20"
                >
                  Continue Building
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Tutorial overview</span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                  {project.author || 'CodeQuest Tutorials'}
                </span>
              </div>
              <div className="space-y-3">
                {project.steps.map((step, index) => (
                  <div key={step.index} className="rounded-2xl border border-white/10 bg-gray-950/60 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold">Step {index + 1}</span>
                      <span className="text-xs text-emerald-300">+{step.xp} XP</span>
                    </div>
                    <p className="text-sm text-gray-400">{step.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
