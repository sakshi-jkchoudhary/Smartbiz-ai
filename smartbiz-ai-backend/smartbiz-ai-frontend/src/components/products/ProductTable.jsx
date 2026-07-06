import { Pencil, Trash2, Package } from 'lucide-react';
import { Table, TableRow, TableCell } from '../common/Table';
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
            {/* Title Text - Dark mode ready */}
            <TableCell className="font-medium text-slate-900 dark:text-white transition-colors duration-200">
              {p.name}
            </TableCell>
            
            {/* Category Text */}
            <TableCell className="text-slate-600 dark:text-slate-300 transition-colors duration-200">
              {p.category || '-'}
            </TableCell>
            
            {/* Price Text */}
            <TableCell className="text-slate-900 dark:text-white font-medium transition-colors duration-200">
              {formatCurrency(p.price)}
            </TableCell>
            
            {/* Stock Quantity */}
            <TableCell className="text-slate-600 dark:text-slate-300 transition-colors duration-200">
              {p.stockQty} {p.unit}
            </TableCell>
            
            {/* Status Badges */}
            <TableCell>
              {isLow ? (
                <Badge color="red">Low stock</Badge>
              ) : (
                <Badge color="green">In stock</Badge>
              )}
            </TableCell>
            
            {/* Action Buttons (Pencil / Trash) */}
            <TableCell>
              <div className="flex items-center gap-1 justify-end">
                <Button 
                  variant="ghost" 
                  className="!px-2 !py-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white" 
                  onClick={() => onEdit(p)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="!px-2 !py-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
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