import { useState, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

/**
 * QuizBlock — reusable MCQ component
 * Props:
 *   question: string
 *   options: string[]
 *   correct: number (index)
 *   explanation: string
 */
const QuizBlock = ({ question, options, correct, explanation }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };

  const reset = () => { setSelected(null); setRevealed(false); };

  return (
    <div className="my-5 rounded-2xl border border-yellow-500/25 bg-yellow-500/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-yellow-500/15 bg-yellow-500/8">
        <span className="text-xl">🧠</span>
        <h4 className="font-bold text-yellow-300 text-sm">Quick Quiz</h4>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{question}</p>

        <div className="space-y-2">
          {options.map((opt, i) => {
            const isCorrect = i === correct;
            const isSelected = i === selected;

            let cls = 'bg-dark-600/50 border-dark-400/50 hover:border-primary-500/40 cursor-pointer hover:bg-dark-500/50';
            if (revealed) {
              if (isCorrect) cls = 'bg-emerald-500/15 border-emerald-500/50 cursor-default';
              else if (isSelected && !isCorrect) cls = 'bg-red-500/15 border-red-500/50 cursor-default';
              else cls = 'bg-dark-600/30 border-dark-400/30 opacity-50 cursor-default';
            } else if (isSelected) {
              cls = 'bg-primary-500/15 border-primary-500/50 cursor-pointer';
            }

            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${cls}`}>
                <span className="text-slate-400 font-mono text-xs w-5 flex-shrink-0">{String.fromCharCode(65 + i)}.</span>
                <span className="text-slate-300 flex-1">{opt}</span>
                {revealed && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
                {revealed && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-4 p-3 rounded-xl bg-dark-800/80 border border-dark-400/30">
            <p className="text-xs text-slate-400 leading-relaxed">
              💡 <strong className="text-slate-300">Explanation:</strong> {explanation}
            </p>
            <button onClick={reset}
              className="mt-2 text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Try again →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBlock;
