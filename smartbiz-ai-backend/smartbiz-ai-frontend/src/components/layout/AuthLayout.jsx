import { Zap } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">SmartBiz AI</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1.5">{title}</h1>
          <p className="text-sm text-slate-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-slate-900 to-slate-900" />
        <div className="relative z-10 max-w-md px-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" fill="white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            Run your business with an AI co-pilot
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Replace WhatsApp chats, Excel sheets, and paper records with one
            intelligent dashboard that tracks sales, inventory, and customers —
            and tells you what to do next.
          </p>
        </div>
      </div>
    </div>
  );
}
