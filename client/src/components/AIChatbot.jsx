import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Loader2, Bot, Minimize2 } from 'lucide-react';

const KB = {
  // Variables
  variable: "**Variables** store data. In JS use `const` (never changes), `let` (can change), or `var` (old way, avoid).\n```js\nconst name = 'Alice'; // never reassigned\nlet age = 25;         // can change\nage = 26;             // ✅ ok\n```",
  const: "**const** declares a constant — a value that won't be reassigned. Use it by default!\n```js\nconst PI = 3.14159;\n// PI = 3; ❌ TypeError!\n```",
  let: "**let** declares a block-scoped variable that CAN be reassigned.\n```js\nlet count = 0;\ncount++; // count is now 1\n```",
  // Data types
  type: "JavaScript has 7 primitive types:\n- `string` — text: `'hello'`\n- `number` — int or float: `42`, `3.14`\n- `boolean` — `true` / `false`\n- `null` — intentional empty\n- `undefined` — not yet assigned\n- `symbol` — unique value\n- `bigint` — huge integers\n\nAnd 1 object type: `object` (arrays, functions, objects)",
  string: "**Strings** are text. Use template literals for embedding values:\n```js\nconst name = 'Quest';\nconst msg = `Hello, ${name}!`; // 'Hello, Quest!'\n```\nUseful methods: `.toUpperCase()`, `.slice()`, `.includes()`, `.split()`, `.trim()`",
  array: "**Arrays** are ordered lists:\n```js\nconst nums = [1, 2, 3];\nnums.push(4);        // add to end\nnums.pop();          // remove from end\nnums.map(n => n*2);  // [2,4,6]\nnums.filter(n=>n>1); // [2,3]\nnums.find(n=>n>2);   // 3\n```",
  object: "**Objects** store key-value pairs:\n```js\nconst user = { name: 'Alex', age: 20 };\nconsole.log(user.name);     // 'Alex'\nconsole.log(user['age']);   // 20\n\n// Destructuring:\nconst { name, age } = user;\n```",
  // Functions
  function: "**Functions** are reusable code blocks:\n```js\n// Declaration\nfunction greet(name) { return `Hi, ${name}!`; }\n\n// Arrow function\nconst greet = (name) => `Hi, ${name}!`;\n\n// Default parameters\nconst add = (a, b = 0) => a + b;\n```",
  arrow: "**Arrow functions** are shorter function syntax:\n```js\n// Traditional\nfunction double(x) { return x * 2; }\n\n// Arrow (implicit return when no braces)\nconst double = x => x * 2;\n\n// Multi-line arrow\nconst add = (a, b) => {\n  const sum = a + b;\n  return sum;\n};\n```",
  closure: "**Closures** — a function that remembers its surrounding scope:\n```js\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count; // remembers `count`!\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2\n```\nClosures power module patterns, memoization, and event handlers.",
  // Loops
  loop: "**Loops** repeat code:\n```js\n// For loop\nfor (let i = 0; i < 5; i++) console.log(i);\n\n// While\nlet n = 0;\nwhile (n < 3) { console.log(n); n++; }\n\n// For...of (arrays)\nfor (const item of [1,2,3]) console.log(item);\n\n// Array methods (preferred)\n[1,2,3].forEach(n => console.log(n));\n```",
  // Conditionals
  conditional: "**Conditionals** control flow:\n```js\nif (score >= 90) {\n  grade = 'A';\n} else if (score >= 70) {\n  grade = 'B';\n} else {\n  grade = 'C';\n}\n\n// Ternary (one line)\nconst grade = score >= 90 ? 'A' : 'B';\n\n// Nullish coalescing\nconst name = user?.name ?? 'Guest';\n```",
  // Async
  async: "**Async/Await** — write async code that looks synchronous:\n```js\nasync function getData() {\n  try {\n    const res = await fetch('https://api.example.com/data');\n    const json = await res.json();\n    return json;\n  } catch (err) {\n    console.error('Error:', err);\n  }\n}\n```\n`await` pauses until the Promise resolves.",
  promise: "**Promises** represent future values:\n```js\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve('Done! ✅'), 1000);\n});\n\np.then(val => console.log(val))\n .catch(err => console.error(err));\n```\nChain `.then()` calls or use `async/await` instead.",
  fetch: "**Fetch API** makes HTTP requests:\n```js\nconst data = await fetch('https://api.example.com')\n  .then(res => {\n    if (!res.ok) throw new Error('Network error');\n    return res.json();\n  });\n```\nAlways check `res.ok` before calling `.json()`!",
  // DOM
  dom: "**DOM** (Document Object Model) — JavaScript's interface to HTML:\n```js\n// Select elements\nconst el = document.querySelector('#myId');\nconst all = document.querySelectorAll('.myClass');\n\n// Modify\nel.textContent = 'Hello!';\nel.style.color = 'red';\nel.classList.add('active');\n\n// Create & append\nconst div = document.createElement('div');\ndocument.body.appendChild(div);\n```",
  event: "**Events** respond to user actions:\n```js\nconst btn = document.querySelector('#btn');\n\nbtn.addEventListener('click', (e) => {\n  console.log('Clicked!', e.target);\n});\n\n// Common events: click, keydown, submit, input, scroll, mouseover\n```",
  // React
  react: "**React** is a UI library for building component-based interfaces:\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0); // state\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(c => c+1)}>+</button>\n    </div>\n  );\n}\n```",
  usestate: "**useState** hook manages component state:\n```jsx\nconst [value, setValue] = useState(initialValue);\n\n// Update (triggers re-render)\nsetValue(newValue);\n// Functional update (safe for derived values)\nsetValue(prev => prev + 1);\n```\nState is local to each component instance.",
  useeffect: "**useEffect** runs side effects after render:\n```jsx\nuseEffect(() => {\n  // runs after every render\n}, []); // [] = run only once (on mount)\n\nuseEffect(() => {\n  // runs when `id` changes\n  fetchData(id);\n}, [id]);\n```\nReturn a cleanup function to avoid memory leaks.",
  // General
  error: "Common JS errors:\n- `TypeError` — wrong type (e.g. calling undefined as function)\n- `ReferenceError` — variable doesn't exist\n- `SyntaxError` — code can't be parsed\n- `RangeError` — value out of allowed range\n\n🛠️ Fix tip: Read the error message carefully — it tells you the LINE and what went wrong!",
  git: "**Git basics:**\n```bash\ngit init            # Start repo\ngit add .           # Stage all files\ngit commit -m 'msg' # Commit\ngit push            # Push to remote\ngit pull            # Get latest\ngit branch feature  # New branch\ngit checkout main   # Switch branch\n```",
  debug: "**Debugging tips:**\n1. `console.log()` variables to inspect them\n2. Use browser DevTools → Sources → set breakpoints\n3. Check the Console tab for errors (red text)\n4. Add `debugger;` statement to pause execution\n5. Read the error message FULLY — the line number is there!\n6. Comment out sections to isolate the problem",
  hello: "Hey! 👋 I'm **CodeBot**, your coding assistant!\n\nAsk me about:\n- JavaScript (variables, functions, arrays, async...)\n- CSS & HTML\n- React hooks (useState, useEffect)\n- Git commands\n- Error debugging\n- Project-specific questions\n\nWhat can I help you with? 🚀",
  hi: "Hey there! 👋 I'm **CodeBot**! Ask me any coding question and I'll do my best to help. What are you working on? 🛠️",
  default: "Hmm, I'm not sure about that specific topic yet. 🤔 But try asking about:\n- **Variables, functions, arrays**\n- **Async/await, Promises, Fetch**\n- **React: useState, useEffect**\n- **DOM manipulation**\n- **Debugging tips, Git**\n\nOr describe what you're trying to build and I'll guide you! 💪"
};

function getResponse(input) {
  const q = input.toLowerCase();
  for (const [key, val] of Object.entries(KB)) {
    if (key !== 'default' && q.includes(key)) return val;
  }
  // Extra keyword matches
  if (q.includes('how') && q.includes('function')) return KB.function;
  if (q.includes('what is') && q.includes('react')) return KB.react;
  if (q.includes('explain') && q.includes('closure')) return KB.closure;
  if (q.includes('fix') || q.includes('bug') || q.includes('not working')) return KB.debug;
  if (q.includes('deploy') || q.includes('vercel') || q.includes('github')) return KB.git;
  return KB.default;
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! 👋 I'm **CodeBot** — your AI coding assistant!\n\nAsk me anything about JavaScript, React, CSS, debugging, or any project you're building!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const send = () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: getResponse(userMsg) }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('```')) return null;
      if (line.startsWith('- ')) return <div key={i} className="text-xs text-slate-400 my-0.5 ml-2">• {line.slice(2).replace(/\*\*(.*?)\*\*/g, (_, b) => b)}</div>;
      const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-xs text-slate-300 leading-relaxed my-0.5">
          {parts.map((p, j) => {
            if (p.startsWith('**') && p.endsWith('**')) return <strong key={j} className="text-white font-bold">{p.slice(2,-2)}</strong>;
            if (p.startsWith('`') && p.endsWith('`')) return <code key={j} className="bg-dark-900 px-1 rounded text-yellow-300 font-mono text-[10px]">{p.slice(1,-1)}</code>;
            return p;
          })}
        </p>
      );
    });
  };

  const SUGGESTIONS = ['What is a variable?', 'Explain closures', 'How does useState work?', 'Common JS errors'];

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl shadow-primary-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
        {open ? <X size={22} className="text-white" /> : <Bot size={22} className="text-white" />}
        {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-dark-800 animate-pulse" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          style={{ border: '1px solid rgba(99,102,241,0.3)', background: '#1a1a2e' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))' }}>
            <div className="w-8 h-8 rounded-full bg-primary-500/30 border border-primary-500/50 flex items-center justify-center">
              <Bot size={16} className="text-primary-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">CodeBot 🤖</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Online — ask me anything!
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-slate-500 hover:text-slate-300 transition-colors">
              <Minimize2 size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto px-3 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-primary-500/30 border border-primary-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={12} className="text-primary-300" />
                  </div>
                )}
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 ${msg.role === 'user'
                  ? 'bg-primary-600/80 text-white ml-8'
                  : 'bg-dark-600/80 border border-dark-400/30'}`}>
                  {msg.role === 'user'
                    ? <p className="text-xs text-white">{msg.text}</p>
                    : renderText(msg.text)
                  }
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-primary-300" />
                </div>
                <div className="bg-dark-600/80 border border-dark-400/30 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => { setInput(s); }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/20 hover:border-primary-400/40 transition-all">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 px-3 py-3 border-t border-dark-400/30">
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a coding question..."
              className="flex-1 bg-dark-600/50 border border-dark-400/40 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500/50" />
            <button onClick={send} disabled={!input.trim() || typing}
              className="p-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 transition-all">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
