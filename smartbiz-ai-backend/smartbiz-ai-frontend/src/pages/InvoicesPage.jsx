import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import InvoiceList from '../components/invoices/InvoiceList';
import InvoicePreview from '../components/invoices/InvoicePreview';
import InvoicePDFButton from '../components/invoices/InvoicePDFButton';
import { invoiceApi } from '../api/invoiceApi';
import { useAuth } from '../hooks/useAuth';

export default function InvoicesPage() {
  const { business } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await invoiceApi.getAll();
      setInvoices(res.data.data);
      if (res.data.data.length > 0) setSelected(res.data.data[0]);
    } catch (err) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  return (
    <DashboardLayout title="Invoices" subtitle="Generate and manage customer invoices">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1">
          <p className="text-sm font-semibold text-slate-900 mb-4">All invoices</p>
          {loading ? <Loader label="Loading..." /> : (
            <InvoiceList invoices={invoices} selectedId={selected?._id} onSelect={setSelected} />
          )}
        </Card>

        <div className="lg:col-span-2">
          {selected ? (
            <>
              <div className="flex justify-end mb-4">
                <InvoicePDFButton invoice={selected} businessName={business?.name} />
              </div>
              <InvoicePreview invoice={selected} />
            </>
          ) : (
            <Card>
              <EmptyState
                icon={FileText}
                title="No invoice selected"
                description="Generate an invoice from the Orders page, then it'll appear here."
              />
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
