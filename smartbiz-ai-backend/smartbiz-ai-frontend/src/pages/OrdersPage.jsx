import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import OrderTable from '../components/orders/OrderTable';
import OrderFormModal from '../components/orders/OrderFormModal';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import { orderApi } from '../api/orderApi';
import { invoiceApi } from '../api/invoiceApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAll();
      setOrders(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleGenerateInvoice = async (orderId) => {
    setGeneratingInvoice(true);
    try {
      await invoiceApi.generate(orderId);
      toast.success('Invoice generated - check the Invoices page');
      setViewingOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  return (
    <DashboardLayout title="Orders" subtitle="Create and track customer orders">
      <div className="w-full space-y-6 pt-4">
        
        {/* Top Header Card Container */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            {/* FIXED: High Contrast dynamic tracking text for dark mode compatibility */}
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              {orders.length} total orders
            </p>
            <Button icon={Plus} onClick={() => setModalOpen(true)}>
              New order
            </Button>
          </div>

          {loading ? (
            <Loader label="Loading orders..." />
          ) : (
            <OrderTable orders={orders} onView={setViewingOrder} />
          )}
        </Card>

        {/* Existing OrderFormModal logic preserved intact */}
        <OrderFormModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onSuccess={loadOrders} 
        />

        {/* FIXED: Viewing Detailed Order Modal Sheet with robust dark theme variants */}
        <Modal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={viewingOrder ? `Order #${viewingOrder.orderNumber}` : ''}
          size="md"
        >
          {viewingOrder && (
            <div className="space-y-4 text-slate-900 dark:text-slate-100">
              
              {/* Customer Status Snapshot Headers */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {viewingOrder.customerNameSnapshot || 'Walk-in Customer'}
                </p>
                <OrderStatusBadge status={viewingOrder.status} />
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  viewingOrder.paymentStatus === 'Pending'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                }`}>
                  {viewingOrder.paymentStatus}
                </span>
              </div>

              {/* Items List Matrix Wrapper */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 max-h-[220px] overflow-y-auto bg-white dark:bg-slate-950/50">
                {viewingOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Qty: {item.quantity}</span>
                    </div>
                    {/* FIXED: Dark mode items subtotal colors context */}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.subtotal || (item.price * item.quantity))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Summary Calculation Panels */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(viewingOrder.totalAmount)}</span>
                </div>
                
                {viewingOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(viewingOrder.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-1">
                  <span>Total</span>
                  <span>{formatCurrency(viewingOrder.finalAmount || viewingOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Timestamp Stamp Meta Tag */}
              <p className="text-xs text-slate-400 dark:text-slate-500 pt-2 text-center">
                Ordered on: {formatDateTime(viewingOrder.createdAt)}
              </p>

              {/* Operational Action Submissions Trigger */}
              <div className="pt-2">
                <Button
                  icon={FileText}
                  variant="secondary"
                  className="w-full justify-center"
                  loading={generatingInvoice}
                  onClick={() => handleGenerateInvoice(viewingOrder._id)}
                >
                  Generate invoice
                </Button>
              </div>

            </div>
          )}
        </Modal>

      </div>
    </DashboardLayout>
  );
}