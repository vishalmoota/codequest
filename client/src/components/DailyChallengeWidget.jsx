import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import BadgePopup from './BadgePopup';
import { Flame, Clock, Zap, Users, Loader2, CheckCircle2, XCircle, Code2, ArrowLeft, Send } from 'lucide-react';

const DailyChallengeWidget = ({ onXPEarned }) => {
  const { updateUser } = useAuth();
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { success, testResults, xpEarned, message }
  const [badgePopup, setBadgePopup] = useState([]);

  useEffect(() => {
    api.get('/gamification/daily-challenge')
      .then(r => {
        setDaily(r.data);
        setLoading(false);
        if (r.data?.challengeId?.starterCode) {
          setCode(r.data.challengeId.starterCode);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const THEMES = {
    easy: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', emoji: '🌿' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', emoji: '🔥' },
    hard: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', emoji: '💀' },
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.post('/gamification/daily-challenge/complete', { code });
      setResult(res.data);
      if (res.data.success) {
        updateUser({ xp: res.data.totalXP, streak: res.data.streak });
        if (res.data.newBadges?.length > 0) {
          setBadgePopup(res.data.newBadges);
        }
        if (onXPEarned) onXPEarned();
      }
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-32 bg-dark-600 rounded-xl" />
      </div>
    );
  }

  if (!daily) return null;

  const theme = THEMES[daily.difficulty] || THEMES.medium;
  const completionCount = daily.completions?.length || 0;
  const challenge = daily.challengeId;

  // Expanded code editor view
  if (expanded && challenge) {
    return (
      <div className="relative overflow-hidden border-2 border-yellow-500/20 bg-gradient-to-br from-dark-700 via-dark-700 to-yellow-900/10 rounded-2xl p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl" />

        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => { setExpanded(false); setResult(null); }}
            className="p-1 hover:bg-dark-600 rounded-lg transition-colors">
            <ArrowLeft size={16} className="text-slate-400" />
          </button>
          <Flame size={18} className="text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Daily Challenge</span>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} />
            {timeLeft}
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-1">{challenge.title}</h3>
        <p className="text-xs text-slate-400 mb-3">{challenge.description}</p>

        {/* Code editor */}
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-36 bg-dark-900 border border-dark-400 rounded-xl p-3 text-sm font-mono text-emerald-300 
            focus:outline-none focus:border-yellow-500/50 resize-none mb-3"
          placeholder="Write your code here..."
        />

        {/* Test results */}
        {result && (
          <div className={`mb-3 p-3 rounded-xl border text-xs ${result.success
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-red-500/10 border-red-500/30'}`}>
            <div className="flex items-center gap-2 mb-1 font-bold">
              {result.success ? (
                <><CheckCircle2 size={14} className="text-emerald-400" /><span className="text-emerald-300">All tests passed!</span></>
              ) : (
                <><XCircle size={14} className="text-red-400" /><span className="text-red-300">{result.message || 'Some tests failed'}</span></>
              )}
            </div>
            {result.xpEarned > 0 && (
              <div className="flex items-center gap-1 text-yellow-400 font-bold mt-1">
                <Zap size={12} /> +{result.xpEarned} XP{result.alreadyCompleted ? ' (already completed)' : ''}
              </div>
            )}
            {result.testResults && (
              <div className="mt-2 space-y-1">
                {result.testResults.map((tr, i) => (
                  <div key={i} className={`flex items-center gap-1 ${tr.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tr.passed ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    <span>Test {i + 1}: Expected {JSON.stringify(tr.expected)}{!tr.passed ? `, got ${JSON.stringify(tr.actual)}` : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !code.trim()}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 
            text-dark-900 font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95
            shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><Loader2 size={16} className="animate-spin" /> Running tests...</>
          ) : (
            <><Send size={16} /> Submit Solution</>
          )}
        </button>

        <BadgePopup badges={badgePopup} onClose={() => setBadgePopup([])} />
      </div>
    );
  }

  // Collapsed card view
  return (
    <div className="relative overflow-hidden border-2 border-yellow-500/20 bg-gradient-to-br from-dark-700 via-dark-700 to-yellow-900/10 rounded-2xl p-5">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl" />
      
      <div className="flex items-center gap-2 mb-3">
        <Flame size={18} className="text-yellow-400" />
        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Daily Challenge</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={12} />
          {timeLeft}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-1">
        {daily.theme || 'Daily Challenge'} {theme.emoji}
      </h3>

      {challenge && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {challenge.title || daily.description}
        </p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${theme.bg} ${theme.border} border ${theme.color}`}>
          {daily.difficulty?.toUpperCase()}
        </span>
        {completionCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Users size={12} />
            +{completionCount} completed
          </span>
        )}
      </div>

      <button
        onClick={() => setExpanded(true)}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 
          text-dark-900 font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95
          shadow-lg shadow-yellow-500/20"
      >
        <Zap size={16} />
        Start {daily.xpReward}XP
      </button>
    </div>
  );
};

export default DailyChallengeWidget;
