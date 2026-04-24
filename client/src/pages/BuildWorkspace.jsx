import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CodeEditor from '../components/CodeEditor';
import { Lightbulb, CheckCircle2, ArrowLeft, ChevronRight, BookOpen, EyeOff, Loader2 } from 'lucide-react';

const LANG_COLORS = {
  javascript: '#fbbf24', python: '#3b82f6', html: '#f97316',
  css: '#06b6d4', bash: '#10b981', jsx: '#67e8f9',
};

/* ── Left Panel Step Card ──────────────────────────────────────────────── */
const StepPanel = ({ step, index, total }) => {
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      done ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-dark-400/40 bg-dark-700/40'
    }`}>
      <div className="flex items-start gap-3">
        <button onClick={() => setDone(d => !d)}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            done ? 'bg-emerald-500 border-emerald-400' : 'border-dark-400/60 hover:border-primary-500'
          }`}>
          {done
            ? <CheckCircle2 size={14} className="text-white" />
            : <span className="text-[10px] font-bold text-slate-500">{index + 1}</span>
          }
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-slate-600 font-mono">Step {index + 1}/{total}</span>
            {step.language && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                style={{ background: `${LANG_COLORS[step.language]}20`, color: LANG_COLORS[step.language] }}>
                {step.language}
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-slate-100 mb-2">{step.title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{step.explanation}</p>

          {step.hint && (
            <div className="mt-3">
              <button onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-1.5 text-[11px] text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                <Lightbulb size={11} />
                {showHint ? 'Hide Hint' : 'Show Hint'}
                {!showHint && <EyeOff size={10} />}
              </button>
              {showHint && (
                <div className="mt-2 p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-300 leading-relaxed">
                  💡 {step.hint}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Build Workspace Page ──────────────────────────────────────────────── */
const BuildWorkspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leftTab, setLeftTab] = useState('steps'); // 'steps' | 'theory'
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get(`/projects/${id}`);
        setProject(r.data);
      } catch {
        setError('Could not load project. Please go back and try again.');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary-400" />
    </div>
  );

  if (error || !project) return (
    <div className="h-screen flex items-center justify-center flex-col gap-3">
      <div className="text-4xl">🔍</div>
      <p className="text-slate-400">{error || 'Project not found'}</p>
      <Link to="/projects" className="text-primary-400 hover:underline text-sm">← Back to Projects</Link>
    </div>
  );

  const steps = project.steps || [];
  const currentStep = steps[activeStep];
  const starterCode = currentStep?.code || `// ${project.title}\n// Start coding here!\n\nconsole.log("Hello, World!");`;
  const language = currentStep?.language || 'javascript';

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 overflow-x-hidden lg:h-screen lg:overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-dark-400/20 bg-dark-800/80
                      backdrop-blur-md flex-shrink-0">
        <Link to={`/projects/${id}`}
          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm">
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xl">{project.emoji}</span>
          <span className="font-bold text-slate-200 text-sm truncate">{project.title}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden sm:flex ${
            project.difficulty === 'Beginner' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
            : project.difficulty === 'Intermediate' ? 'bg-blue-500/15 text-blue-300 border-blue-500/20'
            : 'bg-red-500/15 text-red-300 border-red-500/20'
          }`}>{project.difficulty}</span>
        </div>

        {/* Step navigator */}
        <div className="ml-auto flex items-center gap-2">
          {steps.length > 0 && (
            <div className="flex items-center gap-1">
              {steps.map((_, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeStep ? 'bg-primary-400 scale-125' : 'bg-dark-400/60 hover:bg-dark-300/60'
                  }`} />
              ))}
            </div>
          )}
          <span className="text-[11px] text-slate-500 font-mono ml-2">
            {activeStep + 1}/{Math.max(steps.length, 1)}
          </span>
        </div>
      </div>

      {/* Main two-panel layout */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* ─── LEFT PANEL ─ Steps + Theory ─────────────────────────────── */}
        <div className="w-full lg:w-[380px] xl:w-[420px] lg:flex-shrink-0 border-r border-dark-400/20
                        flex flex-col bg-dark-800/60 min-h-0">
          {/* Tab bar */}
          <div className="flex border-b border-dark-400/20 flex-shrink-0">
            {[['steps', '📋 Steps'], ['theory', '📚 Theory']].map(([tab, label]) => (
              <button key={tab} onClick={() => setLeftTab(tab)}
                className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                  leftTab === tab
                    ? 'border-primary-500 text-primary-300'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {leftTab === 'steps' && (
              <>
                <p className="text-[11px] text-slate-600 mb-2">
                  Click each step to navigate. Check the circle to mark complete.
                </p>
                {steps.length > 0 ? steps.map((step, i) => (
                  <div key={i} className="cursor-pointer" onClick={() => setActiveStep(i)}>
                    <div className={`transition-all ${i !== activeStep ? 'opacity-70 hover:opacity-100' : ''}`}>
                      <StepPanel step={step} index={i} total={steps.length} />
                    </div>
                    {i === activeStep && i < steps.length - 1 && (
                      <button onClick={(e) => { e.stopPropagation(); setActiveStep(i + 1); }}
                        className="flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300
                                   font-semibold ml-10 mt-2 transition-colors">
                        Next Step <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                )) : (
                  <p className="text-slate-600 text-xs text-center py-8">No steps yet for this project.</p>
                )}
              </>
            )}

            {leftTab === 'theory' && (
              <div>
                {project.whatYoullLearn?.length > 0 && (
                  <div className="mb-5 p-4 rounded-xl bg-primary-500/8 border border-primary-500/20">
                    <h4 className="text-xs font-bold text-primary-300 mb-2 flex items-center gap-1.5">
                      <BookOpen size={12} /> What You'll Learn
                    </h4>
                    <ul className="space-y-1.5">
                      {project.whatYoullLearn.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 size={11} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.theory ? (
                  <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                    {project.theory.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-slate-100 mt-4 mb-2">{line.slice(3)}</h2>;
                      if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-slate-200 mt-3 mb-1">{line.slice(4)}</h3>;
                      if (line.startsWith('- ')) return <p key={i} className="ml-2">• {line.slice(2)}</p>;
                      if (line.trim() === '') return <div key={i} className="h-2" />;
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                ) : (
                  <p className="text-slate-600 text-xs text-center py-8">Theory content coming soon!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANEL ─ Monaco Editor ──────────────────────────────── */}
        <div className="flex-1 min-w-0 min-h-[60vh] lg:min-h-0">
          <CodeEditor
            key={`${id}-step-${activeStep}`}
            defaultCode={starterCode}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default BuildWorkspace;
