import { useMemo } from 'react';

const AVATAR_CHARACTERS = {
  explorer: { emoji: '🧭', label: 'Explorer', bg: 'from-emerald-500 to-emerald-700' },
  coder:    { emoji: '💻', label: 'Coder',    bg: 'from-blue-500 to-blue-700' },
  wizard:   { emoji: '🧙', label: 'Wizard',   bg: 'from-purple-500 to-purple-700' },
  knight:   { emoji: '⚔️', label: 'Knight',   bg: 'from-red-500 to-red-700' },
  hacker:   { emoji: '👾', label: 'Hacker',   bg: 'from-cyan-500 to-cyan-700' },
  ninja:    { emoji: '🥷', label: 'Ninja',    bg: 'from-slate-500 to-slate-700' },
  robot:    { emoji: '🤖', label: 'Robot',    bg: 'from-yellow-500 to-yellow-700' },
  dragon:   { emoji: '🐉', label: 'Dragon',   bg: 'from-orange-500 to-orange-700' },
};

const SKIN_TONES = {
  light: '#ffdbb4',
  medium: '#c68642',
  dark: '#8d5524',
  fantasy: '#b694f7',
};

const AvatarDisplay = ({ avatar = {}, size = 'md', showLabel = false, className = '', onClick }) => {
  const character = AVATAR_CHARACTERS[avatar?.character] || AVATAR_CHARACTERS.explorer;
  const color = avatar?.color || '#6366f1';

  const sizeClasses = {
    xs: 'w-8 h-8 text-sm',
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-5xl',
  };

  const borderSize = {
    xs: 'border',
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-3',
    xl: 'border-4',
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`} onClick={onClick}>
      <div
        className={`${sizeClasses[size]} ${borderSize[size]} rounded-2xl bg-gradient-to-br ${character.bg} 
          flex items-center justify-center relative overflow-hidden
          shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl
          ${onClick ? 'cursor-pointer' : ''}`}
        style={{
          borderColor: color,
          boxShadow: `0 0 20px ${color}33, 0 4px 15px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Pixel grid overlay for retro feel */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
        <span className="relative z-10 drop-shadow-lg">{character.emoji}</span>
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-400">{character.label}</span>
      )}
    </div>
  );
};

export { AVATAR_CHARACTERS, SKIN_TONES };
export default AvatarDisplay;
