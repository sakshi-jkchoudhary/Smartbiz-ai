import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-soft px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mb-6">
        <Zap className="w-6 h-6 text-white" fill="white" />
      </div>
      <h1 className="text-5xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-500 mb-6">This page doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
