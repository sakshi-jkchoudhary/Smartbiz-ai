import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { Input, Textarea } from '../common/Input';
import Button from '../common/Button';
import { customerApi } from '../../api/customerApi';

const EMPTY_FORM = { name: '', phone: '', email: '', notes: '' };

export default function CustomerFormModal({ isOpen, onClose, onSuccess, customer }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!customer;

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        notes: customer.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [customer, isOpen]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Customer name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await customerApi.update(customer._id, form);
        toast.success('Customer updated');
      } else {
        await customerApi.create(form);
        toast.success('Customer added');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit customer' : 'Add customer'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          name="name"
          placeholder="Ramesh Kumar"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Phone"
          name="phone"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          label="Email (optional)"
          type="email"
          name="email"
          placeholder="ramesh@example.com"
          value={form.email}
          onChange={handleChange}
        />
        <Textarea
          label="Notes (optional)"
          name="notes"
          placeholder="Prefers home delivery"
          value={form.notes}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Save changes' : 'Add customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
