import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import Badge from '../common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatRelativeTime } from '../../utils/formatDate';

const STATUS_COLOR = { pending: 'amber', completed: 'green', cancelled: 'red' };

export default function RecentOrdersWidget({ orders = [] }) {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-900">Recent orders</p>
        <Link to="/orders" className="text-xs text-brand-600 font-medium hover:text-brand-700">
          View all
        </Link>
      </div>
      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders yet"
          description="New orders will show up here as they come in."
        />
      ) : (
        <div className="space-y-1">
          {orders.slice(0, 5).map((o) => (
            <div
              key={o._id}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm text-slate-700 truncate">{o.customerNameSnapshot}</p>
                <p className="text-xs text-slate-400">
                  {o.orderNumber} · {formatRelativeTime(o.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-xs font-medium text-slate-700">
                  {formatCurrency(o.finalAmount)}
                </span>
                <Badge color={STATUS_COLOR[o.status]}>{o.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
