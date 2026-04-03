import { useEffect } from 'react';
import { Zap } from 'lucide-react';

// XP_PER_LEVEL – XP needed to display a full bar
const XP_PER_LEVEL = 150;

const XPBar = ({ xp = 0, level = 1 }) => {
  const progress = Math.min((xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100, 100);
  const xpToNext = XP_PER_LEVEL - (xp % XP_PER_LEVEL);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <span className="text-sm font-semibold text-slate-300">
            Level <span className="text-primary-300">{level}</span>
          </span>
        </div>
        <span className="text-xs text-slate-500">
          <span className="text-yellow-300 font-semibold">{xp}</span> XP · {xpToNext} to next level
        </span>
      </div>
      <div className="xp-progress-bg">
        <div
          className="xp-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600 mt-1">
        <span>{(level - 1) * XP_PER_LEVEL}</span>
        <span>{level * XP_PER_LEVEL} XP</span>
      </div>
    </div>
  );
};

export default XPBar;
