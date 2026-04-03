import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { MessageSquare, Heart, Trash2, Send, Loader2 } from 'lucide-react';

const AVATAR_EMOJIS = ['🧑‍💻','👩‍💻','🧙‍♂️','🦊','🐉','🦄','🚀','⚡','🔥','💎'];

const CommentSection = ({ projectId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    api.get(`/comments/${projectId}`)
      .then(r => { setComments(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [projectId]);

  const post = async () => {
    if (!newComment.trim() || posting) return;
    setPosting(true);
    try {
      const r = await api.post(`/comments/${projectId}`, { text: newComment.trim() });
      setComments(prev => [r.data, ...prev]);
      setNewComment('');
      textRef.current?.focus();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const del = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {}
  };

  const likeComment = async (commentId) => {
    try {
      const r = await api.post(`/comments/${commentId}/like`);
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: Array(r.data.likes).fill(null) } : c));
    } catch {}
  };

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
        <MessageSquare size={18} className="text-primary-400" />
        Community Comments
        <span className="text-sm font-normal text-slate-500">({comments.length})</span>
      </h3>

      {/* Input */}
      {user ? (
        <div className="card mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-lg flex-shrink-0">
              {user.avatar || '🧑‍💻'}
            </div>
            <div className="flex-1">
              <textarea ref={textRef} value={newComment} onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), post())}
                placeholder="Share your thoughts, question, or tip..."
                rows={3}
                className="w-full bg-dark-600/50 border border-dark-400/40 rounded-xl px-4 py-3 text-sm text-slate-300
                  placeholder-slate-600 focus:outline-none focus:border-primary-500/50 resize-none transition-colors" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-600">Press Enter to post, Shift+Enter for new line</span>
                <button onClick={post} disabled={!newComment.trim() || posting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-6 text-center">
          <p className="text-slate-400 text-sm">Sign in to leave a comment</p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-slate-500" /></div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-slate-400">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c._id} className="card group hover:border-dark-400/80 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-dark-500 border border-dark-400/40 flex items-center justify-center text-base flex-shrink-0">
                  {c.avatar || '🧑‍💻'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-slate-200">{c.username}</span>
                    <span className="text-xs text-slate-600">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{c.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => likeComment(c._id)}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-pink-400 transition-colors">
                      <Heart size={12} /> {c.likes?.length || 0}
                    </button>
                    {user && c.username === user.username && (
                      <button onClick={() => del(c._id)}
                        className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
