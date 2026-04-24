import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Editor from '@monaco-editor/react';

// ── Pyodide singleton ─────────────────────────────────────────
let _pyodideInstance = null;
let _pyodideLoadPromise = null;

const loadPyodide = () => {
  if (_pyodideInstance) return Promise.resolve(_pyodideInstance);
  if (_pyodideLoadPromise) return _pyodideLoadPromise;
  _pyodideLoadPromise = new Promise((resolve, reject) => {
    if (window.pyodide) {
      _pyodideInstance = window.pyodide;
      return resolve(_pyodideInstance);
    }
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
    script.onload = async () => {
      try {
        const py = await window.loadPyodide({
          indexURL:
            'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
        });
        _pyodideInstance = py;
        window.pyodide = py;
        resolve(py);
      } catch (e) {
        _pyodideLoadPromise = null;
        reject(e);
      }
    };
    script.onerror = () => {
      _pyodideLoadPromise = null;
      reject(new Error('Failed to load Pyodide'));
    };
    document.head.appendChild(script);
  });
  return _pyodideLoadPromise;
};

const runPythonCode = async (code) => {
  const py = await loadPyodide();
  py.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
  try {
    py.runPython(code);
    const out = py.runPython('sys.stdout.getvalue()');
    return { output: out || '(no output)', error: null };
  } catch (e) {
    const msg = (e.message || String(e))
      .split('\n').filter(l => l.trim()).pop() || String(e);
    return { output: null, error: msg };
  }
};

const runJavaScriptCode = (code) => {
  const logs = [];
  const fakeConsole = {
    log: (...a) => logs.push(
      a.map(x =>
        typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)
      ).join(' ')
    ),
    error: (...a) => logs.push('ERROR: ' + a.join(' ')),
    warn: (...a) => logs.push('WARN: ' + a.join(' ')),
    info: (...a) => logs.push('INFO: ' + a.join(' ')),
  };
  try {
    // eslint-disable-next-line no-new-func
    new Function('console', code)(fakeConsole);
    return { 
      output: logs.join('\n') || '(no output)', 
      error: null 
    };
  } catch (e) {
    return { output: null, error: e.message };
  }
};

// ── Error hint generator ──────────────────────────────────────
const getErrorHints = (error, language) => {
  if (!error) return [];
  const err = error.toLowerCase();
  const hints = [];

  if (language === 'python') {
    if (err.includes('syntaxerror') || err.includes('invalid syntax')) {
      hints.push('Check for missing colons (:) after if, for, while, def, class statements');
      hints.push('Make sure your indentation is consistent — use 4 spaces');
      hints.push('Check for unclosed parentheses, brackets, or quotes');
    }
    if (err.includes('nameerror') || err.includes('not defined')) {
      hints.push('You are using a variable that has not been defined yet');
      hints.push('Check for typos in variable or function names');
      hints.push('Make sure you defined the variable before using it');
    }
    if (err.includes('typeerror')) {
      hints.push('You are using a wrong data type for an operation');
      hints.push('Check if you are trying to do math with strings');
      hints.push('Use int(), float(), or str() to convert between types');
    }
    if (err.includes('indentationerror')) {
      hints.push('Your indentation is wrong — Python requires consistent spacing');
      hints.push('Use exactly 4 spaces for each indentation level');
      hints.push('Do not mix tabs and spaces');
    }
    if (err.includes('indexerror')) {
      hints.push('You are trying to access a list index that does not exist');
      hints.push('Check that your index is less than len(list)');
      hints.push('Remember Python lists start at index 0');
    }
    if (err.includes('keyerror')) {
      hints.push('You are trying to access a dictionary key that does not exist');
      hints.push('Use dict.get(key) instead of dict[key] for safe access');
      hints.push('Check the key exists with: if key in dict');
    }
    if (err.includes('zerodivisionerror')) {
      hints.push('You are dividing by zero');
      hints.push('Add a check: if denominator != 0 before dividing');
    }
    if (err.includes('missing ) after argument list')) {
      hints.push('This error means Python code is being run as JavaScript');
      hints.push('Make sure the language is set to Python correctly');
    }
    if (hints.length === 0) {
      hints.push('Read the error message carefully — it tells you the line number');
      hints.push('Try adding print() statements to debug your code step by step');
      hints.push('Check Python documentation at docs.python.org');
    }
  } else {
    if (err.includes('syntaxerror') || err.includes('unexpected token')) {
      hints.push('Check for missing semicolons, brackets, or parentheses');
      hints.push('Look for unclosed strings — make sure quotes match');
      hints.push('Check for missing closing braces } in your code');
    }
    if (err.includes('referenceerror') || err.includes('not defined')) {
      hints.push('You are using a variable that has not been declared');
      hints.push('Use const or let to declare variables before using them');
      hints.push('Check for typos in variable or function names');
    }
    if (err.includes('typeerror')) {
      hints.push('You are calling something that is not a function, or wrong type');
      hints.push('Check that the variable you are calling is actually a function');
      hints.push('Use typeof to check what type a variable is');
    }
    if (err.includes('rangeerror')) {
      hints.push('You have an infinite loop or too much recursion');
      hints.push('Check your loop condition — make sure it will eventually be false');
      hints.push('Check your recursive function has a base case');
    }
    if (hints.length === 0) {
      hints.push('Open browser DevTools (F12) for more detailed error info');
      hints.push('Try console.log() to print values and debug step by step');
      hints.push('Check MDN Web Docs at developer.mozilla.org');
    }
  }
  return hints;
};

// ── Language config ───────────────────────────────────────────
const LANG_CONFIG = {
  javascript: {
    label: 'JavaScript',
    accent: '#f7df1e',
    icon: '⚡',
    monacoLang: 'javascript',
    filename: 'script.js',
    defaultCode:
      '// Write your JavaScript project here\n\n' +
      'console.log("Hello, World!");\n',
  },
  python: {
    label: 'Python',
    accent: '#4ade80',
    icon: '🐍',
    monacoLang: 'python',
    filename: 'script.py',
    defaultCode:
      '# Write your Python project here\n\n' +
      'print("Hello, World!")\n',
  },
};

// ── Main Component ────────────────────────────────────────────
const BuildPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Project list state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // New project modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState(null);
  const [creating, setCreating] = useState(false);

  // Active project / IDE state
  const [activeProject, setActiveProject] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [hints, setHints] = useState([]);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [xpPopup, setXpPopup] = useState(null);

  const saveTimer = useRef(null);

  // ── Load projects ───────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/user-projects');
        setProjects(res.data);
      } catch (_) {}
      finally { setLoadingProjects(false); }
    };
    fetchProjects();
  }, [user]);

  // ── Load Pyodide when active project is Python ──────────────
  useEffect(() => {
    if (activeProject?.language === 'python' && !pyodideReady) {
      setPyodideLoading(true);
      loadPyodide()
        .then(() => {
          setPyodideReady(true);
          setPyodideLoading(false);
        })
        .catch(() => setPyodideLoading(false));
    }
  }, [activeProject]);

  // ── Auto-save code after 2 seconds of no typing ─────────────
  useEffect(() => {
    if (!activeProject) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await axios.put(`/user-projects/${activeProject._id}`, {
          code,
        });
        setSaveMsg('Saved ✓');
        setTimeout(() => setSaveMsg(''), 2000);
      } catch (_) {}
    }, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [code, activeProject]);

  // ── Create new project ──────────────────────────────────────
  const handleCreateProject = async () => {
    if (!newTitle.trim() || !newLang) return;
    setCreating(true);
    try {
      const res = await axios.post('/user-projects', {
        title: newTitle.trim(),
        language: newLang,
      });
      const project = res.data;
      setProjects(prev => [project, ...prev]);
      setShowNewModal(false);
      setNewTitle('');
      setNewLang(null);
      openProject(project);
    } catch (_) {}
    finally { setCreating(false); }
  };

  // ── Open a project in the IDE ───────────────────────────────
  const openProject = (project) => {
    setActiveProject(project);
    setCode(project.code ||
      LANG_CONFIG[project.language].defaultCode);
    setOutput('');
    setHasError(false);
    setErrorMsg('');
    setShowHintPopup(false);
  };

  // ── Delete a project ────────────────────────────────────────
  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`/user-projects/${projectId}`);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      if (activeProject?._id === projectId) {
        setActiveProject(null);
      }
    } catch (_) {}
  };

  // ── Run code ────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (!code.trim() || !activeProject) return;
    setIsRunning(true);
    setOutput('');
    setHasError(false);
    setErrorMsg('');
    setShowHintPopup(false);

    try {
      let result;
      if (activeProject.language === 'python') {
        if (!pyodideReady) {
          setOutput(
            '⏳ Python runtime is loading...\n' +
            'Please wait 10-15 seconds and try again.'
          );
          setIsRunning(false);
          return;
        }
        result = await runPythonCode(code);
      } else {
        result = runJavaScriptCode(code);
      }

      if (result.error) {
        setHasError(true);
        setErrorMsg(result.error);
        setOutput(`❌ Error:\n${result.error}`);
        setHints(getErrorHints(
          result.error, activeProject.language
        ));
        setShowHintPopup(true);
      } else {
        setOutput(result.output);
        setHasError(false);

        // Save output + increment run count + award XP
        try {
          const saveRes = await axios.put(
            `/user-projects/${activeProject._id}`,
            {
              code,
              lastOutput: result.output,
              incrementRun: true,
            }
          );
          if (saveRes.data.xpAwarded > 0) {
            setXpPopup(`+${saveRes.data.xpAwarded} XP earned! ⚡`);
            setTimeout(() => setXpPopup(null), 3000);
          }
          // Update project in list
          setProjects(prev =>
            prev.map(p =>
              p._id === activeProject._id
                ? { ...p, ...saveRes.data.project }
                : p
            )
          );
        } catch (_) {}
      }
    } catch (e) {
      setHasError(true);
      setErrorMsg(e.message);
      setOutput(`❌ Unexpected error:\n${e.message}`);
      setHints(getErrorHints(e.message, activeProject.language));
      setShowHintPopup(true);
    } finally {
      setIsRunning(false);
    }
  }, [code, activeProject, pyodideReady]);

  const langConfig = activeProject
    ? LANG_CONFIG[activeProject.language]
    : null;

  // ── Redirect if not logged in ───────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center
                      justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-gray-400 font-mono mb-4">
            Please log in to use the Build section
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-purple-600 rounded font-mono"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ── IDE view (project open) ─────────────────────────────────
  if (activeProject) {
    return (
            <div className="min-h-screen lg:h-screen bg-gray-950 text-white flex flex-col
              overflow-y-auto lg:overflow-hidden overflow-x-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2
                        bg-gray-900 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveProject(null)}
              className="text-gray-400 hover:text-white text-sm
                         font-mono transition"
            >
              ← My Projects
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-white font-mono font-bold">
              {activeProject.title}
            </span>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${langConfig.accent}20`,
                color: langConfig.accent,
              }}
            >
              {langConfig.icon} {langConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className="text-xs text-green-400 font-mono">
                {saveMsg}
              </span>
            )}
            {activeProject.language === 'python' && (
              <span
                className="text-xs font-mono px-2 py-1 rounded"
                style={{
                  backgroundColor: pyodideReady
                    ? 'rgba(74,222,128,0.15)'
                    : 'rgba(251,191,36,0.15)',
                  color: pyodideReady ? '#4ade80' : '#fbbf24',
                }}
              >
                {pyodideReady
                  ? '● Python Ready'
                  : pyodideLoading
                  ? '⏳ Loading Python...'
                  : '● Python'}
              </span>
            )}
          </div>
        </div>

        {/* Split screen */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

          {/* LEFT — Editor */}
          <div className="order-1 w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r
                          border-white/10 overflow-hidden min-h-[56vh] sm:min-h-[58vh] lg:min-h-0">
            {/* File tab */}
            <div className="flex items-center px-4 bg-gray-900
                            border-b border-white/10 flex-shrink-0">
              <div
                className="flex items-center gap-2 px-3 py-2
                           text-sm font-mono border-b-2"
                style={{
                  borderColor: langConfig.accent,
                  color: langConfig.accent,
                }}
              >
                <span>📄</span>
                <span>{langConfig.filename}</span>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="h-[42vh] sm:h-[46vh] lg:flex-1 lg:h-auto overflow-hidden">
              <Editor
                height="100%"
                language={langConfig.monacoLang}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>

            {/* Run button bar */}
            <div
                className="flex items-center justify-between px-4
                         py-2 bg-gray-900 border-t border-white/10
                     flex-shrink-0"
            >
              <span className="text-xs text-gray-500 font-mono">
                {activeProject.runCount > 0
                  ? `Run ${activeProject.runCount} times`
                  : 'Write your code and click Run'}
              </span>
              <button
                onClick={handleRun}
                disabled={
                  isRunning ||
                  (activeProject.language === 'python' &&
                    !pyodideReady)
                }
                className="flex items-center gap-2 px-5 py-2
                           text-sm font-mono font-bold rounded-lg
                           text-black transition hover:opacity-90
                           disabled:opacity-50
                           disabled:cursor-not-allowed"
                style={{ backgroundColor: langConfig.accent }}
              >
                {isRunning
                  ? '⏳ Running...'
                  : activeProject.language === 'python' &&
                    pyodideLoading
                  ? '⏳ Loading Python...'
                  : '▶ Run Code'}
              </button>
            </div>
          </div>

          {/* RIGHT — Terminal */}
          <div className="order-2 w-full lg:w-1/2 flex flex-col overflow-hidden
                          bg-gray-900 min-h-[34vh] sm:min-h-[36vh] lg:min-h-0">
            {/* Terminal header */}
            <div
              className="px-4 py-2 text-xs font-mono border-b
                         border-white/10 flex items-center
                         justify-between flex-shrink-0"
              style={{ color: langConfig.accent }}
            >
              <span>⬛ Terminal</span>
              {hasError && (
                <button
                  onClick={() => setShowHintPopup(true)}
                  className="flex items-center gap-1 px-3 py-1
                             rounded text-xs font-bold transition"
                  style={{
                    backgroundColor: 'rgba(251,191,36,0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(251,191,36,0.3)',
                  }}
                >
                  💡 Get Hints
                </button>
              )}
            </div>

            {/* Output */}
            <div className="flex-1 overflow-y-auto p-4 min-h-[20vh]">
              {output ? (
                <pre
                  className="font-mono text-sm whitespace-pre-wrap
                             leading-relaxed"
                  style={{
                    color: hasError ? '#f87171' : '#86efac',
                  }}
                >
                  {output}
                </pre>
              ) : (
                <div
                  className="h-full flex flex-col items-center
                             justify-center text-gray-600"
                >
                  <span className="text-5xl mb-3">⟨/⟩</span>
                  <span className="text-sm font-mono">
                    Click Run to see your output
                  </span>
                  {activeProject.language === 'python' &&
                    !pyodideReady && (
                      <span className="text-xs text-yellow-500
                                       mt-2 font-mono">
                        Python runtime is loading...
                      </span>
                    )}
                </div>
              )}
            </div>

            {/* XP popup */}
            {xpPopup && (
              <div
                className="mx-4 mb-3 px-4 py-2 rounded-lg
                           text-center font-mono font-bold text-sm"
                style={{
                  backgroundColor: 'rgba(250,204,21,0.15)',
                  border: '1px solid rgba(250,204,21,0.3)',
                  color: '#facc15',
                }}
              >
                {xpPopup}
              </div>
            )}
          </div>
        </div>

        {/* Error Hint Popup */}
        {showHintPopup && hints.length > 0 && (
          <div className="fixed inset-0 flex items-center
                          justify-center z-50 bg-black/60">
            <div
              className="rounded-2xl p-6 max-w-md w-full mx-4
                         shadow-2xl"
              style={{
                backgroundColor: '#161b22',
                border: '1px solid rgba(251,191,36,0.4)',
              }}
            >
              <div className="flex items-center justify-between
                              mb-4">
                <h3 className="font-bold font-mono text-yellow-400
                               text-lg">
                  💡 Error Hints
                </h3>
                <button
                  onClick={() => setShowHintPopup(false)}
                  className="text-gray-500 hover:text-white
                             text-xl transition"
                >
                  ✕
                </button>
              </div>

              {/* Error message */}
              <div
                className="rounded-lg px-3 py-2 mb-4 font-mono
                           text-xs text-red-300"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
              >
                {errorMsg}
              </div>

              {/* Hints */}
              <div className="space-y-2 mb-4">
                {hints.map((hint, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm
                               text-gray-300"
                  >
                    <span className="text-yellow-400 mt-0.5
                                     flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowHintPopup(false)}
                className="w-full py-2 font-mono font-bold
                           rounded-lg text-black transition
                           hover:opacity-90"
                style={{ backgroundColor: '#fbbf24' }}
              >
                Got it — Fix My Code
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Project list view ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-mono">
              🔨 My Projects
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Build, run, and save your coding projects.
              Earn XP on your first successful run!
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-5 py-2.5
                       font-mono font-bold rounded-lg text-black
                       transition hover:opacity-90"
            style={{ backgroundColor: '#a78bfa' }}
          >
            + New Project
          </button>
        </div>

        {/* Stats bar */}
        <div
          className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl
                     border border-white/10"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {projects.length}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Projects Created
            </p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-2xl font-bold text-yellow-400">
              {projects.reduce(
                (sum, p) => sum + (p.runCount || 0), 0
              )}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Total Runs
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {projects.filter(p => p.xpAwarded).length * 25}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1">
              XP from Projects
            </p>
          </div>
        </div>

        {/* Project list */}
        {loadingProjects ? (
          <div className="text-center py-20 text-gray-500
                          font-mono">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-400 font-mono mb-6">
              No projects yet. Create your first project!
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-6 py-3 font-mono font-bold rounded-lg
                         text-black"
              style={{ backgroundColor: '#a78bfa' }}
            >
              + Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2
                          lg:grid-cols-3 gap-4">
            {projects.map(project => {
              const cfg = LANG_CONFIG[project.language];
              return (
                <div
                  key={project._id}
                  onClick={() => openProject(project)}
                  className="rounded-xl border cursor-pointer
                             transition hover:scale-[1.02]
                             hover:border-opacity-60 p-5"
                  style={{
                    borderColor: `${cfg.accent}30`,
                    backgroundColor:
                      'rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="flex items-start justify-between
                                  mb-3">
                    <div
                      className="text-2xl w-10 h-10 rounded-lg
                                 flex items-center justify-center"
                      style={{
                        backgroundColor: `${cfg.accent}15`,
                      }}
                    >
                      {cfg.icon}
                    </div>
                    <button
                      onClick={(e) =>
                        handleDelete(project._id, e)
                      }
                      className="text-gray-600 hover:text-red-400
                                 transition text-sm p-1"
                      title="Delete project"
                    >
                      🗑
                    </button>
                  </div>

                  <h3 className="font-bold font-mono text-white
                                 mb-1 truncate">
                    {project.title}
                  </h3>
                  <p
                    className="text-xs font-mono mb-3"
                    style={{ color: cfg.accent }}
                  >
                    {cfg.label}
                  </p>

                  <div className="flex items-center justify-between
                                  text-xs text-gray-500 font-mono">
                    <span>▶ {project.runCount} runs</span>
                    {project.xpAwarded && (
                      <span className="text-yellow-400">
                        ⚡ +25 XP
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-600
                                  font-mono">
                    {new Date(project.updatedAt)
                      .toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 flex items-center
                        justify-center z-50 bg-black/60">
          <div
            className="rounded-2xl p-6 w-full max-w-md mx-4
                       shadow-2xl"
            style={{
              backgroundColor: '#161b22',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-center justify-between
                            mb-6">
              <h2 className="text-xl font-bold font-mono">
                🆕 New Project
              </h2>
              <button
                onClick={() => {
                  setShowNewModal(false);
                  setNewTitle('');
                  setNewLang(null);
                }}
                className="text-gray-500 hover:text-white
                           text-xl"
              >
                ✕
              </button>
            </div>

            {/* Project title input */}
            <div className="mb-5">
              <label className="block text-sm font-mono
                               text-gray-400 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newTitle && newLang) {
                    handleCreateProject();
                  }
                }}
                placeholder="e.g. Calculator App"
                className="w-full px-4 py-2.5 rounded-lg
                           bg-gray-800 border border-white/10
                           text-white font-mono text-sm
                           focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </div>

            {/* Language selection */}
            <div className="mb-6">
              <label className="block text-sm font-mono
                               text-gray-400 mb-3">
                Choose Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(LANG_CONFIG).map(
                  ([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setNewLang(key)}
                      className="flex flex-col items-center
                                 justify-center p-4 rounded-xl
                                 border-2 transition font-mono"
                      style={{
                        borderColor:
                          newLang === key
                            ? cfg.accent
                            : 'rgba(255,255,255,0.1)',
                        backgroundColor:
                          newLang === key
                            ? `${cfg.accent}15`
                            : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <span className="text-3xl mb-2">
                        {cfg.icon}
                      </span>
                      <span
                        className="font-bold text-sm"
                        style={{
                          color:
                            newLang === key
                              ? cfg.accent
                              : '#9ca3af',
                        }}
                      >
                        {cfg.label}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Create button */}
            <button
              onClick={handleCreateProject}
              disabled={!newTitle.trim() || !newLang || creating}
              className="w-full py-3 font-mono font-bold
                         rounded-lg text-black transition
                         hover:opacity-90
                         disabled:opacity-40
                         disabled:cursor-not-allowed"
              style={{ backgroundColor: '#a78bfa' }}
            >
              {creating
                ? '⏳ Creating...'
                : '🚀 Create & Open Project'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildPage;
