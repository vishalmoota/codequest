import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AvatarDisplay from './AvatarDisplay';
import RankBadge from './RankBadge';
import {
  Code2, Trophy, User, LogOut, Zap, LayoutDashboard, BookOpen,
  Swords, Award, Flame, ChevronDown, Search, Bell, Hammer, Users
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Dropdown menu items
  const MENUS = {
    learn: [
      { to: '/courses', label: 'All Courses', icon: BookOpen, emoji: '📚' },
      { to: '/dashboard', label: 'My Journey', icon: LayoutDashboard, emoji: '🗺️' },
      { to: '/projects', label: 'Project Tutorials', icon: Hammer, emoji: '🛠️' },
    ],
    practice: [
      { to: '/battle', label: 'Code Battle Arena', icon: Swords, emoji: '⚔️' },
      { to: '/achievements', label: 'Achievements', icon: Award, emoji: '🏆' },
      { to: '/community', label: 'Community Chat', icon: Users, emoji: '💬' },
    ],
  };

  const DropdownMenu = ({ id, label }) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenu(openMenu === id ? null : id)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200
          ${openMenu === id ? 'text-primary-300 bg-primary-600/10' : 'text-slate-300 hover:text-white hover:bg-dark-500/50'}`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${openMenu === id ? 'rotate-180' : ''}`} />
      </button>

      {openMenu === id && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-dark-700 border border-dark-400/50 rounded-xl shadow-2xl shadow-black/40 py-2 z-50 animate-slide-up">
          {MENUS[id]?.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpenMenu(null)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-dark-600 transition-colors"
            >
              <span className="text-base">{item.emoji}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-dark-400/50 bg-dark-800/90 backdrop-blur-xl" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-yellow-500/20 rounded-xl border border-yellow-500/30 group-hover:border-yellow-400/50 transition-all group-hover:shadow-lg group-hover:shadow-yellow-500/10">
              <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Code2 size={16} className="text-dark-900" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-yellow-400">Code</span><span className="text-slate-100">Quest</span>
            </span>
          </Link>

          {/* Nav links */}
          {user && (
            <>
              <div className="hidden md:flex items-center gap-1">
                <DropdownMenu id="learn" label="Learn" />
                <DropdownMenu id="practice" label="Practice" />

                <Link
                  to="/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                    ${isActive('/leaderboard') ? 'text-primary-300 bg-primary-600/10' : 'text-slate-300 hover:text-white hover:bg-dark-500/50'}`}
                >
                  Leaderboard
                </Link>

                <Link
                  to="/projects"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                    ${isActive('/projects') ? 'text-yellow-300 bg-yellow-600/10' : 'text-slate-300 hover:text-white hover:bg-dark-500/50'}`}
                >
                  <Hammer size={14} /> Build
                </Link>

                <Link
                  to="/community"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                    ${isActive('/community') ? 'text-emerald-300 bg-emerald-600/10' : 'text-slate-300 hover:text-white hover:bg-dark-500/50'}`}
                >
                  <Users size={14} /> Community
                </Link>

                <Link
                  to="/battle"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                    ${isActive('/battle') ? 'text-red-300 bg-red-600/10' : 'text-slate-300 hover:text-white hover:bg-dark-500/50'}`}
                >
                  <Swords size={14} />
                  Battle
                </Link>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2">
                {/* Streak indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-600/50 rounded-xl border border-dark-400/30">
                  <Flame size={14} className="text-orange-400" />
                  <span className="text-xs font-bold text-orange-300">{user.streak || 0}</span>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-600/50 rounded-xl border border-dark-400/30">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-300">{user.xp || 0}</span>
                </div>

                {/* Avatar & dropdown */}
                <div className="relative group">
                  <button
                    onClick={() => setOpenMenu(openMenu === 'user' ? null : 'user')}
                    className="flex items-center gap-2 pl-2 pr-3 py-1 bg-dark-600/50 rounded-xl border border-dark-400/30 hover:border-primary-500/30 transition-all"
                  >
                    <AvatarDisplay avatar={user?.avatar} size="xs" />
                    <ChevronDown size={12} className="text-slate-500" />
                  </button>

                  {openMenu === 'user' && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-dark-700 border border-dark-400/50 rounded-xl shadow-2xl shadow-black/40 py-2 z-50 animate-slide-up">
                      <div className="px-4 py-2 border-b border-dark-400/30 mb-1">
                        <div className="font-bold text-slate-100 text-sm">{user.username}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <RankBadge xp={user.xp || 0} size="sm" />
                        </div>
                      </div>
                      <Link to="/profile" onClick={() => setOpenMenu(null)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-dark-600">
                        <User size={14} /> Profile
                      </Link>
                      <Link to="/achievements" onClick={() => setOpenMenu(null)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-dark-600">
                        <Award size={14} /> Achievements
                      </Link>
                      <hr className="border-dark-400/30 my-1" />
                      <button onClick={() => { setOpenMenu(null); handleLogout(); }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
