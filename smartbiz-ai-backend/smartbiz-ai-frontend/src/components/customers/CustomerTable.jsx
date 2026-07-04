import { Pencil, Trash2, Users } from 'lucide-react';
import Table, { TableRow, TableCell } from '../common/Table';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatRelativeTime } from '../../utils/formatDate';

export default function CustomerTable({ customers, onView, onEdit, onDelete }) {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No customers yet"
        description="Add your first customer to start tracking their purchases."
      />
    );
  }

  return (
    <Table columns={['Customer', 'Phone', 'Total spend', 'Orders', 'Last order', '']}>
      {customers.map((c) => (
        <TableRow key={c._id} onClick={() => onView(c._id)}>
          <TableCell className="font-medium text-slate-900">
            <div className="flex items-center gap-2.5">
              {c.name}
              {c.tags?.includes('VIP') && <Badge color="blue">VIP</Badge>}
            </div>
          </TableCell>
          <TableCell>{c.phone || '—'}</TableCell>
          <TableCell>{formatCurrency(c.totalSpend)}</TableCell>
          <TableCell>{c.totalOrders}</TableCell>
          <TableCell>{formatRelativeTime(c.lastOrderDate)}</TableCell>
          <TableCell>
            <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="!px-2 !py-1.5" onClick={() => onEdit(c)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                className="!px-2 !py-1.5 !text-red-500 hover:!bg-red-50"
                onClick={() => onDelete(c)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
