import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import {
  Send, Users, Wifi, WifiOff, Loader2, Smile,
  Home, Trophy, Code2, Star, Calendar, Newspaper,
  MessageSquare, FileText, Hash,
} from 'lucide-react';
import CommunityForum from '../components/CommunityForum';

/* ── Constants ────────────────────────────────────────────────────────── */
const CHAT_ROOMS = [
  { id: 'general',      label: 'General',      emoji: '💬', desc: 'Anything goes!' },
  { id: 'javascript',   label: 'JavaScript',   emoji: '🟡', desc: 'JS questions & tips' },
  { id: 'python',       label: 'Python',       emoji: '🐍', desc: 'Python help & projects' },
  { id: 'project-help', label: 'Project Help', emoji: '🛠️', desc: 'Get unstuck on projects' },
  { id: 'react',        label: 'React',        emoji: '⚛️', desc: 'React & frontend chat' },
  { id: 'doubts',       label: 'Doubts',       emoji: '🤔', desc: 'Ask anything!' },
  { id: 'memes',        label: 'Memes',        emoji: '😂', desc: 'Fun & laughs' },
];

const NAV_ITEMS = [
  { id: 'forum',     label: 'Forum',           icon: FileText },
  { id: 'chat',      label: 'Live Chat',       icon: MessageSquare },
  { id: 'leaderboard', label: 'Leaderboard',   icon: Trophy },
  { id: 'showcase',  label: 'Project Showcase', icon: Code2 },
  { id: 'project-tutorials-completed', label: 'Project Tutorials Completed', icon: FileText },
  { id: 'projects-built', label: 'Projects Built', icon: Code2 },
  { id: 'challenge', label: 'Monthly Challenge', icon: Star },
];

const NEWS = [
  { emoji: '🚀', title: 'New AI Projects Added', date: 'Today', desc: 'Build your own chatbot & image classifier!' },
  { emoji: '🏆', title: 'Monthly Challenge is Live', date: 'Mar 2026', desc: 'Build a real-time dashboard and win XP prizes.' },
  { emoji: '📚', title: 'Theory Revamp', date: 'This Week', desc: 'Levels 1-6 now have interactive quizzes and a completion certificate.' },
];

const EVENTS = [
  { emoji: '⚡', title: 'Code Sprint', date: 'Apr 5', time: '8 PM IST' },
  { emoji: '🎙️', title: 'Ask Me Anything', date: 'Apr 12', time: '7 PM IST' },
  { emoji: '🤝', title: 'Team Hackathon', date: 'Apr 19', time: 'All Day' },
];

const RANK_COLORS = {
  Bronze: 'text-amber-700', Silver: 'text-slate-300', Gold: 'text-yellow-400',
  Platinum: 'text-cyan-300', Diamond: 'text-blue-300',
};

const EMOJIS = ['😄','😂','🔥','💡','🚀','👏','❤️','⭐','🎉','🤔','💪','😅','🐛','✅','📚'];

/* ── Live Chat Panel ──────────────────────────────────────────────────── */
const LiveChat = ({ activeRoom, onRoomChange }) => {
  const { user } = useAuth();
  const [socket, setSocket]         = useState(null);
  const [connected, setConnected]   = useState(false);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping]         = useState('');
  const [showEmoji, setShowEmoji]   = useState(false);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const getRank = (xp = 0) => {
    if (xp >= 2000) return 'Diamond';
    if (xp >= 1000) return 'Platinum';
    if (xp >= 500)  return 'Gold';
    if (xp >= 200)  return 'Silver';
    return 'Bronze';
  };

  const timeStr = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    if (!user) return;

    setConnecting(true);
    setError('');

    try {
      const newSocket = io('http://localhost:5000', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        auth: {
          token: localStorage.getItem('token'),
          username: user.username,
          userId: user._id,
          avatar: user.avatar?.character === 'explorer' ? '🧑‍💻' : '🎮'
        }
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Chat connected');
        setConnected(true);
        setConnecting(false);
        setError('');
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Chat disconnected');
        setConnected(false);
      });

      newSocket.on('chat:message', (msg) => {
        if (msg) {
          setMessages(m => [...m, msg]);
        }
      });

      newSocket.on('chat:history', (msgs) => {
        if (Array.isArray(msgs)) {
          setMessages(msgs);
        }
      });

      newSocket.on('chat:online', (users) => {
        if (Array.isArray(users)) {
          setOnlineUsers(users);
        }
      });

      newSocket.on('chat:typing', ({ username }) => {
        if (username) {
          setTyping(`${username} is typing...`);
          setTimeout(() => setTyping(''), 2000);
        }
      });

      newSocket.on('error', (errorMsg) => {
        console.error('Socket error:', errorMsg);
        setError(errorMsg || 'Connection error');
      });

      newSocket.on('connect_error', (err) => {
        console.error('Connection error:', err);
        setError('Failed to connect to chat server');
        setConnecting(false);
      });

      return () => {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('chat:message');
        newSocket.off('chat:history');
        newSocket.off('chat:online');
        newSocket.off('chat:typing');
        newSocket.off('error');
        newSocket.off('connect_error');
        newSocket.disconnect();
      };
    } catch (err) {
      console.error('Socket setup error:', err);
      setError('Failed to setup chat connection');
      setConnecting(false);
    }
  }, [user]);

  useEffect(() => {
    if (socket && connected && user) {
      socket.emit('chat:join', {
        room: activeRoom,
        username: user.username,
        userId: user._id,
        avatar: user.avatar?.character === 'explorer' ? '🧑‍💻' : '🎮',
        rank: getRank(user.xp || 0),
      });
      setMessages([]);
      setError('');
    }
  }, [activeRoom, socket, connected, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !connected || !user) {
      return;
    }
    try {
      socket.emit('chat:send', {
        room: activeRoom,
        text: input.trim(),
        userId: user._id,
        username: user.username
      });
      setInput('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const currentRoom = CHAT_ROOMS.find(r => r.id === activeRoom);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-center px-8">
        <div>
          <div className="text-5xl mb-4">🔐</div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">Please Login</h3>
          <p className="text-slate-500 mb-4">You need to be logged in to use the chat.</p>
          <a href="/login" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-bold text-white transition-all inline-block">
            Go to Login →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* Room header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-400/20 bg-dark-800/50 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{currentRoom?.emoji}</span>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">#{currentRoom?.label}</h3>
            <p className="text-[11px] text-slate-500">{currentRoom?.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Users size={12} />
            <span>{onlineUsers.length} online</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            connecting ? 'text-yellow-400' : connected ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {connecting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Connecting...
              </>
            ) : connected ? (
              <>
                <Wifi size={13} />
                Live
              </>
            ) : (
              <>
                <WifiOff size={13} />
                Offline
              </>
            )}
          </div>
        </div>
      </div>

      {/* Room selector */}
      <div className="flex gap-1 px-3 py-2 border-b border-dark-400/20 flex-shrink-0 overflow-x-auto scrollbar-thin scrollbar-thumb-dark-500 scrollbar-track-dark-700">
        {CHAT_ROOMS.map(r => (
          <button key={r.id} onClick={() => onRoomChange(r.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              activeRoom === r.id
                ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-dark-700/50'
            }`}>
            <span>{r.emoji}</span>
            <span>#{r.label}</span>
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1" style={{ scrollBehavior: 'smooth' }}>
        {!connected && !connecting && (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">❌</div>
            <p className="text-slate-400 font-semibold">Connection Lost</p>
            <p className="text-slate-600 text-xs mt-1">Attempting to reconnect...</p>
          </div>
        )}

        {connecting && messages.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🔄</div>
            <p className="text-slate-400 font-semibold">Connecting to chat...</p>
            <p className="text-slate-600 text-xs mt-1">Please wait a moment</p>
          </div>
        )}

        {messages.length === 0 && connected && !connecting && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">{currentRoom?.emoji}</div>
            <p className="text-slate-400 font-semibold">Welcome to #{currentRoom?.label}!</p>
            <p className="text-slate-600 text-xs mt-1">Be the first to say hi 👋</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const showHeader = !prev || prev.username !== msg.username || (new Date(msg.createdAt) - new Date(prev.createdAt) > 60000);

          if (msg.type === 'join' || msg.type === 'leave' || msg.type === 'system') {
            return (
              <div key={msg._id || i} className="text-center py-0.5">
                <span className="text-[10px] text-slate-700 bg-dark-700/50 px-3 py-1 rounded-full">{msg.text}</span>
              </div>
            );
          }

          return (
            <div key={msg._id || i} className={`flex gap-3 ${showHeader ? 'mt-3' : 'hover:bg-dark-700/20 rounded-lg px-2'}`}>
              {showHeader ? (
                <div className="w-8 h-8 rounded-full bg-dark-500 border border-dark-400/40 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                  {msg.avatar || '🧑‍💻'}
                </div>
              ) : (
                <div className="w-8 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                {showHeader && (
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-slate-200">{msg.username}</span>
                    {msg.rank && msg.rank !== 'System' && (
                      <span className={`text-[10px] font-bold ${RANK_COLORS[msg.rank] || 'text-slate-500'}`}>
                        {msg.rank}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-600 ml-1">{timeStr(msg.createdAt)}</span>
                  </div>
                )}
                <p className="text-sm text-slate-400 leading-relaxed break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {typing && connected && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 italic mt-1 px-2">
            <div className="flex gap-0.5">{[0, 1, 2].map(i => (
              <span key={i} className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}</div>
            {typing}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-dark-400/20 bg-dark-800/50 flex-shrink-0">
        {connecting && (
          <div className="flex items-center gap-2 text-xs text-yellow-400 mb-2">
            <Loader2 size={12} className="animate-spin" /> Connecting to chat server...
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input ref={inputRef} value={input}
              onChange={e => {
                setInput(e.target.value);
                if (socket && connected) {
                  socket.emit('chat:typing', { room: activeRoom });
                }
              }}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder={connected ? `Message #${currentRoom?.label}...` : 'Connecting...'}
              disabled={!connected || connecting}
              className="w-full pr-10 pl-4 py-2.5 bg-dark-600/50 border border-dark-400/40 rounded-xl text-sm text-slate-300
                         placeholder-slate-600 focus:outline-none focus:border-primary-500/50 disabled:opacity-50 transition-colors" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button onClick={() => setShowEmoji(!showEmoji)} className="text-slate-500 hover:text-slate-300 transition-colors p-1" disabled={!connected || connecting}>
                <Smile size={15} />
              </button>
              {showEmoji && (
                <div className="absolute bottom-8 right-0 bg-dark-600 border border-dark-400/50 rounded-xl p-2 flex flex-wrap w-44 gap-1 z-10">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => {
                      setInput(i => i + e);
                      setShowEmoji(false);
                      inputRef.current?.focus();
                    }}
                      className="text-lg hover:scale-125 transition-transform">{e}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={sendMessage} disabled={!input.trim() || !connected || connecting}
            className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0">
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-slate-700 mt-1.5 text-center">Enter to send • Be kind and helpful 💙</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════ */
/*  MAIN COMMUNITY PAGE                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
const CommunityPage = () => {
  const [activeNav, setActiveNav]   = useState('forum');
  const [chatRoom, setChatRoom]     = useState('general');

  const navIcon = (item) => {
    const Icon = item.icon;
    return <Icon size={15} />;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">

      {/* ─── LEFT SIDEBAR ─────────────────────────────────────────────── */}
      <div className="w-56 flex-shrink-0 border-r border-dark-400/20 bg-dark-800/70 flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-dark-400/15">
          <h2 className="font-black text-slate-100 text-sm flex items-center gap-2">
            <span className="text-lg">🌐</span> Community
          </h2>
          <p className="text-[11px] text-slate-600 mt-0.5">Connect with learners</p>
        </div>

        {/* Navigation */}
        <div className="p-3">
          <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Sections</div>
          <div className="space-y-0.5">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActiveNav(item.id)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs font-semibold flex items-center gap-2.5 ${
                  activeNav === item.id
                    ? 'bg-primary-600/20 border border-primary-500/25 text-primary-300'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-dark-600/50'
                }`}>
                {navIcon(item)}
                {item.label}
              </button>
            ))}
          </div>

          {/* Channels */}
          <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2 mt-4">Channels</div>
          <div className="space-y-0.5">
            {CHAT_ROOMS.map(r => (
              <button key={r.id}
                onClick={() => { setActiveNav('chat'); setChatRoom(r.id); }}
                className={`w-full text-left px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                  activeNav === 'chat' && chatRoom === r.id
                    ? 'bg-primary-600/15 text-primary-400'
                    : 'text-slate-600 hover:text-slate-400 hover:bg-dark-600/30'
                }`}>
                <Hash size={11} />
                <span className="text-[11px] font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Content header */}
        <div className="px-5 py-3 border-b border-dark-400/20 bg-dark-800/40 flex-shrink-0">
          <h2 className="font-bold text-slate-100 text-sm">
            {NAV_ITEMS.find(n => n.id === activeNav)?.label || 'Community'}
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {/* Forum */}
          {activeNav === 'forum' && (
            <div className="h-full px-5 py-4 overflow-auto">
              <CommunityForum activeChannel="all" />
            </div>
          )}

          {/* Live Chat */}
          {activeNav === 'chat' && (
            <LiveChat activeRoom={chatRoom} onRoomChange={setChatRoom} />
          )}

          {/* Leaderboard placeholder */}
          {activeNav === 'leaderboard' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <Trophy size={48} className="text-yellow-400 mb-4 opacity-60" />
              <h3 className="text-xl font-black text-slate-200 mb-2">Community Leaderboard</h3>
              <p className="text-slate-500 text-sm mb-4">See who's earning the most XP in the community this month.</p>
              <a href="/leaderboard" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-bold text-white transition-all">
                View Full Leaderboard →
              </a>
            </div>
          )}

          {/* Project Showcase */}
          {activeNav === 'showcase' && (
            <div className="h-full px-5 py-4 overflow-auto">
              <CommunityForum activeChannel="general" />
            </div>
          )}

          {/* Project Tutorials Completed */}
          {activeNav === 'project-tutorials-completed' && (
            <div className="h-full px-5 py-4 overflow-auto">
              <CommunityForum activeChannel="project-tutorials-completed" />
            </div>
          )}

          {/* Projects Built */}
          {activeNav === 'projects-built' && (
            <div className="h-full px-5 py-4 overflow-auto">
              <CommunityForum activeChannel="projects-built" />
            </div>
          )}

          {/* Monthly Challenge */}
          {activeNav === 'challenge' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="text-6xl mb-4">⚡</div>
              <div className="text-[11px] font-bold text-primary-400 uppercase tracking-widest mb-2">April 2026 Challenge</div>
              <h3 className="text-2xl font-black text-slate-100 mb-3">Build a Real-Time Dashboard</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                Create a live data dashboard using React + Socket.io. Best project wins 1000 XP + exclusive badge!
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Ends: Apr 30, 2026</span>
                <button className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-dark-900 font-bold rounded-xl text-sm transition-all">
                  Join Challenge 🏆
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT SIDEBAR ────────────────────────────────────────────── */}
      <div className="w-60 flex-shrink-0 border-l border-dark-400/20 bg-dark-800/50 flex flex-col overflow-y-auto">
        {/* News */}
        <div className="p-4 border-b border-dark-400/15">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={13} className="text-primary-400" />
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latest News</h3>
          </div>
          <div className="space-y-3">
            {NEWS.map((n, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-base flex-shrink-0">{n.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-300 leading-snug">{n.title}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{n.desc}</p>
                  <p className="text-[10px] text-primary-500 mt-0.5">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={13} className="text-primary-400" />
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</h3>
          </div>
          <div className="space-y-2">
            {EVENTS.map((e, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-700/50 border border-dark-400/30">
                <span className="text-base">{e.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-300 truncate">{e.title}</p>
                  <p className="text-[10px] text-slate-600">{e.date} • {e.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fun stat */}
          <div className="mt-4 p-3 rounded-xl bg-primary-500/8 border border-primary-500/20 text-center">
            <div className="text-xl font-black text-primary-300">🌍</div>
            <p className="text-[10px] text-slate-500 mt-1">Learners from 40+ countries are coding right now!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
