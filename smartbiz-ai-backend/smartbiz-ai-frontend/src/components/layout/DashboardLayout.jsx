import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-soft">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
