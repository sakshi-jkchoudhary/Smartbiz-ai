import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import { Input, Select } from '../components/common/Input';
import Button from '../components/common/Button';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { BUSINESS_CATEGORIES } from '../utils/constants';

export default function SettingsPage() {
  const { business, updateBusinessState } = useAuth();
  const [form, setForm] = useState({
    name: business?.name || '',
    category: business?.category || BUSINESS_CATEGORIES[0],
    phone: business?.phone || '',
    address: business?.address || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.updateBusiness(form);
      updateBusinessState(res.data.data);
      toast.success('Business profile updated');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your business profile">
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Business name" name="name" value={form.name} onChange={handleChange} />
          <Select label="Category" name="category" value={form.category} onChange={handleChange}>
            {BUSINESS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <Button type="submit" loading={loading}>
            Save changes
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}
