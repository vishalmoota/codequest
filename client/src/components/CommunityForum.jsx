import { useState, useEffect } from 'react';
import { Loader2, Plus, X, Send, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from './PostCard';

const CHANNELS = [
  { id: 'general', label: 'General', emoji: '💬' },
  { id: 'javascript', label: 'JavaScript', emoji: '🟡' },
  { id: 'python', label: 'Python', emoji: '🐍' },
  { id: 'react', label: 'React', emoji: '⚛️' },
  { id: 'project-help', label: 'Project Help', emoji: '🛠️' },
];

const POST_TYPES = [
  { value: 'discussion', label: '💬 Discussion' },
  { value: 'question',   label: '❓ Question' },
  { value: 'showcase',   label: '🚀 Showcase' },
  { value: 'meme',       label: '😂 Meme' },
];

/* ── New Post Modal ─────────────────────────────────────────────────────── */
const NewPostModal = ({ onClose, onCreated, activeChannel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('discussion');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!title.trim() || !body.trim()) { setError('Title and body are required'); return; }
    setSubmitting(true);
    setError('');
    try {
      const r = await api.post('/community/posts', {
        title: title.trim(),
        body: body.trim(),
        channel: activeChannel,
        type,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      onCreated(r.data);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create post');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-dark-800 border border-dark-400/50 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-400/30">
          <h3 className="font-bold text-slate-100">New Post</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Type selector */}
          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map(t => (
              <button key={t.value} onClick={() => setType(t.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  type === t.value
                    ? 'bg-primary-600 border-primary-500 text-white'
                    : 'border-dark-400/50 text-slate-400 hover:border-primary-500/40'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..."
            className="w-full bg-dark-700/60 border border-dark-400/40 rounded-xl px-4 py-3
                       text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/60 transition-colors" />

          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your post..."
            rows={6}
            className="w-full bg-dark-700/60 border border-dark-400/40 rounded-xl px-4 py-3
                       text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/60
                       resize-none transition-colors" />

          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="Tags (comma separated): javascript, beginner, help"
            className="w-full bg-dark-700/60 border border-dark-400/40 rounded-xl px-4 py-3
                       text-sm text-slate-400 placeholder-slate-600 focus:outline-none focus:border-primary-500/60 transition-colors" />

          <button onClick={submit} disabled={submitting}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 rounded-xl
                       text-sm font-bold text-white transition-all flex items-center justify-center gap-2">
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {submitting ? 'Posting...' : 'Post to Community'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main CommunityForum Component ──────────────────────────────────────── */
const CommunityForum = ({ activeChannel = 'general' }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterChannel, setFilterChannel] = useState(activeChannel);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    setFilterChannel(activeChannel);
  }, [activeChannel]);

  useEffect(() => {
    loadPosts();
  }, [filterChannel]);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    setRetrying(false);
    try {
      const r = await api.get('/community/posts', {
        params: { 
          channel: filterChannel === 'all' ? undefined : filterChannel, 
          limit: 50 
        }
      });
      setPosts(r.data.posts || []);
    } catch (e) {
      console.error('Error loading posts:', e);
      const errorMsg = e.response?.data?.message || 'Failed to load posts. Make sure the server is running.';
      setError(errorMsg);
    }
    setLoading(false);
  };

  const handleNewPost = (post) => {
    // Add new post to the beginning of the list
    setPosts(p => [post, ...p]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(p => p.filter(post => post._id !== postId));
  };

  const handleRetry = async () => {
    setRetrying(true);
    await loadPosts();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setFilterChannel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filterChannel === 'all'
                ? 'bg-primary-600 border-primary-500 text-white'
                : 'border-dark-400/50 text-slate-400 hover:border-primary-500/40'
            }`}>
            🌐 All
          </button>
          {CHANNELS.map(c => (
            <button key={c.id} onClick={() => setFilterChannel(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterChannel === c.id
                  ? 'bg-primary-600 border-primary-500 text-white'
                  : 'border-dark-400/50 text-slate-400 hover:border-primary-500/40'
              }`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {user && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-500
                       rounded-xl text-xs font-bold text-white transition-all hover:scale-105 flex-shrink-0">
            <Plus size={14} /> New Post
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 size={28} className="animate-spin mb-3" />
            <p className="text-sm">Loading community posts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <AlertCircle size={32} className="text-red-400 mb-3" />
            <p className="text-sm text-red-400 font-semibold mb-2">{error}</p>
            <p className="text-xs text-slate-500 mb-4">Please check your internet connection or try again.</p>
            <button onClick={handleRetry} disabled={retrying}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2">
              {retrying ? <Loader2 size={12} className="animate-spin" /> : <>🔄 Try Again</>}
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-slate-400 font-semibold">No posts yet in this channel!</p>
            <p className="text-slate-600 text-sm mt-1">Be the first to start a conversation.</p>
            {user && (
              <button onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-xs font-bold text-white transition-all">
                ✍️ Create First Post
              </button>
            )}
            {!user && (
              <p className="text-slate-600 text-xs mt-4">Sign in to create posts</p>
            )}
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post}
              onDelete={() => handlePostDeleted(post._id)}
            />
          ))
        )}
      </div>

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onCreated={handleNewPost}
          activeChannel={filterChannel === 'all' ? 'general' : filterChannel}
        />
      )}
    </div>
  );
};

export default CommunityForum;
