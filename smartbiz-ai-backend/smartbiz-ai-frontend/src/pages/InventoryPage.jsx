import React, { useEffect, useState } from 'react';
import { Search, AlertTriangle, PackageMinus } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
// FIXED: Sahi folders path components lookup sequence
import Badge from '../components/common/Badge';
import { inventoryApi } from '../api/inventoryApi';
import { formatCurrency } from '../utils/formatCurrency';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await inventoryApi.getAll();
        setInventory(res.data.data || []);
      } catch (err) {
        console.error('Failed to load inventory data', err);
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, []);

  const filteredInventory = inventory.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = inventory.filter(item => item.stockQty <= item.reorderThreshold).length;

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        
        {/* Page Title Area */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Inventory Tracking
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time stock levels, reorder alerts, and valuation.
          </p>
        </div>

        {/* Dynamic Dark Mode Low Stock Alert Banner */}
        {lowStockCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-2xl transition-colors">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">{lowStockCount} products</span> are running low on stock. Restock soon to avoid missed sales.
            </p>
          </div>
        )}

        {/* Main Table Layout Section */}
        <Card>
          <div className="mb-5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {loading ? (
            <Loader label="Loading inventory details..." />
          ) : filteredInventory.length === 0 ? (
            <EmptyState
              icon={PackageMinus}
              title="No inventory recorded"
              description="Your product catalog stock details will sync here automatically."
            />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Reorder At</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {filteredInventory.map((item) => {
                    const isLowStock = item.stockQty <= item.reorderThreshold;
                    return (
                      <tr key={item._id || item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {item.category || '-'}
                        </td>
                        <td className={`py-3 px-4 font-semibold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          {item.stockQty} {item.unit || 'pcs'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {item.reorderThreshold || '5'} {item.unit || 'pcs'}
                        </td>
                        <td className="py-3 px-4">
                          {isLowStock ? (
                            <Badge color="red">Low stock</Badge>
                          ) : (
                            <Badge color="green">Healthy</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </DashboardLayout>
  );
}