import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import LowStockAlertBanner from '../components/inventory/LowStockAlertBanner';
import StockTable from '../components/inventory/StockTable';
import StockAdjustModal from '../components/inventory/StockAdjustModal';
import { productApi } from '../api/productApi';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustTarget, setAdjustTarget] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const lowStockCount = products.filter((p) => p.stockQty <= p.reorderThreshold).length;

  return (
    <DashboardLayout title="Inventory" subtitle="Track stock levels and manage restocks">
      <LowStockAlertBanner count={lowStockCount} />
      <Card>
        {loading ? (
          <Loader label="Loading inventory..." />
        ) : (
          <StockTable products={products} onAdjust={setAdjustTarget} />
        )}
      </Card>

      <StockAdjustModal
        isOpen={!!adjustTarget}
        onClose={() => setAdjustTarget(null)}
        onSuccess={loadProducts}
        product={adjustTarget}
      />
    </DashboardLayout>
  );
}
