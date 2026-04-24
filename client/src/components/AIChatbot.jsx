import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../api/axios';

// ============ CONSTANTS ============
const SUGGESTIONS = [
  { label: '🔄 JS Closures', text: 'Explain JavaScript closures with a simple example' },
  { label: '🐍 Python vs JS', text: 'What are the main differences between Python and JavaScript?' },
  { label: '🔗 SQL Joins', text: 'Explain SQL joins with examples' },
  { label: '📊 DSA Roadmap', text: 'Give me a complete DSA learning roadmap for beginners' },
  { label: '⚛️ React Hooks', text: 'Explain React useState and useEffect with examples' },
  { label: '🐛 Debug Code', text: 'I have a bug in my code, can you help me fix it?' },
  { label: '🏗️ OOP Concepts', text: 'Explain OOP concepts: classes, inheritance, polymorphism in Python' },
  { label: '⚡ Async/Await', text: 'How does async/await work in JavaScript?' },
];

const LANGUAGE_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', java: '#ed8b00',
  'c++': '#00599c', html: '#e34f26', css: '#1572b6',
  react: '#61dafb', typescript: '#3178c6', sql: '#4479a1',
  default: '#00ffff'
};

const detectLanguage = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('python')) return 'python';
  if (lower.includes('javascript') || /\bjs\b/.test(lower)) return 'javascript';
  if (lower.includes('typescript') || /\bts\b/.test(lower)) return 'typescript';
  if (lower.includes('html')) return 'html';
  if (lower.includes('css')) return 'css';
  if (lower.includes('react')) return 'react';
  if (lower.includes('sql')) return 'sql';
  if (lower.includes('java') && !lower.includes('javascript')) return 'java';
  if (lower.includes('c++') || lower.includes('cpp')) return 'c++';
  if (lower.includes('node')) return 'node.js';
  return null;
};

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ============ CODE BLOCK RENDERER ============
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid rgba(0,255,255,0.2)',
      borderRadius: '8px',
      margin: '8px 0',
      overflow: 'hidden',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 12px', background: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span style={{
          fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em',
          color: LANGUAGE_COLORS[language?.toLowerCase()] || '#00ffff', fontWeight: 600
        }}>
          {language || 'code'}
        </span>
        <button onClick={handleCopy} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '4px', color: copied ? '#10b981' : '#9ca3af',
          fontSize: '0.65rem', padding: '2px 8px', cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        margin: 0, padding: '12px', overflowX: 'auto',
        fontSize: '0.82rem', lineHeight: '1.6',
        color: '#e6edf3', whiteSpace: 'pre'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ============ MESSAGE RENDERER ============
const MessageContent = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div style={{ lineHeight: '1.65', fontSize: '0.88rem' }}>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const inner = part.slice(3, -3);
          const firstNewline = inner.indexOf('\n');
          const lang = firstNewline > 0 ? inner.slice(0, firstNewline).trim() : '';
          const code = firstNewline > 0 ? inner.slice(firstNewline + 1) : inner;
          return <CodeBlock key={i} code={code} language={lang} />;
        }

        // Process inline formatting
        const lines = part.split('\n');
        return (
          <div key={i}>
            {lines.map((line, j) => {
              if (!line.trim()) return <div key={j} style={{ height: '8px' }} />;

              // Bold **text**
              const rendered = line.split(/(\*\*.*?\*\*|`[^`]+`)/g).map((seg, k) => {
                if (seg.startsWith('**') && seg.endsWith('**')) {
                  return <strong key={k} style={{ color: '#00ffff', fontWeight: 700 }}>{seg.slice(2, -2)}</strong>;
                }
                if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2) {
                  return (
                    <code key={k} style={{
                      background: 'rgba(0,255,255,0.1)', color: '#00ff88',
                      padding: '1px 5px', borderRadius: '3px', fontSize: '0.82rem',
                      fontFamily: 'monospace'
                    }}>{seg.slice(1, -1)}</code>
                  );
                }
                return <span key={k}>{seg}</span>;
              });

              // Numbered list
              if (/^\d+\.\s/.test(line)) {
                return (
                  <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: '#7c3aed', fontWeight: 700, minWidth: '20px' }}>
                      {line.match(/^\d+/)[0]}.
                    </span>
                    <span>{line.replace(/^\d+\.\s/, '')}</span>
                  </div>
                );
              }

              // Bullet list
              if (line.startsWith('- ') || line.startsWith('* ')) {
                return (
                  <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: '#00ffff' }}>▸</span>
                    <span>{rendered.map((r, ri) => typeof r === 'string' ? r.replace(/^[-*]\s/, '') : r)}</span>
                  </div>
                );
              }

              return <div key={j} style={{ marginBottom: '3px' }}>{rendered}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// ============ TYPING INDICATOR ============
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>CodeBot is thinking</span>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: '#7c3aed',
        animation: 'cqDotBounce 1.2s ease-in-out infinite',
        animationDelay: `${i * 0.2}s`
      }} />
    ))}
    <style>{`
      @keyframes cqDotBounce {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1.3); opacity: 1; }
      }
      @keyframes cqSlideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes cqPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
        50% { box-shadow: 0 0 0 8px rgba(124,58,237,0); }
      }
      @keyframes cqFabGlow {
        0%, 100% { box-shadow: 0 4px 20px rgba(124,58,237,0.5), 0 0 0 0 rgba(124,58,237,0.3); }
        50% { box-shadow: 0 4px 30px rgba(124,58,237,0.8), 0 0 0 6px rgba(124,58,237,0); }
      }
    `}</style>
  </div>
);

// ============ MAIN CHATBOT COMPONENT ============
export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: `⚔️ **Welcome to CodeBot — Your AI Coding Tutor!**\n\nI'm powered by Llama 3.3 70B and ready to help you conquer any coding challenge.\n\n**I can help you with:**\n- JavaScript, Python, Java, C++, HTML, CSS\n- React, Node.js, TypeScript, SQL\n- Data Structures & Algorithms\n- Debugging your code\n- OOP, DBMS, OS, Computer Networks\n\nAsk me anything or pick a suggestion below! 🚀`,
      timestamp: new Date()
    }
  ]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Update unread count when closed
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages]);

  // Clear unread when opened
  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  // Language detection while typing
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    const lang = detectLanguage(val);
    if (lang) setCurrentLang(lang);
  };

  const sendMessage = useCallback(async (messageText) => {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    // Detect language
    let lang = detectLanguage(text);
    if (!lang && conversationHistory.length > 0) {
      const lastUser = [...conversationHistory].reverse().find(m => m.role === 'user');
      if (lastUser) lang = detectLanguage(lastUser.content);
    }
    if (lang) setCurrentLang(lang);

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text,
      timestamp: new Date(),
      language: lang
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const newHistory = [...conversationHistory, { role: 'user', content: text }];
    setConversationHistory(newHistory);

    try {
      const response = await api.post('/ai-chat/chat', {
        message: text,
        history: conversationHistory
      }, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });

      const reply = response.data.reply;

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: reply }]);

    } catch (error) {
      let errorText = 'Sorry, I encountered an error. Please try again! 🔧';

      if (error.response?.status === 429) {
        errorText = '⏳ Too many requests! Please wait a moment before sending another message.';
      } else if (error.response?.status === 503) {
        errorText = '🔄 AI service is temporarily busy. Please try again in a few seconds.';
      } else if (error.code === 'ECONNABORTED') {
        errorText = '⏱️ Request timed out. The AI is taking too long. Please try again.';
      } else if (error.response?.data?.error) {
        errorText = `❌ ${error.response.data.error}`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: errorText,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading, conversationHistory]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      text: '🔄 Chat cleared! Ready for your next coding question. What would you like to learn? ⚡',
      timestamp: new Date()
    }]);
    setConversationHistory([]);
    setCurrentLang(null);
  };

  // ============ RENDER ============
  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => { setIsOpen(prev => !prev); setIsMinimized(false); }}
        style={{
          position: 'fixed', bottom: '16px', right: '16px', zIndex: 9998,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          border: 'none', cursor: 'pointer', color: 'white',
          fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
          animation: 'cqFabGlow 2s ease-in-out infinite',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="CodeBot AI Tutor"
      >
        {isOpen ? '✕' : '🤖'}
        {!isOpen && unreadCount > 0 && (
          <div style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#ef4444', color: 'white', borderRadius: '50%',
            width: '20px', height: '20px', fontSize: '0.65rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, border: '2px solid #0a0a1a'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          style={{
            position: 'fixed', bottom: '84px', right: '16px', left: 'auto', zIndex: 9999,
            width: 'min(420px, calc(100vw - 32px))',
            maxWidth: '420px',
            height: isMinimized ? '60px' : 'min(600px, calc(100vh - 104px))',
            background: '#0f1117',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.2)',
            display: 'flex', flexDirection: 'column',
            animation: 'cqSlideIn 0.25s ease-out',
            transition: 'height 0.3s ease'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 14px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))',
            borderBottom: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '10px',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0
              }}>🤖</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'monospace' }}>
                  CodeBot
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: isLoading ? '#f59e0b' : '#10b981',
                    animation: isLoading ? 'cqPulse 1s infinite' : 'none'
                  }} />
                  <span style={{ color: isLoading ? '#f59e0b' : '#10b981', fontSize: '0.72rem' }}>
                    {isLoading ? 'Thinking...' : 'Online — ask me anything!'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {currentLang && (
                <span style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: `1px solid ${LANGUAGE_COLORS[currentLang] || '#00ffff'}`,
                  borderRadius: '12px', padding: '2px 8px',
                  fontSize: '0.65rem', color: LANGUAGE_COLORS[currentLang] || '#00ffff',
                  fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {currentLang}
                </span>
              )}
              <button onClick={clearChat} title="Clear chat" style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', color: '#9ca3af', padding: '4px 8px',
                cursor: 'pointer', fontSize: '0.7rem', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#9ca3af'; }}
              >
                🗑️ Clear
              </button>
              <button onClick={() => setIsMinimized(p => !p)} title={isMinimized ? 'Expand' : 'Minimize'} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', color: '#9ca3af', padding: '4px 8px',
                cursor: 'pointer', fontSize: '0.8rem'
              }}>
                {isMinimized ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent'
              }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    gap: '8px', alignItems: 'flex-start',
                    animation: 'cqSlideIn 0.2s ease-out'
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem'
                      }}>🤖</div>
                    )}
                    <div style={{
                      maxWidth: 'min(85%, 100%)',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                        : msg.isError ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                      border: msg.role === 'user' ? 'none'
                        : msg.isError ? '1px solid rgba(239,68,68,0.3)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      padding: '10px 13px',
                      color: msg.role === 'user' ? 'white' : '#e2e8f0',
                    }}>
                      {msg.role === 'user' ? (
                        <div style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>{msg.text}</div>
                      ) : (
                        <MessageContent text={msg.text} />
                      )}
                      <div style={{
                        fontSize: '0.65rem', marginTop: '5px', opacity: 0.5,
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                        color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#6b7280'
                      }}>
                        {formatTime(new Date(msg.timestamp))}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0
                    }}>🤖</div>
                    <div style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '4px 16px 16px 16px', padding: '12px 14px'
                    }}>
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div style={{
                  padding: '6px 12px 4px', borderTop: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', flexWrap: 'wrap', gap: '5px', flexShrink: 0
                }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s.text)} style={{
                      background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: '12px', color: '#a78bfa', padding: '4px 10px',
                      fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.2s',
                      fontFamily: 'monospace'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.25)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.color = '#a78bfa'; }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div style={{
                padding: '10px 12px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(0,0,0,0.3)',
                flexShrink: 0
              }}>
                <div style={{
                  display: 'flex', gap: '8px', alignItems: 'flex-end',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: '12px', padding: '8px 12px',
                  transition: 'border-color 0.2s'
                }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a coding question... (Enter to send, Shift+Enter for newline)"
                    disabled={isLoading}
                    rows={1}
                    style={{
                      flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none',
                      color: 'white', fontSize: '0.85rem', lineHeight: '1.5',
                      resize: 'none', fontFamily: 'inherit', maxHeight: '100px',
                      scrollbarWidth: 'none'
                    }}
                    onInput={e => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    style={{
                      background: isLoading || !input.trim()
                        ? 'rgba(124,58,237,0.3)'
                        : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      border: 'none', borderRadius: '8px',
                      width: '34px', height: '34px', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                      color: 'white', fontSize: '1rem', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', flexShrink: 0
                    }}
                  >
                    {isLoading ? '⏳' : '➤'}
                  </button>
                </div>
                <div style={{
                  textAlign: 'center', marginTop: '5px',
                  fontSize: '0.62rem', color: '#4b5563'
                }}>
                  Powered by Llama 3.3 70B via Groq ⚡
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
