import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Code2, Mail, Lock, ArrowRight, Loader2, Sparkles, Zap } from 'lucide-react';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Floating pixel elements */}
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
          <div className="inline-flex items-center gap-3 mb-4">
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
            Continue your coding adventure
            <Sparkles size={14} className="text-primary-400" />
          </p>
        </div>

        <div className="card border-dark-400/30 backdrop-blur-xl bg-dark-700/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="email"
                  placeholder="hero@codequest.io"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10"
                  required
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
                {loading ? 'Entering the quest...' : 'Enter the Quest'}
              </span>
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-dark-400/50" />
            <span className="text-xs text-slate-500">NEW ADVENTURER?</span>
            <div className="flex-1 h-px bg-dark-400/50" />
          </div>

          <Link to="/signup"
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
            <Zap size={16} className="text-yellow-400" />
            Create Account & Start Coding
          </Link>
        </div>

        {/* Features preview */}
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

export default LoginPage;
