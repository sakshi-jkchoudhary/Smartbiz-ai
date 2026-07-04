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
    <Table columns={['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date', '']}>
      {orders.map((o) => (
        <TableRow key={o._id}>
          <TableCell className="font-medium text-slate-900">{o.orderNumber}</TableCell>
          <TableCell>{o.customerNameSnapshot}</TableCell>
          <TableCell>{o.items.length}</TableCell>
          <TableCell>{formatCurrency(o.finalAmount)}</TableCell>
          <TableCell>
            <OrderStatusBadge status={o.status} />
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
