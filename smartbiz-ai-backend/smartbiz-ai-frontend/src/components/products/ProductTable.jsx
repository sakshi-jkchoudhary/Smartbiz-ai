import React from 'react';
import { Pencil, Trash2, Package, Plus, Search } from 'lucide-react';
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
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Stock</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-end">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {products.map((p) => {
            const isLow = p.stockQty <= p.reorderThreshold;
            return (
              <tr key={p._id || p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                {/* Product Name */}
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                  {p.name}
                </td>
                
                {/* Category */}
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  {p.category || '-'}
                </td>
                
                {/* Price */}
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(p.price)}
                </td>
                
                {/* Stock */}
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  {p.stockQty} {p.unit || 'pcs'}
                </td>
                
                {/* Status */}
                <td className="py-3 px-4">
                  {isLow ? (
                    <Badge color="red">Low stock</Badge>
                  ) : (
                    <Badge color="green">In stock</Badge>
                  )}
                </td>
                
                {/* Actions */}
                <td className="py-3 px-4 text-end">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}