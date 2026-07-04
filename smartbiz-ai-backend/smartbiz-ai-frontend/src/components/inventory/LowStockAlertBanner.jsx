import { AlertTriangle } from 'lucide-react';

export default function LowStockAlertBanner({ count }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-3.5 mb-5">
      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-red-600" />
      </div>
      <p className="text-sm text-red-700">
        <span className="font-semibold">{count} product{count > 1 ? 's are' : ' is'}</span>{' '}
        running low on stock. Restock soon to avoid missed sales.
      </p>
    </div>
  );
}
