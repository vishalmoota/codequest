import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

/* ────────────────────────────────────────────────
   MEMORY DIAGRAM – shows variable "boxes"
──────────────────────────────────────────────── */
const MemoryDiagram = ({ vars }) => (
  <div className="flex flex-wrap gap-3 my-4">
    {vars.map((v, i) => (
      <div key={i} className="diagram-box text-center min-w-[80px]" style={{
        animationDelay: `${i * 0.15}s`,
        animation: 'zoomBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        opacity: 0,
        animationFillMode: 'forwards',
      }}>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{v.name}</div>
        <div className="text-primary-300 font-bold">{v.value}</div>
        <div className="text-[9px] text-slate-500 mt-1">{v.type}</div>
      </div>
    ))}
  </div>
);

/* ────────────────────────────────────────────────
   FLOWCHART – simple SVG-based if/else flow
──────────────────────────────────────────────── */
const FlowChart = ({ nodes }) => {
  const nodeH = 44, nodeW = 140, gap = 20;
  const totalH = nodes.length * (nodeH + gap) + 20;
  return (
    <svg width="200" height={totalH} className="mx-auto my-4" style={{ overflow: 'visible' }}>
      {nodes.map((n, i) => {
        const y = i * (nodeH + gap);
        const isDecision = n.type === 'decision';
        return (
          <g key={i}>
            {i > 0 && (
              <line x1="100" y1={y - gap} x2="100" y2={y}
                stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4"
                className="path-draw" />
            )}
            {isDecision ? (
              <polygon
                points={`100,${y} ${nodeW},${y + nodeH / 2} 100,${y + nodeH} ${200 - nodeW},${y + nodeH / 2}`}
                fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5"
              />
            ) : (
              <rect x={30} y={y} width={140} height={nodeH} rx="8"
                fill={n.color || 'rgba(99,102,241,0.15)'} stroke={n.stroke || '#6366f1'} strokeWidth="1.5" />
            )}
            <text x="100" y={y + nodeH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
              fontSize="11" fill="#c7d2fe" fontFamily="Fira Code, monospace">{n.label}</text>
            {n.yes && (
              <text x="150" y={y + nodeH / 2} fontSize="9" fill="#10b981">✓ yes</text>
            )}
            {n.no && (
              <text x="20" y={y + nodeH / 2} fontSize="9" fill="#ef4444">✗ no</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* ────────────────────────────────────────────────
   LOOP VISUALIZER – animated iteration counter
──────────────────────────────────────────────── */
const LoopViz = ({ iterations = 5 }) => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-4">
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: iterations }).map((_, i) => (
          <div key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`diagram-box cursor-pointer transition-all duration-200 ${active === i ? 'scale-125 border-emerald-400/80 bg-emerald-400/15' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="text-[10px] text-slate-500">i={i}</div>
            <div className="text-emerald-300 font-bold text-lg">{i}</div>
            {active === i && <div className="text-[9px] text-emerald-400">← current</div>}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">Hover each box to see the loop variable value at that iteration</p>
    </div>
  );
};

/* ────────────────────────────────────────────────
   SCOPE CHAIN – visual scope nesting
──────────────────────────────────────────────── */
const ScopeChain = () => (
  <div className="my-4 space-y-2">
    {[
      { label: '🌍 Global Scope', vars: ['let x = 10', 'function greet()'], color: 'rgba(99,102,241,0.15)', border: '#6366f1' },
      { label: '  📦 Function Scope (greet)', vars: ['  let name = "Alice"', '  console.log(x)  // ✓ sees global x'], color: 'rgba(168,85,247,0.15)', border: '#a855f7' },
      { label: '    🔒 Block Scope (if block)', vars: ['    let temp = true', '    // only visible here'], color: 'rgba(236,72,153,0.15)', border: '#ec4899' },
    ].map((scope, i) => (
      <div key={i} className="rounded-lg p-3 font-mono text-xs transition-all hover:scale-[1.01]"
        style={{ background: scope.color, border: `1px solid ${scope.border}`, marginLeft: `${i * 16}px` }}>
        <div className="font-bold text-slate-300 mb-1">{scope.label}</div>
        {scope.vars.map((v, j) => <div key={j} className="text-primary-300">{v}</div>)}
      </div>
    ))}
  </div>
);

/* ────────────────────────────────────────────────
   ARRAY VIZ – index boxes
──────────────────────────────────────────────── */
const ArrayViz = ({ items }) => (
  <div className="my-4">
    <div className="flex gap-1 flex-wrap">
      {items.map((item, i) => (
        <div key={i} className="text-center" style={{ minWidth: 56 }}>
          <div className="diagram-box" style={{ animationDelay: `${i * 0.08}s`, animation: 'slideInLeft 0.4s ease-out forwards', opacity: 0 }}>
            {String(item)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">idx {i}</div>
        </div>
      ))}
    </div>
    <div className="mt-2 text-xs text-slate-500 font-mono">array[0] = {String(items[0])} &nbsp;|&nbsp; length = {items.length}</div>
  </div>
);

/* ────────────────────────────────────────────────
   ANIMATED CODE BLOCK
──────────────────────────────────────────────── */
const CodeBlock = ({ code, language = 'js' }) => {
  const colorize = (line) => {
    return line
      .replace(/(\/\/.*$)/g, '<span style=$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|of|in|new|class|import|export|default|=&gt;)\b/g, '<span style=$1</span>')
      .replace(/(['"`].*?['"`])/g, '<span style="color:#86efac">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#fbbf24">$1</span>')
      .replace(/\b(console|Math|Array|Object|String|Number|Boolean|JSON)\b/g, '<span style="color:#38bdf8">$1</span>');
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-dark-400/50"
      style={{ background: '#0d0d1a' }}>
      <div className="flex items-center gap-2 px-4 py-2 bg-dark-800/80 border-b border-dark-400/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-xs text-slate-500 font-mono ml-2">{language}</span>
      </div>
      <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto">
        {code.split('\n').map((line, i) => (
          <div key={i} className="hover:bg-white/[0.02] transition-colors rounded px-1 -mx-1"
            dangerouslySetInnerHTML={{ __html: colorize(line) || '&nbsp;' }} />
        ))}
      </pre>
    </div>
  );
};

/* ────────────────────────────────────────────────
   MINI QUIZ
──────────────────────────────────────────────── */
const MiniQuiz = ({ question, options, correct, explanation }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="my-4 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧠</span>
        <h4 className="font-bold text-yellow-300 text-sm">Quick Quiz</h4>
      </div>
      <p className="text-sm text-slate-300 mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isCorrect = i === correct;
          const isSelected = i === selected;
          let bg = 'bg-dark-600/50 border-dark-400/50 hover:border-primary-500/30';
          if (revealed) {
            if (isCorrect) bg = 'bg-emerald-500/15 border-emerald-500/50';
            else if (isSelected && !isCorrect) bg = 'bg-red-500/15 border-red-500/50';
          } else if (isSelected) bg = 'bg-primary-500/15 border-primary-500/50';
          return (
            <button key={i} onClick={() => { setSelected(i); setRevealed(true); }}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${bg}`}>
              <span className="text-slate-400 font-mono text-xs min-w-[20px]">{String.fromCharCode(65 + i)}.</span>
              <span className="text-slate-300">{opt}</span>
              {revealed && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 ml-auto" />}
              {revealed && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 ml-auto" />}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="mt-3 p-3 bg-dark-800/80 rounded-lg text-xs text-slate-400 animate-slide-up">
          💡 {explanation}
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────
   REFERENCE BOOKS SECTION
──────────────────────────────────────────────── */
const ReferenceBooks = ({ books }) => (
  <div className="mt-6 p-4 rounded-xl border border-primary-500/20 bg-primary-500/5">
    <h4 className="text-sm font-bold text-primary-300 mb-3 flex items-center gap-2">
      <BookOpen size={16} /> Reference Books & Resources
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {books.map((book, i) => (
        <a key={i} href={book.url} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-2 p-2.5 rounded-lg bg-dark-700/60 border border-dark-400/40 hover:border-primary-500/40 transition-all group">
          <span className="text-lg flex-shrink-0">{book.emoji}</span>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-300 group-hover:text-primary-300 transition-colors flex items-center gap-1">
              {book.title} <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="text-[10px] text-slate-500">{book.author}</div>
          </div>
        </a>
      ))}
    </div>
  </div>
);

/* ────────────────────────────────────────────────
   TOPIC ACCORDION ITEM
──────────────────────────────────────────────── */
const TopicItem = ({ topic, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden
      ${open ? 'border-primary-500/40' : 'border-dark-400/40 hover:border-primary-500/20'}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left group">
        <div className="flex items-center gap-3">
          <span className="text-xl">{topic.emoji}</span>
          <div>
            <h3 className={`font-bold transition-colors ${open ? 'text-primary-300' : 'text-slate-200 group-hover:text-primary-300'}`}>
              {topic.title}
            </h3>
            {!open && <p className="text-xs text-slate-500">{topic.subtitle}</p>}
          </div>
        </div>
        {open
          ? <ChevronDown size={18} className="text-primary-400 flex-shrink-0" />
          : <ChevronRight size={18} className="text-slate-500 group-hover:text-primary-400 flex-shrink-0 transition" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 animate-slide-up">
          {topic.content}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   LEVEL THEORY DATA
════════════════════════════════════════════ */

const LEVEL_THEORY = {
  1: {
    title: 'Variables, Data Types & the JS Runtime',
    emoji: '🌱',
    intro: `JavaScript is the language of the web. Every website you interact with uses JS. In this chapter you'll learn the very first building blocks: how to STORE DATA, what TYPES of data exist, and how to PRINT output. Think of variables like labelled boxes where you keep information.`,
    topics: [
      {
        emoji: '📦',
        title: 'Variables: var, let & const',
        subtitle: 'How to declare and name your data containers',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">
              Variables are <strong className="text-primary-300">named containers</strong> for data. JavaScript has three ways to declare them:
            </p>
            <MemoryDiagram vars={[
              { name: 'const', value: '42', type: 'read-only' },
              { name: 'let', value: '"hello"', type: 're-assignable' },
              { name: 'var', value: 'true', type: 'avoid!' },
            ]} />
            <CodeBlock code={`// ✅ PREFER: const for values that don't change
const PI = 3.14159;
const playerName = "Alice";

// ✅ PREFER: let for values that change
let score = 0;
score = score + 10;  // works!

// ❌ AVOID: var (old way, causes bugs)
var age = 25; // function-scoped → confusing`} />
            <div className="text-sm text-slate-400 space-y-2 mt-3">
              <p>🔑 <strong className="text-yellow-300">Key rule:</strong> Default to <code className="code-tag">const</code>. Use <code className="code-tag">let</code> only when you need to reassign. Never use <code className="code-tag">var</code>.</p>
              <p>✨ Variable names must start with a letter, <code className="code-tag">_</code>, or <code className="code-tag">$</code>. They are case-sensitive: <code className="code-tag">score</code> ≠ <code className="code-tag">Score</code>.</p>
            </div>
            <MiniQuiz
              question="Which keyword should you use for a variable that will change later?"
              options={['const', 'let', 'var', 'new']}
              correct={1}
              explanation="'let' allows reassignment. 'const' is for constants, 'var' is outdated, and 'new' is for objects."
            />
          </div>
        ),
      },
      {
        emoji: '🧬',
        title: 'Primitive Data Types',
        subtitle: 'The 7 building-block types of JS',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">JavaScript has <strong className="text-primary-300">7 primitive types</strong>. Primitives are immutable — they can't be changed in place:</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { type: 'String', ex: '"Hello"', color: '#86efac', desc: 'Text data' },
                { type: 'Number', ex: '42, 3.14', color: '#fbbf24', desc: 'Any number' },
                { type: 'Boolean', ex: 'true/false', color: '#60a5fa', desc: 'Logic values' },
                { type: 'Null', ex: 'null', color: '#f472b6', desc: 'Intentional nothing' },
                { type: 'Undefined', ex: 'undefined', color: '#a78bfa', desc: 'Not yet set' },
                { type: 'BigInt', ex: '9007n', color: '#34d399', desc: 'Huge integers' },
                { type: 'Symbol', ex: 'Symbol()', color: '#fb923c', desc: 'Unique keys' },
              ].map(t => (
                <div key={t.type} className="p-2.5 rounded-lg border border-dark-400/40 bg-dark-600/50">
                  <span className="font-bold" style={{ color: t.color }}>{t.type}</span>
                  <span className="text-xs text-slate-500 ml-2">{t.desc}</span>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">{t.ex}</div>
                </div>
              ))}
            </div>
            <CodeBlock code={`const name = "Alice";        // String
const age  = 25;             // Number
const active = true;         // Boolean
const nothing = null;        // Null
let unset;                   // Undefined (auto)
const big  = 9007199254740n; // BigInt

// typeof operator reveals the type
console.log(typeof name);   // "string"
console.log(typeof age);    // "number"
console.log(typeof null);   // "object" ← JS bug!`} />
            <MiniQuiz
              question={`What does typeof null return in JavaScript?`}
              options={["null", "undefined", "object", "string"]}
              correct={2}
              explanation={`This is a famous JavaScript bug! typeof null returns "object" — this has been kept for backward compatibility since JS was invented.`}
            />
          </div>
        ),
      },
      {
        emoji: '🔄',
        title: 'Type Coercion & Conversion',
        subtitle: 'JS automatic type changing — the good and the bad',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">JavaScript automatically converts types in some situations — this is called <strong className="text-yellow-300">type coercion</strong>. It can be surprising!</p>
            <CodeBlock code={`// Implicit coercion (JS decides)
"5" + 3         // → "53"  (string wins!)
"5" - 3         // → 2     (math context)
true + 1        // → 2     (true = 1)
false + 0       // → 0     (false = 0)
null + 5        // → 5     (null = 0)

// Explicit conversion (you decide)
Number("42")    // → 42
String(99)      // → "99"
Boolean(0)      // → false
Boolean("")     // → false
Boolean("hi")   // → true

// parseInt and parseFloat
parseInt("42px")    // → 42
parseFloat("3.14m") // → 3.14`} />
            <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200">
              ⚠️ <strong>Falsy values</strong> in JS: <code className="code-tag">false</code>, <code className="code-tag">0</code>, <code className="code-tag">""</code>, <code className="code-tag">null</code>, <code className="code-tag">undefined</code>, <code className="code-tag">NaN</code>. Everything else is truthy!
            </div>
          </div>
        ),
      },
      {
        emoji: '💬',
        title: 'Template Literals & String Methods',
        subtitle: 'Modern string power tools',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">Template literals use backticks and <code className="code-tag">${'{}'}</code> for embedding expressions inside strings.</p>
            <CodeBlock code={`const name = "Bob";
const age = 30;

// Old way (ugly)
const msg1 = "Hello " + name + ", you are " + age;

// Template literal (clean!)
const msg2 = \`Hello \${name}, you are \${age}\`;

// Multi-line strings
const poem = \`
  Roses are red,
  Code is blue,
  JavaScript is fun,
  And so are you!
\`;

// Useful string methods
"hello".toUpperCase()   // "HELLO"
"  hi  ".trim()         // "hi"
"abc".includes("b")     // true
"cat,dog".split(",")    // ["cat","dog"]
"hello".slice(1,3)      // "el"
"ha".repeat(3)          // "hahaha"`} />
          </div>
        ),
      },
    ],
    books: [
      { emoji: '📗', title: 'Eloquent JavaScript Ch.1', author: 'Marijn Haverbeke', url: 'https://eloquentjavascript.net/01_values.html' },
      { emoji: '📘', title: "You Don't Know JS: Types", author: 'Kyle Simpson', url: 'https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/types-grammar/ch1.md' },
      { emoji: '🌐', title: 'MDN: JavaScript Basics', author: 'Mozilla', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics' },
      { emoji: '📙', title: 'javascript.info: The Basics', author: 'Ilya Kantor', url: 'https://javascript.info/first-steps' },
    ],
  },

  2: {
    title: 'Conditionals & Decision Making',
    emoji: '🔀',
    intro: `Programs would be useless if they always did the same thing. Conditionals let your code MAKE DECISIONS — if something is true, do this; otherwise, do that. This is the foundation of all logic in programming.`,
    topics: [
      {
        emoji: '🚦',
        title: 'if / else if / else',
        subtitle: 'The most fundamental decision structure',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">The <code className="code-tag">if</code> statement evaluates a condition. If true, it runs the code block. Use <code className="code-tag">else if</code> for more options and <code className="code-tag">else</code> as the fallback.</p>
            <FlowChart nodes={[
              { label: 'Condition?', type: 'decision' },
              { label: 'true → run block', color: 'rgba(16,185,129,0.15)', stroke: '#10b981' },
              { label: 'else → fallback', color: 'rgba(239,68,68,0.15)', stroke: '#ef4444' },
            ]} />
            <CodeBlock code={`const score = 85;

if (score >= 90) {
  console.log("A - Excellent!");
} else if (score >= 80) {
  console.log("B - Great job!");  // ← this runs
} else if (score >= 70) {
  console.log("C - Good work");
} else {
  console.log("Need more practice");
}

// Nested if
if (score > 50) {
  if (score > 80) {
    console.log("Really good!");
  }
}`} />
            <MiniQuiz
              question="What will console.log print if score = 75?"
              options={["A - Excellent!", "B - Great job!", "C - Good work", "Need more practice"]}
              correct={2}
              explanation="score=75 is >= 70 but not >= 80, so 'C - Good work' prints."
            />
          </div>
        ),
      },
      {
        emoji: '⚖️',
        title: 'Comparison & Logical Operators',
        subtitle: '==, ===, &&, ||, ! explained clearly',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">These operators produce <code className="code-tag">true</code> or <code className="code-tag">false</code> — the fuel for conditionals:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mb-4">
                <thead>
                  <tr className="border-b border-dark-400/50">
                    <th className="text-left p-2 text-slate-400">Operator</th>
                    <th className="text-left p-2 text-slate-400">Meaning</th>
                    <th className="text-left p-2 text-slate-400">Example</th>
                    <th className="text-left p-2 text-slate-400">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['===', 'Strict equal (type + value)', '5 === "5"', 'false'],
                    ['!==', 'Strict not equal', '5 !== 6', 'true'],
                    ['>', 'Greater than', '10 > 5', 'true'],
                    ['>=', 'Greater or equal', '5 >= 5', 'true'],
                    ['&&', 'AND (both must be true)', 'true && false', 'false'],
                    ['||', 'OR (at least one true)', 'false || true', 'true'],
                    ['!', 'NOT (flips boolean)', '!true', 'false'],
                  ].map(([op, meaning, ex, res]) => (
                    <tr key={op} className="border-b border-dark-400/20 hover:bg-primary-500/5">
                      <td className="p-2 font-mono text-primary-400">{op}</td>
                      <td className="p-2 text-slate-400">{meaning}</td>
                      <td className="p-2 font-mono text-yellow-300">{ex}</td>
                      <td className="p-2 font-mono text-emerald-400">{res}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              ⚠️ Always use <code className="code-tag">===</code> not <code className="code-tag">==</code>! Double equals does type coercion: <code>0 == false</code> is <code>true</code> — very confusing!
            </div>
          </div>
        ),
      },
      {
        emoji: '🎛️',
        title: 'Switch Statement',
        subtitle: 'Cleaner multi-branch decisions',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">Use <code className="code-tag">switch</code> when you have many specific values to check. It's cleaner than many <code className="code-tag">else if</code> chains.</p>
            <CodeBlock code={`const day = "Monday";

switch (day) {
  case "Monday":
    console.log("Back to grind! 💪");
    break;   // ← IMPORTANT: stops fall-through
  case "Friday":
    console.log("Almost weekend! 🎉");
    break;
  case "Saturday":
  case "Sunday":               // multiple cases
    console.log("Rest day! 😴");
    break;
  default:                     // like else
    console.log("Regular day");
}

// ⚠️ Without break, code "falls through":
switch ("a") {
  case "a": console.log("a");  // runs
  case "b": console.log("b");  // ALSO runs!
  case "c": console.log("c");  // ALSO runs!
}`} />
          </div>
        ),
      },
      {
        emoji: '⚡',
        title: 'Ternary Operator',
        subtitle: 'One-line if/else for simple cases',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">The ternary <code className="code-tag">? :</code> operator is a shorthand for simple if/else assignments:</p>
            <CodeBlock code={`// Syntax: condition ? valueIfTrue : valueIfFalse

const age = 20;
const access = age >= 18 ? "allowed" : "denied";
console.log(access); // "allowed"

// Nested ternary (use sparingly!)
const grade = score >= 90 ? "A"
            : score >= 80 ? "B"
            : score >= 70 ? "C"
            : "F";

// In JSX (React)
const label = isLoggedIn ? "Logout" : "Login";`} />
            <MiniQuiz
              question="What does: const x = 10 > 5 ? 'yes' : 'no'  give?"
              options={["'no'", "true", "'yes'", "undefined"]}
              correct={2}
              explanation="10 > 5 is true, so the ternary returns the first value: 'yes'"
            />
          </div>
        ),
      },
    ],
    books: [
      { emoji: '📗', title: 'Eloquent JS Ch.2: Program Structure', author: 'Marijn Haverbeke', url: 'https://eloquentjavascript.net/02_program_structure.html' },
      { emoji: '🌐', title: 'MDN: if...else', author: 'Mozilla', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else' },
      { emoji: '📙', title: 'JS.info: Conditionals', author: 'javascript.info', url: 'https://javascript.info/ifelse' },
      { emoji: '📘', title: 'YDKJS: Types & Grammar', author: 'Kyle Simpson', url: 'https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/types-grammar/ch1.md' },
    ],
  },

  3: {
    title: 'Loops & Iteration',
    emoji: '🔄',
    intro: `Computers are incredibly fast at doing REPETITIVE tasks. Loops let you instruct the computer to repeat a block of code multiple times. Without loops, you'd have to write the same code hundreds of times!`,
    topics: [
      {
        emoji: '🔢',
        title: 'for Loop',
        subtitle: 'The most common loop — great for counting',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">A <code className="code-tag">for</code> loop has 3 parts: <strong className="text-primary-300">init</strong> → <strong className="text-yellow-300">condition</strong> → <strong className="text-emerald-300">update</strong></p>
            <LoopViz iterations={5} />
            <CodeBlock code={`// for (init; condition; update)
for (let i = 0; i < 5; i++) {
  console.log(\`Iteration \${i}\`);
}
// Output: 0, 1, 2, 3, 4

// Count down
for (let i = 10; i > 0; i--) {
  console.log(i);
}
// Output: 10, 9, 8... 1

// Loop through an array
const fruits = ["apple", "banana", "mango"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}`} />
            <MiniQuiz
              question="How many times does this loop run: for(let i=0; i<3; i++) ?"
              options={["2 times", "3 times", "4 times", "Forever"]}
              correct={1}
              explanation="i starts at 0, runs while i < 3. i=0, i=1, i=2 → 3 iterations."
            />
          </div>
        ),
      },
      {
        emoji: '🔁',
        title: 'while & do-while Loops',
        subtitle: 'Condition-based repetition',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">Use <code className="code-tag">while</code> when you don't know in advance how many iterations you'll need.</p>
            <CodeBlock code={`// while loop - checks condition BEFORE each run
let power = 1;
while (power < 100) {
  power *= 2;  // doubles each time
}
console.log(power); // 128

// do-while - runs AT LEAST once (checks AFTER)
let attempts = 0;
do {
  console.log("Trying...");
  attempts++;
} while (attempts < 3);

// ⚠️ INFINITE LOOP DANGER!
// while (true) { }  ← never ends! Browser freezes!
// Always make sure your condition eventually becomes false.`} />
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 mt-3">
              🚨 <strong>Infinite loops</strong> crash your browser! Always check that your loop variable changes toward ending the condition.
            </div>
          </div>
        ),
      },
      {
        emoji: '✨',
        title: 'for...of & for...in',
        subtitle: 'Modern, elegant iteration',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3"><code className="code-tag">for...of</code> iterates over <strong className="text-primary-300">values</strong> (arrays, strings). <code className="code-tag">for...in</code> iterates over <strong className="text-yellow-300">keys</strong> (objects).</p>
            <CodeBlock code={`// for...of - values of iterable
const numbers = [10, 20, 30];
for (const num of numbers) {
  console.log(num);   // 10, 20, 30
}

// Works on strings too!
for (const char of "Hello") {
  console.log(char);  // H, e, l, l, o
}

// for...in - keys of an object
const person = { name: "Alice", age: 25, city: "NY" };
for (const key in person) {
  console.log(\`\${key}: \${person[key]}\`);
}
// name: Alice
// age: 25
// city: NY`} />
          </div>
        ),
      },
      {
        emoji: '🛑',
        title: 'break & continue',
        subtitle: 'Controlling loop flow',
        content: (
          <div>
            <CodeBlock code={`// break - exits the loop entirely
for (let i = 0; i < 10; i++) {
  if (i === 5) break;  // stops at 5
  console.log(i);      // 0,1,2,3,4
}

// continue - skips the current iteration
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;  // skip even
  console.log(i);              // 1,3,5,7,9
}

// Real example: find first negative
const nums = [1, 3, -2, 5, -8];
let firstNeg = null;
for (const n of nums) {
  if (n < 0) { firstNeg = n; break; }
}
console.log(firstNeg); // -2`} />
            <MiniQuiz
              question="What does 'continue' do inside a loop?"
              options={["Stops the loop", "Skips the rest of the current iteration", "Restarts the loop", "Exits the function"]}
              correct={1}
              explanation="'continue' skips the remaining code for the current iteration and jumps to the next one. 'break' is what stops the loop."
            />
          </div>
        ),
      },
    ],
    books: [
      { emoji: '📗', title: 'Eloquent JS: Program Structure', author: 'Marijn Haverbeke', url: 'https://eloquentjavascript.net/02_program_structure.html' },
      { emoji: '🌐', title: 'MDN: Loops Guide', author: 'Mozilla', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration' },
      { emoji: '📙', title: 'JS.info: Loops — while and for', author: 'javascript.info', url: 'https://javascript.info/while-for' },
      { emoji: '🎓', title: 'CS50: Algorithms & Loops', author: 'Harvard CS50', url: 'https://cs50.harvard.edu/x/' },
    ],
  },

  4: {
    title: 'Functions — The Superpowers of Programming',
    emoji: '⚙️',
    intro: `Functions are the most important concept in programming. They let you GROUP code, REUSE it, and ABSTRACT complexity. Every program is built from functions. Understanding scope, closures and callbacks unlocks JavaScript's full power.`,
    topics: [
      {
        emoji: '🏗️',
        title: 'Function Declaration vs Expression vs Arrow',
        subtitle: 'Three ways to write functions',
        content: (
          <div>
            <CodeBlock code={`// 1. Function DECLARATION - hoisted (usable before definition)
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("Alice")); // works even if called before!

// 2. Function EXPRESSION - not hoisted
const greet2 = function(name) {
  return \`Hi, \${name}!\`;
};

// 3. ARROW function (modern, shorter)
const greet3 = (name) => \`Hey, \${name}!\`;

// Arrow with multiple statements
const add = (a, b) => {
  const result = a + b;
  return result;
};

// Arrow with single param (no parens needed)
const double = n => n * 2;

// Arrow with no params
const greetAll = () => "Hello everyone!";`} />
            <MiniQuiz
              question="Can you call a function BEFORE its declaration?"
              options={["Yes, only for function declarations", "Yes, for all types", "No, never", "Only for arrow functions"]}
              correct={0}
              explanation="Function declarations are 'hoisted' to the top. Function expressions and arrow functions are NOT hoisted."
            />
          </div>
        ),
      },
      {
        emoji: '🎯',
        title: 'Parameters, Arguments & Return Values',
        subtitle: 'How functions receive and send data',
        content: (
          <div>
            <MemoryDiagram vars={[
              { name: 'param: a', value: '5', type: 'input' },
              { name: 'param: b', value: '3', type: 'input' },
              { name: 'return', value: '8', type: 'output' },
            ]} />
            <CodeBlock code={`// Parameters are the placeholders in the definition
function add(a, b) {
  return a + b;  // return sends data back
}

// Arguments are the actual values passed in
const result = add(5, 3);  // 5 and 3 are arguments

// Default parameters (ES6+)
function greet(name = "friend") {
  return \`Hello, \${name}!\`;
}
greet();        // "Hello, friend!"
greet("Bob");   // "Hello, Bob!"

// Rest parameters - collect extra args
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4, 5); // 15

// Functions without return give undefined
function doSomething() { console.log("hi"); }
const x = doSomething(); // x is undefined`} />
          </div>
        ),
      },
      {
        emoji: '🔍',
        title: 'Scope & Closure',
        subtitle: 'Where variables live and how closures work',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3"><strong className="text-primary-300">Scope</strong> determines where a variable is visible. <strong className="text-yellow-300">Closure</strong> is when a function remembers the variables from where it was created.</p>
            <ScopeChain />
            <CodeBlock code={`// Closure example
function makeCounter() {
  let count = 0;  // this variable is "enclosed"

  return function() {
    count++;        // still has access!
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2  ← count is remembered!
counter(); // 3

// Each call to makeCounter creates a new closure
const counter2 = makeCounter();
counter2(); // 1 (separate count!)`} />
            <MiniQuiz
              question="What is a closure in JavaScript?"
              options={[
                "A syntax error",
                "A function that remembers variables from its outer scope",
                "A way to close the browser",
                "A sealed object",
              ]}
              correct={1}
              explanation="A closure is formed when an inner function 'closes over' the variables of its enclosing outer function — remembering them even after the outer function has returned."
            />
          </div>
        ),
      },
      {
        emoji: '🚀',
        title: 'Higher-Order Functions & Callbacks',
        subtitle: 'Functions that take or return other functions',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">A <strong className="text-primary-300">higher-order function</strong> takes a function as argument or returns a function. <strong className="text-yellow-300">Callbacks</strong> are functions passed as arguments.</p>
            <CodeBlock code={`// Callback example
function doAfterDelay(callback) {
  setTimeout(callback, 1000);
}
doAfterDelay(() => console.log("1 second later!"));

// Higher-order functions built into JS:
const nums = [1, 2, 3, 4, 5];

// map - transforms each element
const doubled = nums.map(n => n * 2);  // [2, 4, 6, 8, 10]

// filter - keeps elements where condition is true
const evens = nums.filter(n => n % 2 === 0); // [2, 4]

// reduce - collapses array to single value
const sum = nums.reduce((acc, n) => acc + n, 0); // 15

// Chaining them!
const result = nums
  .filter(n => n > 2)
  .map(n => n * 10)
  .reduce((acc, n) => acc + n, 0);
// filter: [3,4,5] → map: [30,40,50] → reduce: 120`} />
          </div>
        ),
      },
    ],
    books: [
      { emoji: '📗', title: 'Eloquent JS Ch.3: Functions', author: 'Marijn Haverbeke', url: 'https://eloquentjavascript.net/03_functions.html' },
      { emoji: '📘', title: "YDKJS: Scope & Closures", author: 'Kyle Simpson', url: 'https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch1.md' },
      { emoji: '🌐', title: 'MDN: Functions Guide', author: 'Mozilla', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' },
      { emoji: '📙', title: 'JS.info: Functions', author: 'javascript.info', url: 'https://javascript.info/function-basics' },
    ],
  },

  5: {
    title: 'Arrays & Objects — Data Treasure Chests',
    emoji: '📦',
    intro: `Primitive types can only hold ONE value. Arrays and Objects let you store COLLECTIONS of data. These are the most used data structures in JavaScript — mastering them unlocks the full power of the language.`,
    topics: [
      {
        emoji: '📋',
        title: 'Arrays — Ordered Lists',
        subtitle: 'Creating, accessing, and modifying arrays',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">An array is an <strong className="text-primary-300">ordered collection</strong> of items. Each item has an index starting at <code className="code-tag">0</code>.</p>
            <ArrayViz items={['🍎', '🍌', '🥭', '🍓', '🍇']} />
            <CodeBlock code={`// Creating arrays
const fruits = ["apple", "banana", "mango"];
const mixed  = [1, "hello", true, null, { key: "val" }];

// Accessing elements (0-indexed!)
fruits[0]  // "apple"
fruits[2]  // "mango"
fruits[fruits.length - 1]  // last item

// Modifying arrays
fruits.push("grape");     // add to end
fruits.pop();             // remove from end
fruits.unshift("kiwi");   // add to start
fruits.shift();           // remove from start

// Slicing (doesn't modify original)
fruits.slice(1, 3)        // items at index 1 & 2`} />
            <MiniQuiz
              question="What index is the LAST element of an array with 5 items?"
              options={["5", "4", "0", "6"]}
              correct={1}
              explanation="Arrays are 0-indexed. A 5-item array has indices 0,1,2,3,4. Last index = length - 1 = 4."
            />
          </div>
        ),
      },
      {
        emoji: '🔧',
        title: 'Powerful Array Methods',
        subtitle: 'map, filter, reduce, find, forEach, and more',
        content: (
          <div>
            <CodeBlock code={`const nums = [1, 2, 3, 4, 5, 6];

// map → transform each element
nums.map(n => n * n)         // [1,4,9,16,25,36]

// filter → keep matching elements  
nums.filter(n => n % 2 === 0) // [2,4,6]

// reduce → accumulate to one value
nums.reduce((sum, n) => sum + n, 0)  // 21

// find → first matching element
nums.find(n => n > 3)        // 4

// findIndex → index of first match
nums.findIndex(n => n > 3)   // 3

// some → any element matches?
nums.some(n => n > 5)        // true

// every → ALL elements match?
nums.every(n => n > 0)       // true

// includes → element exists?
nums.includes(3)             // true

// flat → flatten nested arrays
[1, [2, 3], [4, [5]]].flat() // [1,2,3,4,[5]]
[1, [2, [3]]].flat(Infinity)  // [1,2,3]

// spread → copy or merge
const copy = [...nums];
const merged = [...nums, 7, 8]; // [1..6, 7, 8]`} />
          </div>
        ),
      },
      {
        emoji: '🗂️',
        title: 'Objects — Key-Value Maps',
        subtitle: 'Structured data with named properties',
        content: (
          <div>
            <p className="text-sm text-slate-300 mb-3">Objects store data as <strong className="text-primary-300">key: value</strong> pairs. Keys are strings; values can be anything.</p>
            <CodeBlock code={`// Creating an object
const player = {
  name: "Alice",
  level: 5,
  xp: 1250,
  badges: ["first_blood", "streak_7"],
  greet() {           // method (function as value)
    return \`I'm \${this.name}!\`;
  }
};

// Accessing properties
player.name           // "Alice"     (dot notation)
player["level"]       // 5          (bracket notation)
player.greet()        // "I'm Alice!"

// Adding / modifying
player.rank = "Gold"; // add new property
player.xp = 1300;     // modify existing

// Deleting
delete player.rank;

// Checking existence
"name" in player      // true
player.hasOwnProperty("badges") // true`} />
          </div>
        ),
      },
      {
        emoji: '🎁',
        title: 'Destructuring, Spread & Rest',
        subtitle: 'Modern JS for cleaner code',
        content: (
          <div>
            <CodeBlock code={`// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3,4,5]

// Object destructuring
const { name, level, xp = 0 } = player;
// name="Alice", level=5, xp=1250 (or 0 if missing)

// Renaming in destructuring
const { name: playerName, level: playerLevel } = player;

// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1,2,3,4,5]

// Spread in objects (shallow clone)
const updated = { ...player, xp: 1500 };
// All player props, but xp overridden to 1500

// Rest in function params
function saveAll(id, ...scores) {
  console.log(id, scores);
}
saveAll("p1", 90, 85, 92); // "p1", [90,85,92]`} />
            <MiniQuiz
              question="What does const [a, , b] = [1, 2, 3] give you?"
              options={["a=1, b=2", "a=1, b=3", "a=0, b=2", "Error"]}
              correct={1}
              explanation="The empty comma skips index 1 (value 2). So a=1 from index 0, and b=3 from index 2."
            />
          </div>
        ),
      },
    ],
    books: [
      { emoji: '📗', title: 'Eloquent JS Ch.4: Data Structures', author: 'Marijn Haverbeke', url: 'https://eloquentjavascript.net/04_data.html' },
      { emoji: '🌐', title: 'MDN: Array Reference', author: 'Mozilla', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' },
      { emoji: '📙', title: 'JS.info: Arrays & Objects', author: 'javascript.info', url: 'https://javascript.info/data-types' },
      { emoji: '📘', title: "YDKJS: ES6 & Beyond", author: 'Kyle Simpson', url: 'https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/es6%20%26%20beyond/README.md' },
    ],
  },
};

/* ════════════════════════════════════════════
   MAIN THEORY PANEL COMPONENT
════════════════════════════════════════════ */
const TheoryPanel = ({ levelNum = 1 }) => {
  const data = LEVEL_THEORY[levelNum] || LEVEL_THEORY[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-primary-500/20"
        style={{ background: 'rgba(99,102,241,0.06)' }}>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{data.emoji}</span>
          <div>
            <div className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Chapter {levelNum} Theory</div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">{data.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{data.intro}</p>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-4 h-0.5 bg-primary-500 rounded" /> Topics in this chapter
        </h3>
        {data.topics.map((topic, i) => (
          <TopicItem key={i} topic={topic} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Reference Books */}
      <ReferenceBooks books={data.books} />
    </div>
  );
};

export default TheoryPanel;
