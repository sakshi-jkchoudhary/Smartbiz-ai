import { AI_QUICK_QUESTIONS } from '../../utils/constants';

export default function AIQuickActions({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {AI_QUICK_QUESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-colors disabled:opacity-50"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
