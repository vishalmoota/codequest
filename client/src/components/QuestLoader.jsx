import { useState, useEffect } from 'react';

const CHARACTERS = ['🧙‍♂️', '🤖', '🐉', '⚔️', '🏆', '🚀', '💎', '🔮'];
const TIPS = [
  'Loading your adventure...',
  'Compiling pixel magic...',
  'Summoning code wizards...',
  'Preparing your quest...',
  'Generating challenges...',
  'Unlocking chapters...',
];

const QuestLoader = ({ text = null, size = 'md' }) => {
  const [charIdx, setCharIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const charTimer = setInterval(() => setCharIdx(i => (i + 1) % CHARACTERS.length), 400);
    const tipTimer = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 2000);
    return () => { clearInterval(charTimer); clearInterval(tipTimer); };
  }, []);

  const sizes = {
    sm: { wrapper: 'gap-2', emoji: 'text-2xl', text: 'text-xs', dots: 'w-1.5 h-1.5' },
    md: { wrapper: 'gap-3', emoji: 'text-4xl', text: 'text-sm', dots: 'w-2 h-2' },
    lg: { wrapper: 'gap-4', emoji: 'text-6xl', text: 'text-base', dots: 'w-2.5 h-2.5' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex flex-col items-center justify-center ${s.wrapper} animate-fade-in`}>
      {/* Spinning character ring */}
      <div className="relative">
        <div className={`${s.emoji} animate-bounce`}>{CHARACTERS[charIdx]}</div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className={`absolute -top-2 left-1/2 -translate-x-1/2 ${s.dots} bg-primary-400 rounded-full`} />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${s.dots} bg-yellow-400 rounded-full`} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-32 h-1.5 bg-dark-600 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-500 via-yellow-400 to-accent-purple rounded-full animate-shimmer"
          style={{ width: '60%', backgroundSize: '200% 100%' }}
        />
      </div>

      {/* Text */}
      <p className={`${s.text} text-slate-500 font-medium transition-all duration-300`}>
        {text || TIPS[tipIdx]}
      </p>
    </div>
  );
};

export default QuestLoader;
