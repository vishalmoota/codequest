import { useState } from 'react';
import { Heart, MessageCircle, ChevronDown, ChevronUp, Send, Loader2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RANK_COLORS = {
  Bronze: 'text-amber-700', Silver: 'text-slate-300', Gold: 'text-yellow-400',
  Platinum: 'text-cyan-300', Diamond: 'text-blue-300',
};

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const TYPE_STYLE = {
  question:   { label: '❓ Question',   cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  showcase:   { label: '🚀 Showcase',   cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  discussion: { label: '💬 Discussion', cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  meme:       { label: '😂 Meme',       cls: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
};

/* 🔥 NEW: CLEAN TEXT FUNCTION */
const cleanText = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/color:\s*#[0-9a-fA-F]+/g, '') // remove color codes
    .replace(/["']/g, '')                   // remove broken quotes
    .trim();
};

const PostCard = ({ post: initialPost, onDelete, onDeleted }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const typeInfo = TYPE_STYLE[post.type] || TYPE_STYLE.discussion;
  const isAuthor = user && (post.author?._id === user._id || post.authorName === user.username);

  const toggleLike = async () => {
    try {
      const r = await api.post(`/community/posts/${post._id}/like`);
      setLiked(r.data.liked);
      setLikeCount(r.data.likes);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const deletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    try {
      await api.delete(`/community/posts/${post._id}`);
      if (onDeleted) onDeleted(post._id);
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.message || 'Failed to delete post');
    }
    setDeleting(false);
  };

  const loadComments = async () => {
    if (commentsLoaded) { 
      setShowComments(v => !v); 
      return; 
    }
    setLoading(true);
    setShowComments(true);
    try {
      const r = await api.get(`/community/posts/${post._id}/comments`);
      setComments(r.data);
      setCommentsLoaded(true);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
    setLoading(false);
  };

  const submitComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const r = await api.post(`/community/posts/${post._id}/comment`, { text: commentText.trim() });
      setComments(c => [...c, r.data]);
      setPost(p => ({ ...p, commentCount: (p.commentCount || 0) + 1 }));
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert(err.response?.data?.message || 'Failed to post comment');
    }
    setSubmitting(false);
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/community/posts/${post._id}/comments/${commentId}`);
      setComments(c => c.filter(com => com._id !== commentId));
      setPost(p => ({ ...p, commentCount: Math.max(0, (p.commentCount || 1) - 1) }));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="bg-dark-700/60 border border-dark-400/40 rounded-2xl 
                    hover:border-dark-400/60 transition-all duration-300 group">

      <div className="p-5 space-y-3">

        {/* Top row */}
        <div className="flex items-start gap-3">

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-dark-500 border border-dark-400/50
                          flex items-center justify-center text-lg flex-shrink-0">
            {post.authorAvatar || '🧑‍💻'}
          </div>

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-sm font-bold text-slate-200 truncate">
                {cleanText(post.authorName)}
              </span>

              {post.authorRank && (
                <span className={`text-[10px] font-bold ${RANK_COLORS[post.authorRank] || 'text-slate-500'}`}>
                  {post.authorRank}
                </span>
              )}

              <span className="text-[10px] text-slate-600 ml-auto flex-shrink-0">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            {/* Type + channel */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeInfo.cls}`}>
                {typeInfo.label}
              </span>
              <span className="text-[10px] text-slate-600">
                #{cleanText(post.channel)}
              </span>
            </div>

          </div>

          {isAuthor && (
            <button onClick={deletePost} disabled={deleting}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 
                         disabled:opacity-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-primary-300 transition-colors word-break break-words">
          {cleanText(post.title)}
        </h3>

        {/* Body (FIXED) */}
        <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap break-words max-w-full">
          {cleanText(post.body)}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-400 border border-primary-500/20">
                #{cleanText(t)}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-dark-400/20">

          <button onClick={toggleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 ${
              liked ? 'text-pink-400' : 'text-slate-500 hover:text-pink-400'
            }`}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            {likeCount}
          </button>

          <button onClick={loadComments}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-400 transition-colors">
            <MessageCircle size={14} />
            {post.commentCount || 0}
            {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-dark-400/20 bg-dark-800/40 px-5 py-4 space-y-3">

          {loading ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <Loader2 size={12} className="animate-spin" /> Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-slate-600 py-2">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-2.5">
              {comments.map((c, i) => (
                <div key={c._id || i} className="flex gap-2.5 group/comment">

                  <div className="w-7 h-7 rounded-full bg-dark-500 border border-dark-400/40
                                  flex items-center justify-center text-sm flex-shrink-0">
                    {c.authorAvatar || '🧑‍💻'}
                  </div>

                  <div className="flex-1 min-w-0 bg-dark-700/60 rounded-xl px-3 py-2">

                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-slate-300 truncate">
                        {cleanText(c.authorName)}
                      </span>

                      {c.authorRank && (
                        <span className={`text-[9px] font-bold ${RANK_COLORS[c.authorRank] || 'text-slate-600'}`}>
                          {c.authorRank}
                        </span>
                      )}

                      <span className="text-[9px] text-slate-600 ml-auto flex-shrink-0">
                        {timeAgo(c.createdAt)}
                      </span>

                      {user && (c.authorName === user.username || c.author?._id === user._id) && (
                        <button onClick={() => deleteComment(c._id)} 
                          className="text-[8px] text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover/comment:opacity-100">
                          ✕
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed break-words whitespace-pre-wrap">
                      {cleanText(c.text)}
                    </p>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          {user && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-dark-400/20">

              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submitComment())}
                placeholder="Write a comment..."
                className="flex-1 bg-dark-600/60 border border-dark-400/40 rounded-xl px-3 py-2 text-xs
                           text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
              />

              <button onClick={submitComment} disabled={submitting || !commentText.trim()}
                className="p-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40
                           transition-all flex-shrink-0">

                {submitting
                  ? <Loader2 size={13} className="animate-spin text-white" />
                  : <Send size={13} className="text-white" />
                }

              </button>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default PostCard;