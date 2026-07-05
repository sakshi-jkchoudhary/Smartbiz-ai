import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, Menu, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); // Notification Dropdown State
  const menuRef = useRef(null);
  const notifRef = useRef(null); // Ref for notification element

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  // Dummy notifications list
  const notifications = [
    { id: 1, text: "New staff member added successfully!", time: "5m ago", type: "success" },
    { id: 2, text: "Backup generated successfully.", time: "1h ago", type: "info" }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="block md:hidden p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold text-slate-900 truncate">{title}</h1>
          {subtitle && <p className="hidden sm:block text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* Notification Bell Container */}
        <div className="relative" ref={notifRef}>
          <button 
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-400 hover:text-slate-600 relative rounded-full hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
              <div className="px-4 py-2.5 border-b border-slate-50 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">Notifications</span>
                <span className="text-xs bg-red-50 text-red-600 font-medium px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors flex gap-3 items-start">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    )}
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm bg-blue-100 text-blue-700">
              {initials}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1">
              <div className="px-3 py-2 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}