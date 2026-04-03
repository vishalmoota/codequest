import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CommentSection from '../components/CommentSection';
import TheoryBlock from '../components/TheoryBlock';
import { Zap, Clock, CheckCircle2, Lightbulb, BookOpen, ArrowLeft, Heart, Share2, Award, EyeOff, Code2 } from 'lucide-react';

const LANG_COLORS = { javascript: '#fbbf24', python: '#3b82f6', html: '#f97316', css: '#06b6d4', bash: '#10b981', jsx: '#67e8f9' };

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative rounded-xl overflow-hidden border border-dark-400/50 my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-400/30" style={{ background: '#0d1117' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500/80" /><span className="w-3 h-3 rounded-full bg-yellow-500/80" /><span className="w-3 h-3 rounded-full bg-green-500/80" /></div>
          <span className="text-xs font-mono text-slate-500">{language || 'code'}</span>
        </div>
        <button onClick={copy} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-slate-300" style={{ background: '#0d1117' }}>
        <code style={{ color: LANG_COLORS[language] || '#e2e8f0' }}>{code}</code>
      </pre>
    </div>
  );
};

const StepCard = ({ step, stepIndex, total }) => {
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${completed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-dark-400/50 bg-dark-700/60'}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <button onClick={() => setCompleted(!completed)}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${completed ? 'bg-emerald-500 border-emerald-400' : 'border-dark-400 hover:border-primary-500'}`}>
            {completed ? <CheckCircle2 size={16} className="text-white" /> : <span className="text-xs font-bold text-slate-400">{step.stepNum}</span>}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-600 font-mono">Step {step.stepNum}/{total}</span>
              {step.language && (
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold"
                  style={{ background: `${LANG_COLORS[step.language]}20`, color: LANG_COLORS[step.language] }}>
                  {step.language}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-3">{step.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{step.explanation}</p>
            {step.code && <CodeBlock code={step.code} language={step.language} />}
          </div>
        </div>

        {/* Hint */}
        {step.hint && (
          <div className="mt-3 ml-12">
            <button onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-semibold">
              <Lightbulb size={13} />
              {showHint ? 'Hide Hint' : 'Show Hint'}
              <EyeOff size={12} className={showHint ? 'hidden' : ''} />
            </button>
            {showHint && (
              <div className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
                💡 <strong>Hint:</strong> {step.hint}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [xpEarned, setXPEarned] = useState(0);
  const [activeTab, setActiveTab] = useState('steps'); // steps | theory | build | comments

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => {
      setProject(r.data);
      setLikeCount(r.data.likes?.length || 0);
      setLiked(r.data.likes?.some(l => l._id === user?._id || l === user?._id));
      setCompleted(r.data.completedBy?.some(c => c.username === user?.username || c === user?._id));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) return;
    try {
      const r = await api.post(`/projects/${id}/like`);
      setLiked(r.data.liked);
      setLikeCount(r.data.likes);
    } catch {}
  };

  const handleComplete = async () => {
    if (!user || completed) return;
    try {
      const r = await api.post(`/projects/${id}/complete`);
      if (!r.data.alreadyCompleted) {
        setXPEarned(r.data.xpEarned);
        setShowXP(true);
        setCompleted(true);
        updateUser({ xp: r.data.totalXP });
        setTimeout(() => setShowXP(false), 3000);
      }
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-5xl animate-spin">⚙️</div></div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="text-4xl mb-3">🔍</div><p className="text-slate-400">Project not found</p><Link to="/projects" className="text-primary-400 hover:underline text-sm mt-2 block">← Back to projects</Link></div></div>;

  return (
    <div className="min-h-screen">
      {/* XP Pop */}
      {showXP && (
        <div className="fixed top-24 right-8 z-50 px-5 py-3 rounded-2xl font-black text-2xl text-yellow-300 animate-bounce"
          style={{ background: 'rgba(251,191,36,0.2)', border: '2px solid rgba(251,191,36,0.4)' }}>
          ⚡ +{xpEarned} XP!
        </div>
      )}

      {/* Hero */}
      <div className={`relative py-12 px-4 bg-gradient-to-br ${project.gradient || 'from-primary-900/40 to-dark-800'} overflow-hidden border-b border-dark-400/20`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
        <div className="max-w-5xl mx-auto relative">
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <div className="flex items-start gap-6">
            <div className="text-7xl">{project.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-white/70 bg-black/30 px-2 py-1 rounded-md uppercase tracking-wider">TUTORIAL</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  project.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  project.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                  'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>{project.difficulty}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{project.title}</h1>
              <p className="text-slate-300 mb-4 max-w-2xl">{project.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {project.estimatedTime}</span>
                <span className="flex items-center gap-1.5 text-yellow-300 font-semibold"><Zap size={14} /> {project.xpReward} XP</span>
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> {project.steps?.length} steps</span>
                <span className="flex items-center gap-1.5"><Award size={14} /> {project.category}</span>
              </div>
            </div>
          </div>

          {/* Action buttons — Mark Complete button removed, Build mode added */}
          <div className="flex items-center gap-3 mt-6">
            {completed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold">
                <CheckCircle2 size={15} /> Completed!
              </div>
            ) : (
              <Link to={`/projects/${id}/build`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
                           bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20
                           transition-all hover:scale-105 active:scale-95">
                <Code2 size={15} /> Start Building
              </Link>
            )}
            <button onClick={handleLike}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm border transition-all flex items-center gap-2 ${liked
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                : 'bg-dark-600/50 border-dark-400/40 text-slate-400 hover:border-pink-500/40'}`}>
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {likeCount}
            </button>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-4 py-2.5 rounded-xl font-bold text-sm border border-dark-400/40 bg-dark-600/50 text-slate-400 hover:border-primary-500/40 transition-all flex items-center gap-2">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-dark-700/50 p-1 rounded-xl">
              {[['steps', '📋 Steps'], ['theory', '📚 Theory'], ['build', '🛠️ Build'], ['comments', '💬 Comments']].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Steps tab */}
            {activeTab === 'steps' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 mb-6">
                  Follow each step in order. Click the circle checkbox to mark a step complete. Stuck? Click "Show Hint".
                </p>
                {project.steps?.length > 0 ? project.steps.map((step, i) => (
                  <StepCard key={i} step={step} stepIndex={i} total={project.steps.length} />
                )) : <p className="text-slate-500 text-center py-8">Steps coming soon!</p>}
              </div>
            )}

            {/* Theory tab — upgraded with TheoryBlock */}
            {activeTab === 'theory' && (
              <div>
                {project.prerequisites?.length > 0 && (
                  <div className="mb-4 p-4 rounded-xl bg-dark-700/50 border border-dark-400/40">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.prerequisites.map(p => (
                        <span key={p} className="text-xs px-3 py-1 rounded-full bg-dark-500 border border-dark-400/50 text-slate-400">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {project.whatYoullLearn?.length > 0 && (
                  <TheoryBlock
                    emoji="🎯"
                    title="What You'll Learn"
                    explanation={
                      <ul className="space-y-2">
                        {project.whatYoullLearn.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    }
                  />
                )}

                {project.theory ? (
                  <TheoryBlock
                    emoji="📖"
                    title="Theory & Concepts"
                    explanation={
                      <div className="space-y-1 text-sm text-slate-400 leading-relaxed">
                        {project.theory.split('\n').map((line, i) => {
                          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-100 mt-6 mb-3">{line.slice(3)}</h2>;
                          if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-slate-200 mt-4 mb-2">{line.slice(4)}</h3>;
                          if (line.startsWith('- ')) return <p key={i} className="ml-2">• {line.slice(2)}</p>;
                          if (line.trim() === '') return <div key={i} className="h-1.5" />;
                          return <p key={i}>{line}</p>;
                        })}
                      </div>
                    }
                  />
                ) : (
                  <p className="text-slate-600 text-sm text-center py-8">Theory content coming soon!</p>
                )}
              </div>
            )}

            {/* Build tab — link to full workspace */}
            {activeTab === 'build' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🛠️</div>
                <h3 className="text-xl font-black text-slate-100 mb-2">Build Workspace</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                  Open the full-screen code editor with step-by-step instructions on the left and a live Monaco editor on the right.
                </p>
                <Link to={`/projects/${id}/build`}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500
                             rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg shadow-primary-500/20">
                  <Code2 size={18} /> Open Build Workspace
                </Link>
                <p className="text-xs text-slate-600 mt-3">Monaco Editor • Syntax Highlighting • Run & Preview</p>
              </div>
            )}

            {/* Comments tab */}
            {activeTab === 'comments' && <CommentSection projectId={id} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Project info */}
            <div className="card">
              <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><Award size={14} className="text-yellow-400" /> About this project</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-400"><span>Category</span><span className="text-slate-200">{project.category}</span></div>
                <div className="flex justify-between text-slate-400"><span>Difficulty</span><span className="text-slate-200">{project.difficulty}</span></div>
                <div className="flex justify-between text-slate-400"><span>Time</span><span className="text-slate-200">{project.estimatedTime}</span></div>
                <div className="flex justify-between text-slate-400"><span>Steps</span><span className="text-slate-200">{project.steps?.length || 0}</span></div>
                <div className="flex justify-between text-slate-400"><span>XP Reward</span><span className="text-yellow-300 font-bold">⚡ {project.xpReward}</span></div>
                <div className="flex justify-between text-slate-400"><span>Completed by</span><span className="text-slate-200">{project.completedBy?.length || 0} learners</span></div>
              </div>
            </div>

            {/* Tags */}
            <div className="card">
              <h3 className="text-sm font-bold text-slate-300 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map(t => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/20">{t}</span>
                ))}
              </div>
            </div>

            {/* What you'll learn */}
            {project.whatYoullLearn?.length > 0 && (
              <div className="card">
                <h3 className="text-sm font-bold text-slate-300 mb-3">What you'll learn</h3>
                <div className="space-y-2">
                  {project.whatYoullLearn.map(item => (
                    <div key={item} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle2 size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Go to community */}
            <Link to="/community" className="card block hover:border-primary-500/40 transition-all group">
              <h3 className="text-sm font-bold text-slate-300 mb-1 group-hover:text-primary-300 transition-colors">💬 Need help?</h3>
              <p className="text-xs text-slate-500">Join the real-time community chat to ask questions and share your progress</p>
              <div className="mt-2 text-xs text-primary-400 font-semibold">Go to Community →</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
