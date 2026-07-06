import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import OrderTable from '../components/orders/OrderTable';
import OrderFormModal from '../components/orders/OrderFormModal';
import { orderApi } from '../api/orderApi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <DashboardLayout>
      {/* pt-20 ensures the title elements push down smoothly past the absolute fixed navbar */}
      <div className="w-full space-y-6 pt-20 px-2">
        
        {/* Visible Native Page Headers */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
              Orders
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create and track customer orders
            </p>
          </div>
          <Button icon={Plus} onClick={() => setModalOpen(true)}>
            New order
          </Button>
        </div>

        {/* Main Orders Grid Content List */}
        <Card>
          <div className="mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {orders.length} total orders
            </p>
          </div>

          {loading ? (
            <Loader label="Loading orders..." />
          ) : (
            <OrderTable orders={orders} />
          )}
        </Card>

        <OrderFormModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onSuccess={loadOrders} 
        />

      </div>
    </DashboardLayout>
  );
}