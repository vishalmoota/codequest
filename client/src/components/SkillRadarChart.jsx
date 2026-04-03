import { useState, useEffect, useRef } from 'react';

const SKILLS = [
  { label: 'Variables', key: 'vars', angle: -90 },
  { label: 'Logic', key: 'logic', angle: -30 },
  { label: 'Loops', key: 'loops', angle: 30 },
  { label: 'Functions', key: 'funcs', angle: 90 },
  { label: 'Arrays', key: 'arrays', angle: 150 },
  { label: 'Objects', key: 'objects', angle: 210 },
];

const toXY = (angle, r, cx, cy) => {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const SkillRadarChart = ({ xp = 0, completedLevels = [] }) => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);
  const cx = 120, cy = 120, maxR = 90;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Calculate skill values 0–1 based on XP and completed levels
  const getSkillVal = (idx) => {
    const base = Math.min(xp / 2000, 1);
    const levelBoost = completedLevels.includes(idx + 1) ? 0.3 : 0;
    return Math.min(base + levelBoost + idx * 0.05, 1);
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const skillPoints = SKILLS.map((s, i) => {
    const val = animated ? getSkillVal(i) : 0;
    return toXY(s.angle, maxR * val, cx, cy);
  });
  const polyPath = skillPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg width="240" height="240" viewBox="0 0 240 240">
        {/* Grid rings */}
        {gridLevels.map(lvl => {
          const pts = SKILLS.map(s => { const p = toXY(s.angle, maxR * lvl, cx, cy); return `${p.x},${p.y}`; }).join(' ');
          return <polygon key={lvl} points={pts} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="1" />;
        })}
        {/* Axis lines */}
        {SKILLS.map((s,i) => {
          const outer = toXY(s.angle, maxR, cx, cy);
          return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(99,102,241,0.2)" strokeWidth="1" />;
        })}
        {/* Skill polygon */}
        <polygon
          points={polyPath}
          fill="rgba(99,102,241,0.25)"
          stroke="#818cf8"
          strokeWidth="2"
          style={{ transition: 'all 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        {/* Dots */}
        {skillPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#818cf8"
            style={{ transition: `all 1.2s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s` }} />
        ))}
        {/* Labels */}
        {SKILLS.map((s, i) => {
          const lp = toXY(s.angle, maxR + 20, cx, cy);
          return (
            <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill="#94a3b8" fontFamily="Inter, sans-serif">{s.label}</text>
          );
        })}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Skill Proficiency</p>
    </div>
  );
};

export default SkillRadarChart;
