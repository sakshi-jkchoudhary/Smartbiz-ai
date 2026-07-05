import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  Sparkles,
  Sun,
  Moon,
  Settings,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const { business } = useAuth();
const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  return (
    <aside className="w-60 h-[100dvh] fixed top-0 left-0 bg-white border-r border-slate-100 flex flex-col justify-between  py-5 px-3 z-50 overflow-y-auto" >
      <div className="flex items-center gap-2.5 px-3 pb-6">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-tight">SmartBiz AI</p>
          <p className="text-xs text-slate-400 truncate">{business?.name || 'Your business'}</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 pt-3 border-t border-slate-100">
        <NavLink
          to="/ai-assistant"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
            }`
          }
        >
         
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          AI assistant
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </NavLink>
         <button 
  onClick={() => setDarkMode(!darkMode)}
  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50"
>
  {darkMode ? (
    <>
      <Sun className="w-4 h-4 text-yellow-500" />
      <span>Light Mode</span>
    </>
  ) : (
    <>
      <Moon className="w-4 h-4 text-slate-500" />
      <span>Dark Mode</span>
    </>
  )}
</button>
      </div>
    </aside>
  );
}
