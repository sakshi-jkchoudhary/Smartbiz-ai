import React, { useEffect, useState } from 'react';
import { Search, AlertTriangle, ArrowUpDown, PackageMinus } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import EmptyState from '../common/EmptyState';
import Badge from '../common/Badge';
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

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        
        {/* Page Title Area - Dark mode supported */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Inventory Tracking
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time stock levels, reorder alerts, and valuation.
          </p>
        </div>

        {/* Main Section Card */}
        <Card>
          {/* Search Box Wrap */}
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
            /* RESPONSIVE CLEAN DARK MODE TABLE */
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">SKU / Barcode</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Min Threshold</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {filteredInventory.map((item) => {
                    const isLowStock = item.stockQty <= item.reorderThreshold;
                    return (
                      <tr key={item._id || item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        
                        {/* Item Name */}
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </td>
                        
                        {/* SKU / Barcode */}
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                          {item.sku || item.barcode || 'N/A'}
                        </td>
                        
                        {/* Current Stock */}
                        <td className={`py-3 px-4 font-semibold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.stockQty} {item.unit || 'pcs'}
                        </td>
                        
                        {/* Minimum Threshold */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {item.reorderThreshold || '5'} {item.unit || 'pcs'}
                        </td>
                        
                        {/* Status Alert Badge */}
                        <td className="py-3 px-4">
                          {isLowStock ? (
                            <Badge color="red">
                              <span className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Low Stock
                              </span>
                            </Badge>
                          ) : (
                            <Badge color="green">Good Standing</Badge>
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