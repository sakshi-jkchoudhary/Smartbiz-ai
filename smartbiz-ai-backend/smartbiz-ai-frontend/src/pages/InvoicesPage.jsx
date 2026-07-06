import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
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
      setInvoices(res.data.data || []);
      if (res.data.data && res.data.data.length > 0) {
        setSelected(res.data.data[0]);
      }
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
    <DashboardLayout>
      {/* pt-4 ensuring clear top safe spacing gap visibility layout */}
      <div className="w-full space-y-6 pt-4">
        
        {/* Clean Page Title Block */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Invoices
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generate and manage customer invoices
          </p>
        </div>

        {loading ? (
          <Loader label="Crunching your invoice data..." />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description="Your completed store orders and dynamic customer bills will instantly sync here."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column: Live Invoices Interactive Selector List */}
            <div className="lg:col-span-1">
              <InvoiceList 
                invoices={invoices} 
                selectedInvoice={selected} 
                onSelectInvoice={setSelected} 
              />
            </div>

            {/* Right Column: Complete Invoice Detailed Sheet View */}
            <div className="lg:col-span-2 space-y-4">
              {/* FIXED AREA: Extra create button completely removed, only showing the working Download PDF container now */}
              <div className="flex justify-end">
                <InvoicePDFButton invoice={selected} business={business} />
              </div>
              <InvoicePreview invoice={selected} business={business} />
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}