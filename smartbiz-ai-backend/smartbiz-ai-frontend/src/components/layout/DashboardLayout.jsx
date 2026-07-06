import Sidebar from './Sidebar';
import Topbar from './Topbar';
import React, { useState } from 'react';

export default function DashboardLayout({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={handleMenuClick}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-slate-100 dark:border-slate-800
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Right Side Content Panel */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        
        {/* Topbar header sticky */}
        <Topbar title={title} subtitle={subtitle} onMenuClick={handleMenuClick} />
        
        {/* Main scroll box with standard layout padding layout */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
          {children}
        </main>

      </div>
    </div>
  );
}