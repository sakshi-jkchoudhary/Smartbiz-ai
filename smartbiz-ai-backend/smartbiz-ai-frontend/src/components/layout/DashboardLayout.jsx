import Sidebar from './Sidebar';
import Topbar from './Topbar';
import React,{ useState } from 'react';

export default function DashboardLayout({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-soft">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={handleMenuClick}
        />
      )}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform bg-white transition-transform duration-200 ease-in-out md:relative md:transform-none md:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} onMenuClick={handleMenuClick}/>
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
