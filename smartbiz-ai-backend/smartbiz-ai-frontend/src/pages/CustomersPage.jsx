import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerFormModal from '../components/customers/CustomerFormModal';
import CustomerProfileDrawer from '../components/customers/CustomerProfileDrawer';
import { customerApi } from '../api/customerApi';
import { useDebounce } from '../hooks/useDebounce';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerApi.getAll({ search: debouncedSearch });
      setCustomers(res.data.data);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await customerApi.remove(deleteTarget._id);
      toast.success('Customer removed');
      setDeleteTarget(null);
      loadCustomers();
    } catch (err) {
      toast.error('Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Customers" subtitle="Track relationships and purchase history">
      <Card>
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <Button
            icon={Plus}
            onClick={() => {
              setEditingCustomer(null);
              setModalOpen(true);
            }}
          >
            Add customer
          </Button>
        </div>

        {loading ? (
          <Loader label="Loading customers..." />
        ) : (
          <CustomerTable
            customers={customers}
            onView={setViewingId}
            onEdit={(c) => {
              setEditingCustomer(c);
              setModalOpen(true);
            }}
            onDelete={setDeleteTarget}
          />
        )}
      </Card>

      <CustomerFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadCustomers}
        customer={editingCustomer}
      />

      {viewingId && (
        <CustomerProfileDrawer customerId={viewingId} onClose={() => setViewingId(null)} />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This can't be undone.`}
        loading={deleting}
      />
    </DashboardLayout>
  );
}
