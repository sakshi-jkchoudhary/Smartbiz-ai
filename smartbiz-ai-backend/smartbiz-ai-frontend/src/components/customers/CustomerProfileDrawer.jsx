import { X, Phone, Mail, ShoppingBag, IndianRupee } from 'lucide-react';
import { useEffect, useState } from 'react';
import { customerApi } from '../../api/customerApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';
import Loader from '../common/Loader';

const STATUS_COLOR = { pending: 'amber', completed: 'green', cancelled: 'red' };

export default function CustomerProfileDrawer({ customerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    customerApi
      .getById(customerId)
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-soft overflow-y-auto animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="text-base font-semibold text-slate-900">Customer profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {loading || !data ? (
          <Loader label="Loading profile..." />
        ) : (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">
                {data.customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{data.customer.name}</p>
                <div className="flex gap-1 mt-1">
                  {data.customer.tags?.map((t) => (
                    <Badge key={t} color="blue">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-sm text-slate-600">
              {data.customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> {data.customer.phone}
                </div>
              )}
              {data.customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> {data.customer.email}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-surface-soft rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <IndianRupee className="w-3.5 h-3.5" /> Total spend
                </div>
                <p className="font-semibold text-slate-900">
                  {formatCurrency(data.customer.totalSpend)}
                </p>
              </div>
              <div className="bg-surface-soft rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> Total orders
                </div>
                <p className="font-semibold text-slate-900">{data.customer.totalOrders}</p>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-900 mb-3">Order history</p>
            <div className="space-y-2">
              {(data.orders || []).length === 0 && (
                <p className="text-sm text-slate-400">No orders yet.</p>
              )}
              {(data.orders || []).map((o) => (
                <div
                  key={o._id}
                  className="flex items-center justify-between border border-slate-100 rounded-xl px-3.5 py-2.5"
                >
                  <div>
                    <p className="text-sm text-slate-700">{o.orderNumber}</p>
                    <p className="text-xs text-slate-400">{formatDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      {formatCurrency(o.finalAmount)}
                    </span>
                    <Badge color={STATUS_COLOR[o.status]}>{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
