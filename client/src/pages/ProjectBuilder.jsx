import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ArrowLeft, CheckCircle2, Download, Expand, Lightbulb, Minimize2, Play, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PROJECT_TUTORIALS from '../data/projectTutorials';

const getEditorLanguage = (language) => {
  if (language === 'python') return 'python';
  if (language === 'html' || language === 'html-css') return 'html';
  return 'javascript';
};

const isStepValid = (step, code, runResult = {}) => {
  const validation = step.validation || [];
  if (validation.length > 0) {
    return validation.every((token) => code.includes(token));
  }

  const expectedOutput = (step.expectedOutput || '').trim();
  if (!expectedOutput) {
    return true;
  }

  const outputText = `${runResult.stdout || ''}\n${runResult.stderr || ''}`.trim();
  return outputText.includes(expectedOutput);
};

const formatConsoleOutput = (value) => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const normalizeStepCodes = (rawStepCodes = {}) => {
  if (rawStepCodes instanceof Map) {
    return Object.fromEntries(rawStepCodes.entries());
  }
  return rawStepCodes || {};
};

const getSavedStepIndex = (progress = {}, totalSteps = 0) => {
  const savedIndex = Number.isFinite(progress.lastAccessedStep) ? progress.lastAccessedStep : null;
  if (savedIndex !== null) {
    return Math.max(0, Math.min(savedIndex, Math.max(totalSteps - 1, 0)));
  }

  const savedCodes = normalizeStepCodes(progress.stepCodes);
  const completed = Array.isArray(progress.completedSteps) ? progress.completedSteps : [];
  const numericStepIndexes = [
    ...Object.keys(savedCodes).map(Number),
    ...completed,
  ].filter((value) => Number.isFinite(value));

  if (numericStepIndexes.length === 0) {
    return 0;
  }

  return Math.max(0, Math.min(Math.max(...numericStepIndexes), Math.max(totalSteps - 1, 0)));
};

const buildPreviewSrcDoc = (html) => {
  if (!html) return '';

  const bridge = `
    <script>
      document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href^="#"]');
        if (anchor) {
          const targetId = anchor.getAttribute('href').slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          event.stopPropagation();
        }
      }, true);

      document.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
      }, true);
    </script>
  `;

  if (html.includes('</body>')) {
    return html.replace('</body>', `${bridge}</body>`);
  }

  return `${html}${bridge}`;
};

const ProjectBuilder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const previewRef = useRef(null);
  const draftSaveTimerRef = useRef(null);
  const lastSavedDraftRef = useRef('');
  const buildMode = useMemo(() => new URLSearchParams(location.search).get('mode') || 'continue', [location.search]);

  const project = useMemo(
    () => PROJECT_TUTORIALS.find((item) => item.id === id),
    [id]
  );

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState('');
  const [stepCodes, setStepCodes] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [runOutput, setRunOutput] = useState('');
  const [runError, setRunError] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [xpToast, setXpToast] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [projectXpEarned, setProjectXpEarned] = useState(0);

  const totalSteps = project?.steps?.length || 0;
  const currentStepData = project?.steps?.[currentStep];
  const monacoLanguage = getEditorLanguage(project?.language);

  useEffect(() => {
    if (!project || !user) {
      setLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const response = await api.get(`/project-progress/${project.id}`);
        const progress = response.data || {};
        const savedCodes = normalizeStepCodes(progress.stepCodes);
        const completed = Array.isArray(progress.completedSteps) ? progress.completedSteps : [];

        setStepCodes(savedCodes);
        setCompletedSteps(completed);

        const firstIncomplete = project.steps.findIndex((step) => !completed.includes(step.index));
        const resumeStep = buildMode === 'start'
          ? 0
          : (Number.isFinite(progress.lastAccessedStep)
            ? getSavedStepIndex(progress, project.steps.length)
            : (firstIncomplete >= 0 ? firstIncomplete : Math.max(project.steps.length - 1, 0)));
        const startStep = Math.max(0, Math.min(resumeStep, Math.max(project.steps.length - 1, 0)));
        setCurrentStep(startStep);
      } catch {
        setCurrentStep(0);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [buildMode, project, user]);

  useEffect(() => {
    if (!currentStepData) return;
    const savedCode = buildMode === 'start'
      ? currentStepData.starterCode || ''
      : stepCodes[String(currentStepData.index)] || currentStepData.starterCode || '';
    setCode(savedCode);
    setPreviewHtml(project?.language === 'html' ? savedCode : '');
    setRunOutput('');
    setRunError('');
    setValidationMessage('');
    setShowHint(false);
  }, [buildMode, currentStep, currentStepData, project, stepCodes]);

  useEffect(() => {
    if (buildMode !== 'start' && completedSteps.length > 0 && completedSteps.length === totalSteps) {
      setShowComplete(true);
    }
  }, [buildMode, completedSteps, totalSteps]);

  const saveDraftProgress = useCallback(
    async (draftCode) => {
      if (!project || !currentStepData || !user) return null;

      const draftKey = `${currentStepData.index}:${draftCode}`;
      if (!draftCode.trim()) return null;
      if (draftCode === currentStepData.starterCode && !stepCodes[String(currentStepData.index)] && completedSteps.length === 0) {
        return null;
      }
      if (lastSavedDraftRef.current === draftKey) {
        return null;
      }

      const token = localStorage.getItem('cq_token');
      if (!token) return null;

      const response = await fetch(`http://localhost:5000/api/project-progress/${project.id}/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stepIndex: currentStepData.index,
          code: draftCode,
        }),
        keepalive: true,
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      const savedCodes = normalizeStepCodes(payload.progress?.stepCodes);
      const completed = Array.isArray(payload.progress?.completedSteps) ? payload.progress.completedSteps : [];

      lastSavedDraftRef.current = draftKey;
      setStepCodes(savedCodes);
      setCompletedSteps(completed);

      return payload.progress;
    },
    [completedSteps.length, currentStepData, project, stepCodes, user]
  );

  useEffect(() => {
    if (!project || !currentStepData || !user) return undefined;

    if (draftSaveTimerRef.current) {
      window.clearTimeout(draftSaveTimerRef.current);
    }

    draftSaveTimerRef.current = window.setTimeout(() => {
      saveDraftProgress(code).catch(() => {});
    }, 700);

    return () => {
      if (draftSaveTimerRef.current) {
        window.clearTimeout(draftSaveTimerRef.current);
      }
    };
  }, [code, currentStepData, project, saveDraftProgress, user]);

  useEffect(() => {
    if (!project || !currentStepData || !user) return undefined;

    const handleBeforeUnload = () => {
      saveDraftProgress(code).catch(() => {});
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [code, currentStepData, project, saveDraftProgress, user]);

  const saveStepProgress = useCallback(
    async (stepCode, runResult) => {
      if (!project || !currentStepData) return;

      const response = await api.post(`/project-progress/${project.id}/step`, {
        stepIndex: currentStepData.index,
        code: stepCode,
        stepXp: currentStepData.xp,
        totalSteps,
        projectMeta: {
          id: project.id,
          title: project.title,
          description: project.description,
          language: project.language,
          difficulty: project.difficulty,
          duration: project.duration,
          tags: project.tags,
          totalXp: project.totalXp,
        },
      });

      const xpAwarded = response.data?.xpAwarded || 0;
      const progress = response.data?.progress || {};
      const savedCodes = normalizeStepCodes(progress.stepCodes);
      const completed = Array.isArray(progress.completedSteps) ? progress.completedSteps : [];
      const totalXpEarned = progress.totalXpEarned || 0;

      setStepCodes(savedCodes);
      setCompletedSteps(completed);
      setProjectXpEarned(totalXpEarned);

      if (completed.length === totalSteps) {
        setShowComplete(true);
        setPreviewExpanded(false);
      } else if (currentStep < totalSteps - 1) {
        window.setTimeout(() => setCurrentStep((value) => Math.min(value + 1, totalSteps - 1)), 450);
      }

      if (xpAwarded > 0) {
        setXpToast(`+${xpAwarded} XP earned!`);
        window.setTimeout(() => setXpToast(''), 2200);
      }

      setPreviewHtml(project?.language === 'html' ? stepCode : previewHtml);

      return runResult;
    },
    [currentStep, currentStepData, previewHtml, project, totalSteps]
  );

  const handleRun = useCallback(async () => {
    if (!project || !currentStepData || !code.trim()) return;

    setRunning(true);
    setRunError('');
    setRunOutput('');
    setValidationMessage('');

    try {
      const response = await api.post('/run-code', {
        code,
        language: project.language,
      });

      const stdout = formatConsoleOutput(response.data?.stdout || '');
      const stderr = formatConsoleOutput(response.data?.stderr || '');

      if (project.language === 'html' && previewRef.current) {
        setPreviewHtml(code);
      }

      setRunOutput(stdout || (project.language === 'html' ? 'Preview updated in the iframe below.' : '(no output)'));
      setRunError(stderr);

      const runResult = { stdout, stderr };
      const valid = isStepValid(currentStepData, code, runResult);

      if (valid) {
        await saveStepProgress(code, runResult);
        if (currentStep === totalSteps - 1) {
          setShowComplete(true);
          setPreviewExpanded(false);
          setProjectXpEarned(project.totalXp);
        }
      } else {
        setValidationMessage(
          currentStepData.expectedOutput
            ? `Expected completion: ${currentStepData.expectedOutput}`
            : 'This step is not complete yet. Check the hint and try again.'
        );
        setShowHint(true);
      }
    } catch (runError) {
      const message = runError?.response?.data?.stderr || runError?.response?.data?.message || runError.message || 'Run failed';
      setRunError(message);
      setShowHint(true);
    } finally {
      setRunning(false);
    }
  }, [code, currentStepData, project, saveStepProgress]);

  const handleDownload = useCallback(async () => {
    if (!project) return;

    setDownloading(true);
    try {
      const response = await api.get(`/project-progress/${project.id}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${project.id}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error('Download failed', downloadError);
    } finally {
      setDownloading(false);
    }
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">⚙️</div>
          <p className="text-gray-400 font-mono">Loading project builder...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-400 font-mono">Project not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white font-mono"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {previewExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
          <div className="flex items-center justify-between border-b border-white/10 bg-gray-900 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Preview</p>
              <h2 className="text-lg font-bold">{project.title}</h2>
            </div>
            <button
              onClick={() => setPreviewExpanded(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-200 transition hover:border-violet-500/40 hover:bg-violet-500/10"
            >
              <Minimize2 size={14} /> Minimize Preview
            </button>
          </div>
          <div className="flex-1 overflow-hidden bg-white">
            {project.language === 'html' ? (
                <iframe
                title="Project preview"
                className="h-full w-full bg-white"
                sandbox="allow-scripts allow-same-origin"
                  srcDoc={buildPreviewSrcDoc(previewHtml || currentStepData?.starterCode || '')}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-gray-500 px-4">
                Preview is available for HTML projects.
              </div>
            )}
          </div>
        </div>
      )}

      {showComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-gray-900 p-8 text-center shadow-2xl">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="mb-2 text-3xl font-black">Project Built Successfully</h2>
            <p className="mb-2 text-sm text-gray-400">You finished {project.title} successfully.</p>
            <p className="mb-6 text-sm text-emerald-300 font-semibold">Total XP earned in this project: {projectXpEarned || project.totalXp} XP</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 rounded-xl border border-emerald-500/40 px-4 py-3 font-bold text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-50"
              >
                {downloading ? 'Preparing ZIP...' : 'Download Project'}
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-bold text-black transition hover:bg-emerald-400"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-white/10 bg-gray-900/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/projects/${project.id}`)}
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span className="text-gray-600">/</span>
            <span className="font-mono text-sm font-bold">{project.title}</span>
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] font-bold text-violet-200">
              {project.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
              <Zap size={12} className="inline-block" /> {project.totalXp} XP total
            </span>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-200 transition hover:border-violet-500/40 hover:bg-violet-500/10"
            >
              <Download size={14} /> Download Project
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row">
        <aside className="lg:sticky lg:top-0 lg:h-[calc(100vh-64px)] lg:w-[40%] border-r border-white/10 bg-gray-900/60 overflow-y-auto">
          <div className="p-5">
            <div className="mb-4 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-5">
              <h1 className="text-2xl font-black leading-tight">{project.title}</h1>
              <p className="mt-2 text-sm text-gray-300">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">Steps</h2>
              <span className="text-xs text-gray-400">
                {completedSteps.length}/{totalSteps} complete
              </span>
            </div>

            <div className="space-y-3">
              {project.steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.index);
                const isActive = currentStep === index;
                const isUnlocked = index === 0 || completedSteps.includes(step.index) || completedSteps.includes(project.steps[index - 1]?.index);

                return (
                  <button
                    key={step.index}
                    onClick={() => isUnlocked && setCurrentStep(index)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${isActive ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20'} ${!isUnlocked ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-black ${isCompleted ? 'border-emerald-500/40 bg-emerald-500 text-black' : 'border-white/10 bg-white/5 text-gray-300'}`}>
                        {isCompleted ? <CheckCircle2 size={14} /> : index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="truncate font-bold text-white">{step.title}</h3>
                          <span className="text-xs text-emerald-300">+{step.xp} XP</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.theory}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setCurrentStep(index);
                                setShowHint(true);
                              }}
                              className="inline-flex items-center gap-1 text-violet-300 transition hover:text-violet-200"
                            >
                              <Lightbulb size={12} /> Show Hint
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setCurrentStep(index);
                              }}
                              className="text-gray-500 transition hover:text-white"
                            >
                              Open step
                            </button>
                          </div>
                          <span>Step {index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
              <div className="mb-2 flex items-center gap-2 text-emerald-300">
                <Trophy size={14} /> XP Protection
              </div>
              Completing the same step twice will not award XP again.
            </div>
          </div>
        </aside>

        <section className="flex-1 min-w-0 bg-gray-950">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 bg-gray-900 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Current Step</p>
                  <h2 className="text-lg font-bold">Step {currentStep + 1}: {currentStepData?.title}</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> {project.language.toUpperCase()} editor
                </div>
              </div>
            </div>

            {xpToast && (
              <div className="mx-4 mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-200">
                ⚡ {xpToast}
              </div>
            )}

            {currentStepData?.syntax && (
              <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Syntax</div>
                <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-gray-950 p-4 text-sm leading-relaxed text-gray-200">
                  {currentStepData.syntax}
                </pre>
              </div>
            )}

            <div className="grid flex-1 min-h-0 grid-rows-[minmax(320px,1fr)_180px] lg:grid-rows-[minmax(0,1fr)_200px]">
              <div className="min-h-0">
                <Editor
                  height="100%"
                  language={monacoLanguage}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>

              <div className="grid border-t border-white/10 bg-gray-900 lg:grid-cols-2">
                <div className="flex flex-col border-b border-white/10 lg:border-b-0 lg:border-r border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-500">
                    <span>Output</span>
                    <button
                      onClick={handleRun}
                      disabled={running}
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-500 disabled:opacity-50"
                    >
                      <Play size={12} /> {running ? 'Running...' : 'Run Code'}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {runOutput ? (
                      <pre className="whitespace-pre-wrap rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                        {runOutput}
                      </pre>
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
                        Run your code to see output here.
                      </div>
                    )}

                    {runError && (
                      <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                        {runError}
                      </div>
                    )}

                    {validationMessage && (
                      <div className="mt-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-sm text-yellow-100">
                        {validationMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-500">
                    <span>Preview</span>
                    <button
                      onClick={() => setPreviewExpanded(true)}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-gray-200 transition hover:border-violet-500/40 hover:bg-violet-500/10"
                    >
                      <Expand size={12} /> Maximize
                    </button>
                  </div>
                  {project.language === 'html' ? (
                    <iframe
                      title="Project preview"
                      className="h-full w-full bg-white"
                      sandbox="allow-scripts allow-same-origin"
                      srcDoc={buildPreviewSrcDoc(previewHtml || currentStepData?.starterCode || '')}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-sm text-gray-500 px-4">
                      Preview is available for HTML projects.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showHint && currentStepData?.hint && (
              <div className="border-t border-white/10 bg-gray-900 px-4 py-4">
                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-100">
                  <div className="mb-2 font-bold text-yellow-300">Hint</div>
                  {currentStepData.hint}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectBuilder;
