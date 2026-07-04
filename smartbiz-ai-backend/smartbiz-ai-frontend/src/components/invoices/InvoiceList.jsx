import { FileText } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function InvoiceList({ invoices, selectedId, onSelect }) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No invoices yet"
        description="Generate an invoice from any completed order."
      />
    );
  }

  return (
    <div className="space-y-1.5">
      {invoices.map((inv) => (
        <button
          key={inv._id}
          onClick={() => onSelect(inv)}
          className={`w-full text-left px-3.5 py-3 rounded-xl border transition-colors ${
            selectedId === inv._id
              ? 'border-brand-300 bg-brand-50'
              : 'border-slate-100 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-sm font-medium text-slate-800">{inv.invoiceNumber}</p>
            <p className="text-sm font-medium text-slate-700">{formatCurrency(inv.finalAmount)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">{inv.customerNameSnapshot}</p>
            <p className="text-xs text-slate-400">{formatDate(inv.issuedDate)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
