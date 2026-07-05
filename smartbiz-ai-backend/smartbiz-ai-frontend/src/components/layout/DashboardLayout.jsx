import Sidebar from './Sidebar';
import Topbar from './Topbar';
import React, { useState } from 'react';

export default function DashboardLayout({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Pure body component par min-h-screen background color set hai
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Mobile view mobile layout toggle screen check */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={handleMenuClick}
        />
      )}

      {/* Grid framework structure where sidebar and content sit side by side natively */}
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        
        {/* Left Side: Sidebar container */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 shrink-0 transition-all duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
        </div>

        {/* Right Side: Header + Entire Page Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar title={title} subtitle={subtitle} onMenuClick={handleMenuClick} />
          
          {/* Natural scroll area container wraps all elements safely without text clipping */}
          <main className="flex-1 px-4 md:px-8 py-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}