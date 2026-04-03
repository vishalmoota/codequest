import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import OutputConsole from './OutputConsole';
import { Play, RotateCcw, Code2, Globe } from 'lucide-react';

const LANGUAGE_MAP = {
  javascript: 'javascript',
  js: 'javascript',
  jsx: 'javascript',
  html: 'html',
  css: 'css',
  python: 'python',
};

/**
 * CodeEditor — Monaco-based editor with run button + output/iframe
 * Props:
 *   code: string          — controlled code value
 *   onChange: fn          — callback when code changes (controlled mode) 
 *   defaultCode: string   — initial code (uncontrolled mode)
 *   language: string      — 'javascript' | 'html' | 'css' | 'python'
 *   onCodeChange: fn      — optional callback when code changes
 */
const CodeEditor = ({ code: propCode, onChange, defaultCode = '', language = 'javascript', onCodeChange }) => {
  const isControlled = propCode !== undefined && onChange;
  const [internalCode, setInternalCode] = useState(defaultCode);
  const code = isControlled ? propCode : internalCode;
  const [outputLines, setOutputLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iframeDoc, setIframeDoc] = useState(null);
  const [activeOutput, setActiveOutput] = useState('console'); // 'console' | 'preview'

  const monacoLang = LANGUAGE_MAP[language?.toLowerCase()] || 'javascript';
  const isHTML = monacoLang === 'html' || monacoLang === 'css';

  const handleChange = (val) => {
    const newCode = val || '';
    if (isControlled) {
      onChange?.(newCode);
    } else {
      setInternalCode(newCode);
    }
    onCodeChange?.(newCode);
  };

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutputLines([]);

    if (isHTML) {
      // For HTML/CSS: render in iframe
      const doc = monacoLang === 'css'
        ? `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="demo">CSS Preview</div></body></html>`
        : code;
      setIframeDoc(doc);
      setActiveOutput('preview');
      setIsRunning(false);
      return;
    }

    // For JS: safe eval using Function
    const logs = [];
    const push = (type, ...args) => {
      const text = args.map(a =>
        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
      ).join(' ');
      logs.push({ type, text });
    };

    const fakeCons = {
      log:   (...a) => push('log',  ...a),
      error: (...a) => push('error', ...a),
      warn:  (...a) => push('warn',  ...a),
      info:  (...a) => push('info',  ...a),
    };

    try {
      // eslint-disable-next-line no-new-func
      new Function('console', code)(fakeCons);
      if (logs.length === 0) push('info', '(No output — add console.log() to see results)');
    } catch (err) {
      push('error', err.message);
    }

    setTimeout(() => {
      setOutputLines(logs);
      setActiveOutput('console');
      setIsRunning(false);
    }, 100);
  }, [code, isHTML, monacoLang]);

  const reset = () => {
    const resetCode = isControlled ? propCode : defaultCode;
    if (isControlled) {
      onChange?.(resetCode);
    } else {
      setInternalCode(resetCode);
    }
    setOutputLines([]);
    setIframeDoc(null);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0d0d1a] rounded-2xl overflow-hidden border border-dark-400/40">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-dark-400/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
            <Code2 size={11} />
            {monacoLang}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset}
            className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-dark-600/50"
            title="Reset to original">
            <RotateCcw size={13} />
          </button>
          <button onClick={runCode} disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500
                       disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-all
                       shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95">
            <Play size={12} fill="white" />
            {isRunning ? 'Running...' : 'Run ▶'}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0" style={{ height: '55%' }}>
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            glowingLineNumbers: true,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
            renderLineHighlight: 'gutter',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Output tabs */}
      <div className="flex-shrink-0 border-t border-dark-400/30" style={{ height: '45%', display: 'flex', flexDirection: 'column' }}>
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-[#0d1117] border-b border-dark-400/20 flex-shrink-0">
          <button onClick={() => setActiveOutput('console')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              activeOutput === 'console' ? 'bg-dark-500 text-slate-200' : 'text-slate-600 hover:text-slate-400'
            }`}>
            Console
          </button>
          {isHTML && (
            <button onClick={() => setActiveOutput('preview')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeOutput === 'preview' ? 'bg-dark-500 text-slate-200' : 'text-slate-600 hover:text-slate-400'
              }`}>
              <Globe size={10} />
              Preview
            </button>
          )}
        </div>

        {/* Output content */}
        <div className="flex-1 min-h-0">
          {activeOutput === 'preview' && iframeDoc ? (
            <iframe
              srcDoc={iframeDoc}
              title="HTML Preview"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts"
            />
          ) : (
            <OutputConsole
              lines={outputLines}
              onClear={() => setOutputLines([])}
              isRunning={isRunning}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
