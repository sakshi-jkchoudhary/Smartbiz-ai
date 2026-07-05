import { ShoppingCart, Eye } from 'lucide-react';
import Table, { TableRow, TableCell } from '../common/Table';
import EmptyState from '../common/EmptyState';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

export default function OrderTable({ orders, onView }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="No orders yet"
        description="Create your first order to see it here."
      />
    );
  }

  return (
    <Table columns={['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Date', '']}>
      {orders.map((o) => (
        <TableRow key={o._id}>
          <TableCell className="font-medium text-slate-900">{o.orderNumber}</TableCell>
          <TableCell>{o.customerNameSnapshot}</TableCell>
          <TableCell>{o.items.length}</TableCell>
          <TableCell>{formatCurrency(o.finalAmount)}</TableCell>
          <TableCell>
           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
  o.discount === 0.99
    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
}`}>
  {o.discount === 0.99 ? 'Pending' : 'Paid'}
</span>
          </TableCell>
          <TableCell>{formatDateTime(o.createdAt)}</TableCell>
          <TableCell>
            <button
              onClick={() => onView(o)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <Eye className="w-4 h-4" />
            </button>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
