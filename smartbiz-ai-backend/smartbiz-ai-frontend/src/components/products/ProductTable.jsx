import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProductTable from '../components/products/ProductTable';
import ProductFormModal from '../components/products/ProductFormModal';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { inventoryApi } from '../api/inventoryApi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getAll();
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = () => {
    setEditTarget(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditTarget(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        
        {/* Page Header Area - Fixes the dark mode visibility */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
              Products
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your product catalog and pricing
            </p>
          </div>
          
          {/* Add Product Button */}
          <Button icon={Plus} onClick={handleAdd} className="w-full sm:w-auto shrink-0">
            Add product
          </Button>
        </div>

        {/* Search and Table Box */}
        <Card>
          <div className="mb-5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {loading ? (
            <Loader label="Loading products..." />
          ) : (
            <ProductTable 
              products={filteredProducts} 
              onEdit={handleEdit} 
              onDelete={setDeleteTarget} 
            />
          )}
        </Card>

        {/* Add/Edit Product Modal Form Pop-up */}
        {isModalOpen && (
          <ProductFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadProducts}
            product={editTarget}
          />
        )}
      </div>
    </DashboardLayout>
  );
}