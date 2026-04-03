import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

const StreakCalendar = ({ streak = 0, maxStreak = 0, activityDaysProp }) => {
  const [activityDays, setActivityDays] = useState(activityDaysProp || []);

  // Fetch real activity days from API if not provided as prop
  useEffect(() => {
    if (activityDaysProp && activityDaysProp.length > 0) {
      setActivityDays(activityDaysProp);
      return;
    }
    api.get('/gamification/activity-days?days=35')
      .then(r => setActivityDays(r.data.activityDays || []))
      .catch(() => {});
  }, [activityDaysProp]);

  const { days, activeDaySet } = useMemo(() => {
    const set = new Set(activityDays); // ISO strings like "2025-06-18"
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate start: go back to fill 5 complete weeks aligned to Sunday
    const todayDow = today.getDay(); // 0=Sun
    const startOffset = 34; // show 35 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - startOffset);
    // Adjust start to previous Sunday for grid alignment
    const startDow = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDow);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - todayDow)); // go to Saturday of current week

    const d = new Date(startDate);
    while (d <= endDate) {
      const iso = d.toISOString().split('T')[0];
      const isActive = set.has(iso);
      const isToday = d.getTime() === today.getTime();
      result.push({
        date: new Date(d),
        iso,
        isActive,
        isToday,
        dayOfWeek: d.getDay(),
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      });
      d.setDate(d.getDate() + 1);
    }
    return { days: result, activeDaySet: set };
  }, [activityDays]);

  const getIntensity = (isActive, isToday) => {
    if (isToday && isActive) return 'bg-emerald-400 shadow-emerald-400/50 shadow-sm scale-110';
    if (isToday) return 'bg-dark-400 ring-2 ring-emerald-500/50 animate-pulse';
    if (isActive) return 'bg-emerald-500/70';
    return 'bg-dark-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <span className="text-lg font-bold text-orange-400">{streak}</span>
            <span className="text-sm text-slate-400 ml-1">day streak</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">Best: </span>
          <span className="text-sm font-semibold text-yellow-400">{maxStreak} days</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] text-slate-600 font-medium mb-0.5">{d}</div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`aspect-square rounded-sm ${getIntensity(day.isActive, day.isToday)} 
              transition-all duration-300 hover:scale-125 cursor-default`}
            title={`${day.label}${day.isActive ? ' ✅ Active' : ''}${day.isToday ? ' (Today)' : ''}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-[10px] text-slate-600">Less</span>
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-dark-600" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-700/50" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
        </div>
        <span className="text-[10px] text-slate-600">More</span>
      </div>
    </div>
  );
};

export default StreakCalendar;
