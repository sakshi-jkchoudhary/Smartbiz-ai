import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Pure body ka base background lock aur dynamic dark mode class
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Mobile background overlay toggle display */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={handleMenuClick}
        />
      )}

      {/* Ekdam simple flex container bina kisi fixed position ke */}
      <div className="flex flex-col md:flex-row min-overflow-hidden w-full">
        
        {/* Left Sidebar Layout Box */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 shrink-0 transition-all duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
        </div>

        {/* Right Content Layout Wrapper */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar title={title} subtitle={subtitle} onMenuClick={handleMenuClick} />
          
          {/* Main Container safe margin framework */}
          <main className="flex-1 px-4 md:px-8 py-6 bg-slate-50 dark:bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}