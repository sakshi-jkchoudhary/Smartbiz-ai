import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown ,Menu, Bell} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-4 md:px-8 py-4 flex items-center gap-4 justify-between">
     <div className="flex items-center gap-3">
    <button 
      onClick={onMenuClick}
      className="block md:hidden p-1 rounded-lg hover:bg-slate-100 transition-colors"
    >
      <Menu className="w-6 h-6 text-slate-600" />
    </button>
    
    <div>
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
{/* Notification Bell Button */}
<button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2">
  <Bell className="w-5 h-5" />
  {/* Chota red dot active notification ke liye */}
  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
</button>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.name}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-soft py-1.5 animate-fadeIn">
            <div className="px-3.5 py-2 border-b border-slate-50">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
