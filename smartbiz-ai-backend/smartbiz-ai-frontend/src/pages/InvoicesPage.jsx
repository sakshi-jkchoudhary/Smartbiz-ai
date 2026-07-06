import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FileText , Plus } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import InvoiceList from '../components/invoices/InvoiceList';
import InvoicePreview from '../components/invoices/InvoicePreview';
import InvoicePDFButton from '../components/invoices/InvoicePDFButton';
import { invoiceApi } from '../api/invoiceApi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function InvoicesPage() {
  const { business } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
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
      {/* pt-4 adding safe spacing just like analytics page layout */}
      <div className="w-full space-y-6 pt-4">
        
        {/* Dynamic Page Header Layout with 'Create Invoice' Button */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
              Invoices
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Generate and manage customer invoices
            </p>
          </div>
          
          {/* Create Invoice Action Button */}
          <button
            onClick={() => navigate('/orders')} // Tumhara path agar alag h toh change kr lena
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-medium px-4 py-2.5 rounded-2xl shadow-sm transition-all text-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
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