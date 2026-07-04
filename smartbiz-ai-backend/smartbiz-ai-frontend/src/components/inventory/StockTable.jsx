import { Boxes, PackagePlus } from 'lucide-react';
import Table, { TableRow, TableCell } from '../common/Table';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

export default function StockTable({ products, onAdjust }) {
  if (products.length === 0) {
    return <EmptyState icon={Boxes} title="No products found" />;
  }

  return (
    <Table columns={['Product', 'Category', 'Current stock', 'Reorder at', 'Status', '']}>
      {products.map((p) => {
        const isLow = p.stockQty <= p.reorderThreshold;
        return (
          <TableRow key={p._id}>
            <TableCell className="font-medium text-slate-900">{p.name}</TableCell>
            <TableCell>{p.category || '—'}</TableCell>
            <TableCell>
              {p.stockQty} {p.unit}
            </TableCell>
            <TableCell>
              {p.reorderThreshold} {p.unit}
            </TableCell>
            <TableCell>
              {isLow ? <Badge color="red">Low stock</Badge> : <Badge color="green">Healthy</Badge>}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                className="!px-2.5 !py-1.5 text-xs"
                icon={PackagePlus}
                onClick={() => onAdjust(p)}
              >
                Adjust
              </Button>
            </TableCell>
          </TableRow>
        );
      })}
    </Table>
  );
}
