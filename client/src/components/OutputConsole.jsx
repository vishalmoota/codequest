import { useRef, useEffect } from 'react';
import { Terminal, Trash2, Circle } from 'lucide-react';

/**
 * OutputConsole — shows result lines from code execution
 * Props:
 *   lines: Array<{ type: 'log'|'error'|'warn'|'info', text: string }>
 *   onClear: () => void
 *   isRunning: boolean
 */
const OutputConsole = ({ lines = [], onClear, isRunning = false }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const lineColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn':  return 'text-yellow-400';
      case 'info':  return 'text-blue-400';
      case 'success': return 'text-emerald-400';
      default:      return 'text-slate-300';
    }
  };

  const linePrefix = (type) => {
    switch (type) {
      case 'error': return '✖ ';
      case 'warn':  return '⚠ ';
      case 'info':  return 'ℹ ';
      case 'success': return '✔ ';
      default:      return '> ';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d1a] border-t border-dark-400/40">
      {/* Console header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-dark-400/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-slate-400">OUTPUT</span>
          {isRunning && (
            <div className="flex items-center gap-1 text-[10px] text-yellow-400">
              <Circle size={6} className="animate-pulse fill-yellow-400" />
              Running...
            </div>
          )}
        </div>
        <button onClick={onClear}
          className="text-slate-600 hover:text-slate-400 transition-colors p-1 rounded"
          title="Clear console">
          <Trash2 size={12} />
        </button>
      </div>

      {/* Output content */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-700 py-6">
            <Terminal size={24} className="mb-2 opacity-40" />
            <p className="text-[11px]">Click ▶ Run to see output here</p>
          </div>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`flex gap-2 py-0.5 ${lineColor(line.type)}`}>
              <span className="opacity-50 flex-shrink-0 select-none">{linePrefix(line.type)}</span>
              <pre className="whitespace-pre-wrap break-words flex-1">{line.text}</pre>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default OutputConsole;
