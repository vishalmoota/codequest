import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Code2, User, Mail, Lock, ArrowRight, Loader2, Sparkles, Zap } from 'lucide-react';

const SignupPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [selectedAvatar, setSelectedAvatar] = useState('explorer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fieldShellStyle = {
    position: 'relative',
    width: '100%',
    minHeight: '3.25rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    background: 'rgba(15, 23, 42, 0.9)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
    overflow: 'hidden',
  };

  const fieldInputStyle = {
    width: '100%',
    border: '0',
    outline: 'none',
    background: 'transparent',
    color: '#e2e8f0',
    fontSize: '1rem',
    lineHeight: 1.2,
    padding: '0.88rem 1rem 0.88rem 2.9rem',
  };

  const fieldIconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) return;
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        ...form,
        avatar: { character: selectedAvatar },
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary-500/20 rounded-sm animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-2xl border border-yellow-500/30">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Code2 size={24} className="text-dark-900" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2">
            <span className="text-yellow-400">Code</span><span className="text-slate-100">Quest</span>
          </h1>
          <p className="text-slate-400 flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-primary-400" />
            Begin your coding adventure
            <Sparkles size={14} className="text-primary-400" />
          </p>
        </div>

        <div className="card border-dark-400/30 backdrop-blur-xl bg-dark-700/80 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <div style={fieldShellStyle}>
                <User size={17} style={fieldIconStyle} />
                <input
                  type="text"
                  placeholder="heroicCoder"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  style={fieldInputStyle}
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div style={fieldShellStyle}>
                <Mail size={17} style={fieldIconStyle} />
                <input
                  type="email"
                  placeholder="hero@codequest.io"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={fieldInputStyle}
                  required
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div style={fieldShellStyle}>
                <Lock size={17} style={fieldIconStyle} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={fieldInputStyle}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-slide-up">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                {loading ? 'Creating account...' : 'Create Account'}
              </span>
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-dark-400/50" />
            <span className="text-xs text-slate-500">ALREADY HAVE AN ACCOUNT?</span>
            <div className="flex-1 h-px bg-dark-400/50" />
          </div>

          <p className="text-center text-slate-400 text-sm">
            <Link to="/login" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
              <Zap size={16} className="text-yellow-400" />
              Sign In & Enter the Quest
            </Link>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { emoji: '📚', label: 'Learn' },
            { emoji: '⚔️', label: 'Battle' },
            { emoji: '🏆', label: 'Compete' },
          ].map(f => (
            <div key={f.label} className="text-center py-3 bg-dark-700/30 rounded-xl border border-dark-400/20">
              <span className="text-lg">{f.emoji}</span>
              <p className="text-xs text-slate-500 mt-1">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
