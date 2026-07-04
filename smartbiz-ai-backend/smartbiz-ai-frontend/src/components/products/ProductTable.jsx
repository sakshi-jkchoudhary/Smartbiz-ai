import { Pencil, Trash2, Package } from 'lucide-react';
import Table, { TableRow, TableCell } from '../common/Table';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No products yet"
        description="Add your first product to start tracking sales and stock."
      />
    );
  }

  return (
    <Table columns={['Product', 'Category', 'Price', 'Stock', 'Status', '']}>
      {products.map((p) => {
        const isLow = p.stockQty <= p.reorderThreshold;
        return (
          <TableRow key={p._id}>
            <TableCell className="font-medium text-slate-900">{p.name}</TableCell>
            <TableCell>{p.category || '—'}</TableCell>
            <TableCell>{formatCurrency(p.price)}</TableCell>
            <TableCell>
              {p.stockQty} {p.unit}
            </TableCell>
            <TableCell>
              {isLow ? (
                <Badge color="red">Low stock</Badge>
              ) : (
                <Badge color="green">In stock</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 justify-end">
                <Button variant="ghost" className="!px-2 !py-1.5" onClick={() => onEdit(p)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="!px-2 !py-1.5 !text-red-500 hover:!bg-red-50"
                  onClick={() => onDelete(p)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </Table>
  );
}
