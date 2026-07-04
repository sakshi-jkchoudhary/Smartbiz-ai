import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';

export default function TopCustomersWidget({ customers = [] }) {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-900">Top customers</p>
        <Link to="/customers" className="text-xs text-brand-600 font-medium hover:text-brand-700">
          View all
        </Link>
      </div>
      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Customers will appear here once you record orders."
        />
      ) : (
        <div className="space-y-1">
          {customers.slice(0, 5).map((c, i) => (
            <div
              key={c._id}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 truncate">{c.name}</p>
              </div>
              <span className="text-xs font-medium text-slate-500 flex-shrink-0 ml-2">
                {formatCurrency(c.totalSpend)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
