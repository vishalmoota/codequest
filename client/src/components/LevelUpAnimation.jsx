import { useState, useEffect, useRef } from 'react';
import { Zap, Star, TrendingUp } from 'lucide-react';

const LevelUpAnimation = ({ show = false, level = 1, onComplete }) => {
  const [phase, setPhase] = useState('hidden'); // hidden | glow | expand | text | fadeOut

  useEffect(() => {
    if (!show) { setPhase('hidden'); return; }
    
    setPhase('glow');
    const timers = [
      setTimeout(() => setPhase('expand'), 400),
      setTimeout(() => setPhase('text'), 900),
      setTimeout(() => setPhase('fadeOut'), 3000),
      setTimeout(() => { setPhase('hidden'); onComplete?.(); }, 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [show, onComplete]);

  if (phase === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-dark-900/80 backdrop-blur-sm transition-opacity duration-500
        ${phase === 'fadeOut' ? 'opacity-0' : 'opacity-100'}`} />

      {/* Central animation */}
      <div className={`relative flex flex-col items-center transition-all duration-700
        ${phase === 'glow' ? 'scale-0 opacity-0' : ''}
        ${phase === 'expand' ? 'scale-110 opacity-100' : ''}
        ${phase === 'text' ? 'scale-100 opacity-100' : ''}
        ${phase === 'fadeOut' ? 'scale-90 opacity-0' : ''}`}>
        
        {/* Rotating ring */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-yellow-400/50 flex items-center justify-center"
            style={{
              boxShadow: '0 0 60px rgba(251,191,36,0.5), inset 0 0 30px rgba(251,191,36,0.2)',
              animation: 'spin 3s linear infinite',
            }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-2xl">
              <Star size={48} className="text-dark-900 drop-shadow-lg" />
            </div>
          </div>

          {/* Orbiting particles */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5"
              style={{
                animation: `orbit ${1.5 + i * 0.2}s linear infinite`,
                transformOrigin: `${20 + i * 8}px center`,
              }}>
              <div className="w-full h-full rounded-full bg-yellow-300"
                style={{ boxShadow: '0 0 8px rgba(251,191,36,0.8)' }} />
            </div>
          ))}
        </div>

        {/* Level text */}
        <div className={`mt-6 text-center transition-all duration-500
          ${phase === 'text' || phase === 'fadeOut' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-2 justify-center mb-1">
            <TrendingUp size={20} className="text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400 uppercase tracking-widest">Level Up!</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-1" style={{ textShadow: '0 0 30px rgba(251,191,36,0.5)' }}>
            Level {level}
          </h2>
          <p className="text-slate-400 text-sm">Keep climbing, hero! ✨</p>
        </div>
      </div>
    </div>
  );
};

export default LevelUpAnimation;
