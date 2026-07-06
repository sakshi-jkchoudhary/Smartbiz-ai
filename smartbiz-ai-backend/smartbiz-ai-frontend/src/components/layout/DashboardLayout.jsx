import Sidebar from './Sidebar';
import Topbar from './Topbar';
import React, { useState } from 'react';

export default function DashboardLayout({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Pure page ki height ko 100vh par lock kiya aur scrolling block ki
    <div className="h-screen w-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Mobile view overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={handleMenuClick}
        />
      )}

      {/* Left Sidebar Layout Box - Yeh apni jagah locked rahega (No Scroll) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-slate-100 dark:border-slate-800
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Right Side Container - Yeh alag se apni screen handle karega */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        
        {/* Topbar sticky header built inside */}
        <Topbar title={title} subtitle={subtitle} onMenuClick={handleMenuClick} />
        
        {/* ONLY THIS MAIN AREA WILL SCROLL (Internal Scrolling) */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-slate-50 dark:bg-slate-950">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}