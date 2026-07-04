import { Link } from 'react-router-dom';
import { AlertTriangle, Package } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function LowStockWidget({ items = [] }) {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-900">Low stock alerts</p>
        <Link to="/inventory" className="text-xs text-brand-600 font-medium hover:text-brand-700">
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="All stocked up"
          description="No products are running low right now."
        />
      ) : (
        <div className="space-y-1">
          {items.slice(0, 5).map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-sm text-slate-700 truncate">{item.name}</p>
              </div>
              <span className="text-xs font-medium text-red-600 flex-shrink-0 ml-2">
                {item.stockQty} {item.unit} left
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
