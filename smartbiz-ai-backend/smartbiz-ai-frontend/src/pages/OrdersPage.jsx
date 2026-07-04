import { useState, useEffect, useCallback } from 'react';
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
      setOrders(res.data.data);
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
      toast.success('Invoice generated — check the Invoices page');
      setViewingOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  return (
    <DashboardLayout title="Orders" subtitle="Create and track customer orders">
      <Card>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">{orders.length} total orders</p>
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

      <OrderFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={loadOrders} />

      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title={viewingOrder ? `Order ${viewingOrder.orderNumber}` : ''}
        size="md"
      >
        {viewingOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{viewingOrder.customerNameSnapshot}</p>
              <OrderStatusBadge status={viewingOrder.status} />
            </div>
            <div className="border border-slate-100 rounded-xl divide-y divide-slate-50">
              {viewingOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-slate-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-slate-600">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(viewingOrder.totalAmount)}</span>
            </div>
            {viewingOrder.discount > 0 && (
              <div className="flex justify-between text-sm text-slate-500">
                <span>Discount</span>
                <span>-{formatCurrency(viewingOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total</span>
              <span>{formatCurrency(viewingOrder.finalAmount)}</span>
            </div>
            <p className="text-xs text-slate-400">{formatDateTime(viewingOrder.createdAt)}</p>
            <Button
              icon={FileText}
              variant="secondary"
              className="w-full"
              loading={generatingInvoice}
              onClick={() => handleGenerateInvoice(viewingOrder._id)}
            >
              Generate invoice
            </Button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
