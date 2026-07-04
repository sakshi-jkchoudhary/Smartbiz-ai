const COLOR_MAP = {
  gray: 'bg-slate-100 text-slate-700 border-slate-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-brand-50 text-brand-700 border-brand-200',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${COLOR_MAP[color]} ${className}`}
    >
      {children}
    </span>
  );
}
