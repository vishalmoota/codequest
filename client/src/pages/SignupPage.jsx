import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AvatarDisplay, { AVATAR_CHARACTERS } from '../components/AvatarDisplay';
import { Code2, User, Mail, Lock, ArrowRight, Loader2, Sparkles, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

const SignupPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [selectedAvatar, setSelectedAvatar] = useState('explorer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = account info, 2 = avatar selection
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      // Validate and move to avatar selection
      if (!form.username || !form.email || !form.password) return;
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setError('');
      setStep(2);
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
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/2 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent-purple/20 rounded-sm animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
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
            <Sparkles size={14} className="text-accent-purple" />
            {step === 1 ? 'Begin your coding adventure' : 'Choose your character'}
            <Sparkles size={14} className="text-accent-purple" />
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-primary-500' : 'bg-dark-400'}`} />
          <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-primary-500' : 'bg-dark-400'}`} />
        </div>

        <div className="card border-dark-400/30 backdrop-blur-xl bg-dark-700/80">
          {step === 1 ? (
            /* Step 1: Account Info */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <div className="relative">
                  <User size={17} className="absolute left-3 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="heroicCoder"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    className="input-field pl-10"
                    required
                    minLength={3}
                  />
                </div>
              </div>

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
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-slide-up">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                Choose Character <ChevronRightIcon size={18} />
              </button>
            </form>
          ) : (
            /* Step 2: Avatar Selection */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-200 mb-1">Pick your avatar</h3>
                <p className="text-xs text-slate-500 mb-4">You can change this later in your profile</p>

                {/* Selected avatar preview */}
                <div className="flex justify-center mb-5">
                  <div className="relative">
                    <AvatarDisplay avatar={{ character: selectedAvatar }} size="xl" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-dark-600 px-3 py-1 rounded-full border border-dark-400/50 text-xs font-semibold text-slate-300">
                      {AVATAR_CHARACTERS[selectedAvatar]?.name}
                    </div>
                  </div>
                </div>

                {/* Avatar grid */}
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(AVATAR_CHARACTERS).map(([key, char]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedAvatar(key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-105
                        ${selectedAvatar === key
                          ? 'bg-primary-600/20 border-primary-500/50 ring-2 ring-primary-500/30'
                          : 'bg-dark-600/50 border-dark-400/30 hover:border-primary-500/20'}`}
                    >
                      <span className="text-2xl">{char.emoji}</span>
                      <span className="text-xs text-slate-400 font-medium">{char.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-slide-up">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" disabled={loading}
                  className="btn-primary flex-[2] flex items-center justify-center gap-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    {loading ? 'Creating account...' : 'Start Quest!'}
                  </span>
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
