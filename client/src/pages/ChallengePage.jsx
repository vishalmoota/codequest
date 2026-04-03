import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Editor from '@monaco-editor/react';

// ── Language helpers ──────────────────────────────────────────────────────────
const LANG_META = {
  python: {
    label: 'Python',
    tag: '# Python',
    filename: 'script.py',
    monacoLang: 'python',
    accent: '#4ade80',
    defaultCode: '# Write your Python code here\n\ndef solution():\n    pass\n',
  },
  javascript: {
    label: 'JavaScript',
    tag: '// JavaScript',
    filename: 'script.js',
    monacoLang: 'javascript',
    accent: '#f7df1e',
    defaultCode: '// Write your JavaScript code here\n\nfunction solution() {\n  \n}\n',
  },
  html: {
    label: 'HTML & CSS',
    tag: '<!-- HTML -->',
    filename: 'index.html',
    monacoLang: 'html',
    accent: '#60a5fa',
    defaultCode: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n    <style>\n      /* CSS here */\n    </style>\n  </head>\n  <body>\n    <!-- HTML here -->\n  </body>\n</html>',
  },
};

const getLangMeta = (lang) =>
  LANG_META[lang?.toLowerCase()] || LANG_META.javascript;

// ── Pyodide Python runner ─────────────────────────────────────────────────────
let pyodideInstance = null;
let pyodideLoading = false;
let pyodideCallbacks = [];

const loadPyodide = () =>
  new Promise((resolve, reject) => {
    if (pyodideInstance) return resolve(pyodideInstance);
    pyodideCallbacks.push({ resolve, reject });
    if (pyodideLoading) return;
    pyodideLoading = true;
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
    script.onload = async () => {
      try {
        const py = await window.loadPyodide();
        pyodideInstance = py;
        pyodideCallbacks.forEach((cb) => cb.resolve(py));
        pyodideCallbacks = [];
      } catch (e) {
        pyodideCallbacks.forEach((cb) => cb.reject(e));
        pyodideCallbacks = [];
      }
    };
    script.onerror = (e) => {
      pyodideCallbacks.forEach((cb) => cb.reject(e));
      pyodideCallbacks = [];
    };
    document.head.appendChild(script);
  });

const runPython = async (code) => {
  const py = await loadPyodide();
  py.runPython('import sys, io; sys.stdout = io.StringIO()');
  try {
    py.runPython(code);
    return py.runPython('sys.stdout.getvalue()') || '(no output)';
  } catch (e) {
    throw new Error(e.message);
  }
};

// ── JavaScript runner ─────────────────────────────────────────────────────────
const runJavaScript = (code) => {
  const logs = [];
  const fakeConsole = { log: (...a) => logs.push(a.join(' ')) };
  try {
    // eslint-disable-next-line no-new-func
    new Function('console', code)(fakeConsole);
    return logs.join('\n') || '(no output)';
  } catch (e) {
    throw new Error(e.message);
  }
};

// ── Main Component ────────────────────────────────────────────────────────────
const ChallengePage = () => {
  const { courseId, levelNum, challengeId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const iframeRef = useRef(null);

  // Data state
  const [challenge, setChallenge] = useState(null);
  const [course, setCourse] = useState(null);
  const [allChallenges, setAllChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor state
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  // UI state
  const [hintOpen, setHintOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [theoryOpen, setTheoryOpen] = useState(true);

  // ── Fetch challenge + siblings ──────────────────────────────────────────────
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError(null);
        setSubmitResult(null);
        setOutput('');
        setShowSuccess(false);

        const res = await axios.get(`/challenges/${challengeId}`);
        const ch = res.data;
        setChallenge(ch);

        const initialCode =
          ch.starterCode ||
          getLangMeta(ch.language).defaultCode;
        setCode(initialCode);

        // Fetch course info
        if (ch.courseId) {
          try {
            const courseRes = await axios.get(`/courses/${ch.courseId}`);
            setCourse(courseRes.data);
          } catch (_) {}
        }

        // Fetch sibling challenges for Back/Next
        if (ch.courseId && ch.levelNum) {
          try {
            const siblingsRes = await axios.get(
              `/challenges?courseId=${ch.courseId}&levelNum=${ch.levelNum}`
            );
            const siblings = siblingsRes.data || [];
            setAllChallenges(siblings);
            const idx = siblings.findIndex(
              (c) => (c._id || c) === challengeId || c._id === challengeId
            );
            setCurrentIndex(idx >= 0 ? idx : 0);
          } catch (_) {}
        }

        // Pre-load Pyodide for Python
        if (ch.language === 'python') {
          setPyodideLoading(true);
          loadPyodide()
            .then(() => {
              setPyodideReady(true);
              setPyodideLoading(false);
            })
            .catch(() => setPyodideLoading(false));
        }
      } catch (err) {
        setError('Failed to load challenge. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (challengeId) fetchChallenge();
  }, [challengeId]);

  // ── Run code ────────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput('');
    setSubmitResult(null);

    try {
      const lang = challenge?.language?.toLowerCase() || 'javascript';

      if (lang === 'python') {
        if (!pyodideReady) {
          setOutput('⏳ Python runtime is loading... please wait a moment and try again.');
          setIsRunning(false);
          return;
        }
        const result = await runPython(code);
        setOutput(result);
      } else if (lang === 'html') {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = code;
        }
        setOutput('HTML rendered in preview below.');
      } else {
        const result = runJavaScript(code);
        setOutput(result);
      }
    } catch (e) {
      setOutput(`❌ Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, challenge, pyodideReady]);

  // ── Submit solution ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await axios.post(`/challenges/${challengeId}/submit`, { code });
      const data = res.data;
      setSubmitResult(data);

      // Check success using whatever field the backend returns
      const succeeded =
        data.success || data.allPassed || data.passed;

      if (succeeded) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        // Update streak
        try {
          await axios.put('/gamification/streak');
        } catch (_) {}

        // Check if last challenge in level — trigger level unlock
        try {
          const isLastChallenge =
            currentIndex === allChallenges.length - 1;
          if (
            isLastChallenge &&
            challenge?.courseId &&
            challenge?.levelNum
          ) {
            await axios.post('/gamification/level-up', {
              courseId: challenge.courseId,
              levelNum: challenge.levelNum,
            });
          }
        } catch (_) {}
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message:
          err.response?.data?.message || 'Submission failed.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handleBack = () => {
    // Use URL params if available, fallback to challenge data
    const cId = courseId || challenge?.courseId;
    const lNum = levelNum || challenge?.levelNum;

    if (currentIndex > 0) {
      const prev = allChallenges[currentIndex - 1];
      const prevId = prev._id || prev;
      if (cId && lNum) {
        navigate(`/course/${cId}/level/${lNum}/challenge/${prevId}`);
      } else {
        navigate(-1);
      }
    } else if (course) {
      navigate(`/course/${course._id || challenge?.courseId}`);
    } else {
      navigate(-1);
    }
  };

  const handleNext = async () => {
    // Use URL params if available, fallback to challenge data
    const cId = courseId || challenge?.courseId;
    const lNum = levelNum || challenge?.levelNum;

    // Save progress before navigating
    if (challenge?.courseId && challenge?.levelNum) {
      try {
        await axios.put(`/gamification/course-progress/${challenge.courseId}`, {
          lastAccessedAt: new Date(),
        });
      } catch (_) {
        // Silently fail - still navigate anyway
      }
    }

    if (currentIndex < allChallenges.length - 1) {
      const next = allChallenges[currentIndex + 1];
      const nextId = next._id || next;
      if (cId && lNum) {
        navigate(`/course/${cId}/level/${lNum}/challenge/${nextId}`);
      } else {
        navigate(-1);
      }
    } else {
      // End of level — go back to course page
      if (course) {
        navigate(`/course/${course._id || challenge?.courseId}`);
      } else {
        navigate('/dashboard');
      }
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
  };

  const lang = challenge?.language?.toLowerCase() || 'javascript';
  const langMeta = getLangMeta(lang);
  const totalExercises = allChallenges.length;
  const exerciseNum = currentIndex + 1;

  const progressPct = course
    ? Math.round(((currentIndex) / Math.max(totalExercises, 1)) * 100)
    : 0;

  // ── Loading / Error ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚡</div>
          <p className="text-gray-400 font-mono">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😵</div>
          <p className="text-red-400 font-mono mb-4">
            {error || 'Challenge not found'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-600 text-white rounded font-mono"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* ── TOP NAV BAR ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b 
                   border-white/10 bg-gray-900 flex-shrink-0"
      >
        {/* Left: breadcrumb + progress */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() =>
              course
                ? navigate(`/course/${course._id || challenge.courseId}`)
                : navigate('/dashboard')
            }
            className="text-gray-400 hover:text-white text-sm font-mono 
                       transition whitespace-nowrap"
          >
            ← {course?.title || 'Course'}
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 text-sm font-mono truncate">
            {challenge.title}
          </span>

          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <div className="w-32 bg-gray-700 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: langMeta.accent,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 font-mono">
              {progressPct}%
            </span>
          </div>
        </div>

        {/* Right: status indicators */}
        <div className="flex items-center gap-3">
          {lang === 'python' && (
            <span className="text-xs font-mono px-2 py-1 rounded"
                  style={{
                    backgroundColor: pyodideReady
                      ? 'rgba(74,222,128,0.15)'
                      : 'rgba(251,191,36,0.15)',
                    color: pyodideReady ? '#4ade80' : '#fbbf24',
                  }}>
              {pyodideReady
                ? '● Python Ready'
                : pyodideLoading
                ? '⏳ Loading Python...'
                : '● Python'}
            </span>
          )}
          <span
            className="text-xs font-mono px-2 py-1 rounded"
            style={{
              backgroundColor: `${langMeta.accent}20`,
              color: langMeta.accent,
            }}
          >
            {langMeta.label}
          </span>
        </div>
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">

        {/* ══ LEFT PANEL — Theory & Instructions ══ */}
        <div
          className="w-full lg:w-2/5 flex flex-col border-r border-white/10 
                     overflow-hidden flex-shrink-0 lg:max-h-full max-h-[40vh]"
          style={{ minWidth: 'auto', maxWidth: 'none' }}
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">

              {/* Exercise number + title */}
              <div className="mb-1">
                <span
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: langMeta.accent }}
                >
                  Exercise {exerciseNum} / {totalExercises}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-mono mb-1">
                {String(exerciseNum).padStart(2, '0')}. {challenge.title}
              </h1>
              <div
                className="text-sm font-mono mb-5 opacity-60"
                style={{ color: langMeta.accent }}
              >
                {langMeta.tag}
              </div>

              {/* Theory content */}
              {challenge.theoryContent && (
                <div className="mb-5">
                  <button
                    onClick={() => setTheoryOpen((p) => !p)}
                    className="flex items-center gap-2 text-sm font-mono 
                               text-gray-400 hover:text-white mb-2 transition"
                  >
                    <span>{theoryOpen ? '▼' : '▶'}</span>
                    <span>Theory</span>
                  </button>
                  {theoryOpen && (
                    <div
                      className="rounded-lg p-4 text-sm leading-relaxed 
                                 text-gray-300 whitespace-pre-wrap font-mono"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                    >
                      {challenge.theoryContent}
                    </div>
                  )}
                </div>
              )}

              {/* Description / problem statement */}
              {challenge.description && (
                <div className="mb-5">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {challenge.description}
                  </p>
                </div>
              )}

              {/* Instructions */}
              {challenge.instructions && (
                <div className="mb-5">
                  <h3
                    className="text-xs font-mono uppercase tracking-widest 
                               mb-3 font-bold"
                    style={{ color: langMeta.accent }}
                  >
                    Instructions
                  </h3>
                  <div
                    className="rounded-lg p-4 text-sm leading-relaxed 
                               text-gray-200 whitespace-pre-wrap border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderColor: `${langMeta.accent}30`,
                    }}
                  >
                    {challenge.instructions}
                  </div>
                </div>
              )}

              {/* Expected output */}
              {challenge.expectedOutput && (
                <div className="mb-5">
                  <h3
                    className="text-xs font-mono uppercase tracking-widest 
                               mb-2 font-bold"
                    style={{ color: langMeta.accent }}
                  >
                    Expected Output
                  </h3>
                  <div
                    className="rounded-lg px-4 py-3 font-mono text-sm 
                               text-green-300 border border-green-900/40"
                    style={{ backgroundColor: 'rgba(74,222,128,0.05)' }}
                  >
                    {challenge.expectedOutput}
                  </div>
                </div>
              )}

              {/* Test cases */}
              {challenge.testCases?.length > 0 && (
                <div className="mb-5">
                  <h3
                    className="text-xs font-mono uppercase tracking-widest 
                               mb-2 font-bold text-gray-400"
                  >
                    Test Cases
                  </h3>
                  <div className="space-y-2">
                    {challenge.testCases.map((tc, i) => (
                      <div
                        key={i}
                        className="rounded-lg px-4 py-2 font-mono text-xs 
                                   border border-white/8"
                        style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      >
                        <span className="text-gray-500">
                          {tc.description || `Test ${i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit result feedback */}
              {submitResult && (
                <div
                  className={`rounded-lg p-4 mb-4 text-sm font-mono border ${
                    submitResult.success || submitResult.allPassed || submitResult.passed
                      ? 'border-green-600/40 text-green-300'
                      : 'border-red-600/40 text-red-300'
                  }`}
                  style={{
                    backgroundColor:
                      submitResult.success || submitResult.allPassed || submitResult.passed
                        ? 'rgba(74,222,128,0.08)'
                        : 'rgba(239,68,68,0.08)',
                  }}
                >
                  <p className="font-bold mb-1">
                    {submitResult.success || submitResult.allPassed || submitResult.passed
                      ? '✅ All tests passed!'
                      : '❌ Some tests failed'}
                  </p>
                  {submitResult.message && (
                    <p className="text-xs opacity-80">{submitResult.message}</p>
                  )}
                  {submitResult.xpAwarded > 0 && (
                    <p className="text-yellow-400 mt-1">
                      +{submitResult.xpAwarded} XP earned! ⚡
                    </p>
                  )}
                </div>
              )}

              {/* Hint */}
              <div className="mb-4">
                <button
                  onClick={() => setHintOpen((p) => !p)}
                  className="flex items-center gap-2 text-sm font-mono 
                             text-gray-500 hover:text-gray-300 transition w-full 
                             py-2 border-t border-white/8"
                >
                  <span>💡</span>
                  <span>Hint</span>
                  <span className="ml-auto">{hintOpen ? '∧' : '∨'}</span>
                </button>
                {hintOpen && (
                  <div
                    className="mt-2 rounded-lg p-3 text-sm text-gray-400 
                               font-mono"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                  >
                    {challenge.hint ||
                      'Try breaking the problem into smaller steps. ' +
                      'Read the theory section again if stuck.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div
            className="flex items-center justify-between px-4 py-3 
                       border-t border-white/10 bg-gray-900 flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono truncate 
                               max-w-24">
                {challenge.title}
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded font-bold"
                style={{
                  backgroundColor: `${langMeta.accent}20`,
                  color: langMeta.accent,
                }}
              >
                ⚡ {challenge.xpReward || 10} XP
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="px-4 py-1.5 text-sm font-mono font-bold rounded-lg
                           border border-white/20 hover:bg-white/10 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-1.5 text-sm font-mono font-bold rounded-lg
                           text-black transition hover:opacity-90"
                style={{ backgroundColor: langMeta.accent }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL — Editor & Output ══ */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* File tab bar */}
          <div
            className="flex items-center gap-0 border-b border-white/10 
                       bg-gray-900 px-4 flex-shrink-0"
          >
            <div
              className="flex items-center gap-2 px-4 py-2 text-sm 
                         font-mono border-b-2"
              style={{ borderColor: langMeta.accent, color: langMeta.accent }}
            >
              <span>📄</span>
              <span>{langMeta.filename}</span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={langMeta.monacoLang}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                tabSize: 2,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                cursorBlinking: 'smooth',
              }}
            />
          </div>

          {/* Action toolbar */}
          <div
            className="flex items-center justify-between px-4 py-2 
                       border-t border-white/10 bg-gray-900 flex-shrink-0"
          >
            {/* Left: copy button */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                title="Copy code"
                className="p-2 rounded text-gray-500 hover:text-gray-300 
                           hover:bg-white/10 transition text-sm"
              >
                📋
              </button>
            </div>

            {/* Right: Run + Submit */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 text-sm 
                           font-mono font-bold rounded-lg border 
                           border-white/20 hover:bg-white/10 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>⏳ Running...</>
                ) : (
                  <>▶ Run</>
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !user}
                className="flex items-center gap-2 px-4 py-1.5 text-sm 
                           font-mono font-bold rounded-lg text-black 
                           transition hover:opacity-90
                           disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: langMeta.accent }}
                title={!user ? 'Login to submit' : ''}
              >
                {isSubmitting ? '⏳ Submitting...' : '✓ Submit answer'}
              </button>
            </div>
          </div>

          {/* ── Terminal / Output / Preview ── */}
          <div
            className="flex-shrink-0 border-t border-white/10"
            style={{ height: '200px' }}
          >
            {lang === 'html' ? (
              <div className="h-full flex flex-col">
                <div
                  className="px-3 py-1.5 text-xs font-mono text-gray-500 
                             border-b border-white/10 bg-gray-900 flex-shrink-0"
                >
                  Preview
                </div>
                <iframe
                  ref={iframeRef}
                  className="flex-1 w-full bg-white"
                  title="HTML Preview"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <div className="h-full flex flex-col bg-gray-900">
                <div
                  className="px-3 py-1.5 text-xs font-mono text-gray-500 
                             border-b border-white/10 flex-shrink-0"
                >
                  Terminal
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  {output ? (
                    <pre
                      className="font-mono text-sm whitespace-pre-wrap"
                      style={{
                        color: output.startsWith('❌')
                          ? '#f87171'
                          : '#86efac',
                      }}
                    >
                      {output}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center 
                                    justify-center text-gray-600">
                      <span className="text-3xl mb-2">⟨/⟩</span>
                      <span className="text-xs font-mono">
                        Click Run to view your results
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Success overlay ── */}
      {showSuccess && (
        <div
          className="fixed inset-0 flex items-center justify-center 
                     pointer-events-none z-50"
        >
          <div
            className="rounded-2xl px-10 py-8 text-center shadow-2xl 
                       pointer-events-auto"
            style={{ backgroundColor: '#0d1117', border: '2px solid #4ade80' }}
          >
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold font-mono text-green-400 mb-1">
              Challenge Complete!
            </h2>
            <div className="space-y-2 mb-4">
              <p className="text-gray-400 font-mono text-sm">
                +{(submitResult?.xpEarned || challenge?.xpReward || 10)} XP earned
              </p>
              {submitResult?.levelBonus > 0 && (
                <p className="text-cyan-400 font-mono text-sm">
                  +{submitResult.levelBonus} Level Completion Bonus!
                </p>
              )}
              {submitResult?.levelUnlocked && (
                <p className="text-yellow-400 font-mono text-sm animate-pulse">
                  🔓 Level {submitResult.levelUnlocked} Unlocked!
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setShowSuccess(false);
                handleNext();
              }}
              className="px-6 py-2 bg-green-500 text-black font-bold 
                         font-mono rounded-lg hover:bg-green-400 transition"
            >
              Next Exercise →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
