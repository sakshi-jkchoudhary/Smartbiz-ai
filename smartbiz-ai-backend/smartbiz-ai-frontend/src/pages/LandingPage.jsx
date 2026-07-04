import { Link } from 'react-router-dom';
import {
  Zap,
  BarChart3,
  Package,
  Sparkles,
  ArrowRight,
  Check,
  Users,
  FileText,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Package,
    title: 'Inventory that manages itself',
    desc: 'Stock auto-updates with every sale. Get alerted before you run out, not after.',
  },
  {
    icon: Sparkles,
    title: 'An AI that knows your business',
    desc: 'Ask "what should I reorder?" and get real answers from your real data — not generic advice.',
  },
  {
    icon: BarChart3,
    title: 'Analytics without the spreadsheet',
    desc: 'Revenue trends, top products, and customer insights — visualized automatically.',
  },
  {
    icon: Users,
    title: 'Customers, remembered',
    desc: 'Every purchase, every visit, tracked — so you know who your best customers are.',
  },
  {
    icon: FileText,
    title: 'Invoices in one click',
    desc: 'Generate professional invoices instantly from any order. No more handwritten bills.',
  },
  {
    icon: Zap,
    title: 'Built for how you actually work',
    desc: 'Replaces WhatsApp chats and Excel sheets with one dashboard your whole team can use.',
  },
];

const BUSINESS_TYPES = [
  'Retail shops',
  'Grocery stores',
  'Cafes',
  'Salons',
  'Coaching institutes',
  'Clinics',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">SmartBiz AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2"
          >
            Log in
          </Link>
          <Link to="/signup" className="btn-primary text-sm">
            Start free
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by AI business insights
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
          Your business, <span className="text-brand-600">intelligently</span> managed
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Stop juggling WhatsApp chats, Excel sheets, and paper records. SmartBiz AI
          gives small businesses one dashboard that tracks sales, inventory, and
          customers — and an AI assistant that tells you exactly what to do next.
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Link to="/signup" className="btn-primary flex items-center gap-2">
            Start free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary">
            Log in
          </Link>
        </div>
        <p className="text-xs text-slate-400">No credit card required · Setup in 2 minutes</p>
      </section>

      <section className="border-y border-slate-100 bg-surface-soft py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {BUSINESS_TYPES.map((type) => (
            <span key={type} className="text-sm text-slate-500 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-brand-500" />
              {type}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Everything your business needs, nothing it doesn't
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Built specifically for small businesses that are ready to leave spreadsheets behind.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-slate-100 hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to run your business smarter?
          </h2>
          <p className="text-slate-300 mb-8">
            Join small businesses already replacing spreadsheets with SmartBiz AI.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-medium px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-slate-400">
        <span>© 2026 SmartBiz AI. Built for small businesses.</span>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>SmartBiz AI</span>
        </div>
      </footer>
    </div>
  );
}
