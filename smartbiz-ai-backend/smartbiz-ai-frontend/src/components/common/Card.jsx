export default function Card({ children, className = '', padding = true, ...rest }) {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 transition-colors duration-200 ${padding ? 'p-5' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}
