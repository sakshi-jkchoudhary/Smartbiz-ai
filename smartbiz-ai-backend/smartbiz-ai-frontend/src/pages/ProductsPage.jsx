import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ProductTable from '../components/products/ProductTable';
import ProductFormModal from '../components/products/ProductFormModal';
import { productApi } from '../api/productApi';
import { useDebounce } from '../hooks/useDebounce';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll({ search: debouncedSearch });
      setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await productApi.remove(deleteTarget._id);
      toast.success('Product removed');
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Products" subtitle="Manage your product catalog and pricing">
      <div className="w-full space-y-6">
        
        <Card>
          {/* Responsive container ensures search input and Add Product button sit side by side */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            
            {/* The missing action button */}
            <Button icon={Plus} onClick={handleAdd} className="w-full sm:w-auto shrink-0">
              Add product
            </Button>
          </div>

          {loading ? (
            <Loader label="Loading products..." />
          ) : (
            <ProductTable 
              products={products} 
              onEdit={handleEdit} 
              onDelete={setDeleteTarget} 
            />
          )}
        </Card>

      </div>
      <ProductFormModal
  open={modalOpen}
  onClose={() => {
    setModalOpen(false);
    setEditingProduct(null);
  }}
  product={editingProduct}
  onSuccess={() => {
    setModalOpen(false);
    setEditingProduct(null);
    loadProducts();
  }}
/>

<ConfirmDialog
  open={!!deleteTarget}
  title="Delete Product"
  description="Are you sure you want to delete this product?"
  confirmText="Delete"
  loading={deleting}
  onConfirm={handleDeleteConfirm}
  onClose={() => setDeleteTarget(null)}
/>
    </DashboardLayout>
  );
}