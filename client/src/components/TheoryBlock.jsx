import { useState } from 'react';
import { Lightbulb, BookOpen, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import QuizBlock from './QuizBlock';

/* ── Inline syntax colorizer ───────────────────────────────────────────── */
const colorize = (line) =>
  line
    .replace(/(\/\/.*$)/g, '<span style=$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|of|in|new|class|import|export|default|async|await|=>|def|print|range|for|if|elif|else|True|False|None)\b/g,
      '<span style=$1</span>')
    .replace(/([`"'].*?[`"'])/g, '<span style="color:#86efac">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#fbbf24">$1</span>')
    .replace(/\b(console|Math|Array|Object|String|Number|Boolean|JSON|Promise|document|window|addEventListener|fetch)\b/g,
      '<span style="color:#38bdf8">$1</span>');

/* ── Code block component ───────────────────────────────────────────────── */
const CodeSnippet = ({ code, language = 'js', title }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-dark-400/50 shadow-lg">
      {/* Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-dark-400/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs font-mono text-slate-500">{title || language}</span>
        </div>
        <button onClick={copy} className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono">
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre className="p-4 bg-[#0d1117] text-sm font-mono leading-relaxed overflow-x-auto">
        {code.split('\n').map((line, i) => (
          <div key={i} className="hover:bg-white/[0.02] rounded px-1 -mx-1 transition-colors"
            dangerouslySetInnerHTML={{ __html: colorize(line) || '&nbsp;' }} />
        ))}
      </pre>
    </div>
  );
};

/* ── Key Rules callout ──────────────────────────────────────────────────── */
const KeyRules = ({ rules = [] }) => (
  <div className="my-4 p-4 rounded-xl bg-primary-500/8 border border-primary-500/20">
    <div className="flex items-center gap-2 mb-3">
      <span>🔑</span>
      <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">Key Rules</span>
    </div>
    <ul className="space-y-1.5">
      {rules.map((rule, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
          <span className="text-primary-400 mt-0.5 flex-shrink-0">▸</span>
          <span dangerouslySetInnerHTML={{ __html: rule }} />
        </li>
      ))}
    </ul>
  </div>
);

/* ── References footer ──────────────────────────────────────────────────── */
const References = ({ links = [] }) => (
  <div className="mt-6 p-4 rounded-xl bg-dark-700/60 border border-dark-400/40">
    <div className="flex items-center gap-2 mb-3">
      <BookOpen size={14} className="text-primary-400" />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">References & Further Reading</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {links.map((link, i) => (
        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-600/60 border border-dark-400/30
                     hover:border-primary-500/40 transition-all group">
          <span className="text-base flex-shrink-0">{link.emoji || '🔗'}</span>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-300 group-hover:text-primary-300 transition-colors
                            flex items-center gap-1 truncate">
              {link.title}
              <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
            </div>
            {link.author && <div className="text-[10px] text-slate-600">{link.author}</div>}
          </div>
        </a>
      ))}
    </div>
  </div>
);

/* ── Collapsible Topic ──────────────────────────────────────────────────── */
const TopicSection = ({ topic, isFirst = false }) => {
  const [expanded, setExpanded] = useState(isFirst);

  return (
    <div className="my-4 rounded-xl border border-dark-400/30 bg-dark-800/30 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-dark-700/40 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-lg">{topic.emoji || '📌'}</span>
          <div>
            <h4 className="font-semibold text-slate-100">{topic.name}</h4>
            {topic.description && <p className="text-xs text-slate-500">{topic.description}</p>}
          </div>
        </div>
        {expanded ? <ChevronDown size={18} className="text-primary-400" /> : <ChevronRight size={18} className="text-slate-500" />}
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-dark-400/20 pt-3">
          {topic.content && (
            <p className="text-sm text-slate-400 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: topic.content }} />
          )}

          {/* Code Examples */}
          {topic.codeExamples && topic.codeExamples.length > 0 && (
            <div>
              {topic.codeExamples.map((example, idx) => (
                <div key={idx}>
                  {example.title && <p className="text-xs font-semibold text-primary-300 mb-2">{example.title}</p>}
                  <CodeSnippet code={example.code} language={example.language || 'js'} title={example.title} />
                  {example.explanation && <p className="text-xs text-slate-500 italic mb-3">{example.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Key Rules */}
          {topic.keyRules && topic.keyRules.length > 0 && <KeyRules rules={topic.keyRules} />}

          {/* Subtopics */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="mt-4 space-y-3">
              {topic.subtopics.map((sub, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-dark-700/40 border border-dark-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{sub.emoji || '▪️'}</span>
                    <h5 className="font-semibold text-slate-100 text-sm">{sub.name}</h5>
                  </div>
                  {sub.description && <p className="text-xs text-slate-500 mb-2">{sub.description}</p>}
                  {sub.content && <p className="text-sm text-slate-400 mb-2">{sub.content}</p>}
                  {sub.codeExamples && sub.codeExamples.map((ex, i) => (
                    <div key={i}>
                      <CodeSnippet code={ex.code} language="js" title={ex.title} />
                      {ex.explanation && <p className="text-xs text-slate-500 italic">{ex.explanation}</p>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * TheoryBlock — displays structured theory content
 * Handles both old string format and new structured format
 */
const TheoryBlock = ({ theory }) => {
  // Handle old string format (legacy)
  if (typeof theory === 'string') {
    return (
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: theory }} className="text-slate-300" />
      </div>
    );
  }

  // Handle new structured format
  if (!theory || typeof theory !== 'object') {
    return null;
  }

  const {
    title,
    emoji = '📖',
    description,
    topics = [],
    quickQuiz = [],
    references = [],
  } = theory;

  return (
    <div className="space-y-6">
      {/* Title Section */}
      {(title || emoji) && (
        <div className="rounded-2xl border border-dark-400/40 bg-dark-700/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{emoji}</span>
            <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
          </div>
          {description && (
            <p className="text-slate-400 leading-relaxed">{description}</p>
          )}
        </div>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-200 mb-3">Topics in this chapter</h3>
          {topics.map((topic, idx) => (
            <TopicSection key={idx} topic={topic} isFirst={idx === 0} />
          ))}
        </div>
      )}

      {/* Quick Quiz */}
      {quickQuiz && quickQuiz.length > 0 && (
        <div className="rounded-2xl border border-dark-400/40 bg-dark-700/50 p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-4">💡 Quick Quiz</h3>
          <div className="space-y-4">
            {quickQuiz.map((q, idx) => (
              <QuizBlock
                key={idx}
                question={q.question}
                options={q.options}
                correct={q.correctAnswer}
                explanation={`Answer: ${q.options[q.correctAnswer]}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {references && references.length > 0 && <References links={references} />}
    </div>
  );
};

export { CodeSnippet, KeyRules, References, TopicSection };
export default TheoryBlock;
