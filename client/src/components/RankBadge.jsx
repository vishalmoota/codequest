const RankBadge = ({ xp = 0, size = 'md', showLabel = true }) => {
  const getRank = (xp) => {
    if (xp >= 2000) return { name: 'Diamond', icon: '💎', color: '#b9f2ff', glow: 'rgba(185,242,255,0.4)', bg: 'from-cyan-300/20 to-cyan-500/10' };
    if (xp >= 1000) return { name: 'Platinum', icon: '⚜️', color: '#e5e4e2', glow: 'rgba(229,228,226,0.4)', bg: 'from-slate-300/20 to-slate-500/10' };
    if (xp >= 500) return { name: 'Gold', icon: '🥇', color: '#ffd700', glow: 'rgba(255,215,0,0.4)', bg: 'from-yellow-300/20 to-yellow-500/10' };
    if (xp >= 200) return { name: 'Silver', icon: '🥈', color: '#c0c0c0', glow: 'rgba(192,192,192,0.4)', bg: 'from-gray-300/20 to-gray-500/10' };
    return { name: 'Bronze', icon: '🥉', color: '#cd7f32', glow: 'rgba(205,127,50,0.4)', bg: 'from-orange-300/20 to-orange-500/10' };
  };

  const rank = getRank(xp);

  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} rounded-full bg-gradient-to-r ${rank.bg} border font-semibold`}
      style={{
        borderColor: rank.color + '40',
        color: rank.color,
        boxShadow: `0 0 12px ${rank.glow}`,
      }}
    >
      <span className={iconSize[size]}>{rank.icon}</span>
      {showLabel && <span>{rank.name}</span>}
    </div>
  );
};

export default RankBadge;
