import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/Input';
import Button from '../common/Button';
import { inventoryApi } from '../../api/inventoryApi';

export default function StockAdjustModal({ isOpen, onClose, onSuccess, product }) {
  const [form, setForm] = useState({ changeType: 'restock', quantityChange: '', note: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.quantityChange || Number(form.quantityChange) === 0) {
      toast.error('Enter a quantity to adjust');
      return;
    }
    setLoading(true);
    try {
      const signedQty =
        form.changeType === 'manual_adjustment'
          ? Number(form.quantityChange)
          : Math.abs(Number(form.quantityChange));
      await inventoryApi.adjustStock({
        productId: product._id,
        changeType: form.changeType,
        quantityChange: signedQty,
        note: form.note,
      });
      toast.success('Stock updated');
      onSuccess();
      onClose();
      setForm({ changeType: 'restock', quantityChange: '', note: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust stock — ${product?.name || ''}`} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          Current stock: <span className="font-medium text-slate-800">{product?.stockQty} {product?.unit}</span>
        </p>
        <Select label="Adjustment type" name="changeType" value={form.changeType} onChange={handleChange}>
          <option value="restock">Restock (add)</option>
          <option value="manual_adjustment">Manual correction (+/-)</option>
          <option value="return">Customer return (add)</option>
        </Select>
        <Input
          label={form.changeType === 'manual_adjustment' ? 'Quantity change (use - to reduce)' : 'Quantity to add'}
          name="quantityChange"
          type="number"
          placeholder="e.g. 20"
          value={form.quantityChange}
          onChange={handleChange}
        />
        <Textarea
          label="Note (optional)"
          name="note"
          placeholder="e.g. New supplier delivery"
          value={form.note}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Update stock
          </Button>
        </div>
      </form>
    </Modal>
  );
}
