import { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

const BadgePopup = ({ badges = [], onClose }) => {
  useEffect(() => {
    if (badges.length === 0) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [badges, onClose]);

  if (badges.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-dark-700 border-2 border-yellow-400/50 rounded-3xl p-8 shadow-2xl shadow-yellow-400/20
                      animate-bounce-in pointer-events-auto text-center max-w-sm mx-4"
        style={{ boxShadow: '0 0 40px rgba(251,191,36,0.3), 0 20px 60px rgba(0,0,0,0.5)' }}>
        
        {/* Sparks */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Sparkles size={48} className="text-yellow-400 animate-pulse" />
            <Sparkles size={24} className="text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-yellow-300 mb-1">Badge Earned!</h2>
        <p className="text-slate-400 text-sm mb-6">You unlocked {badges.length > 1 ? 'new badges' : 'a new badge'}</p>
        
        <div className="space-y-3 mb-6">
          {badges.map((badge, i) => (
            <div key={i}
              className="flex items-center gap-3 px-4 py-3 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
              <span className="text-2xl">{badge.label.split(' ')[0]}</span>
              <span className="text-yellow-200 font-semibold">{badge.label.replace(/^\S+\s/, '')}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="btn-primary w-full"
        >
          Awesome! 🎉
        </button>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default BadgePopup;
