import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { BUSINESS_CATEGORIES } from '../utils/constants';

export default function SettingsPage() {
  const { business, updateBusinessState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [form, setForm] = useState({
    name: business?.name || '',
    category: business?.category || BUSINESS_CATEGORIES[0],
    phone: business?.phone || '',
    address: business?.address || '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.updateBusiness(form);
      updateBusinessState(res.data.data);
      toast.success('Business profile updated!');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Business Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your business details, invoice settings, team, and backups.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'staff', label: 'Staff' },
          { id: 'backup', label: 'Backup' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          {/* Logo Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Logo</h3>
            <div className="flex flex-col items-start gap-3">
              <div className="w-24 h-24 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                🏪
              </div>
              <button type="button" className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Upload logo
              </button>
              <p className="text-xs text-slate-400">JPEG, PNG, or WEBP. Max 2MB.</p>
            </div>
          </div>

          {/* Business Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Business details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Business name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Billing Settings Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">Billing settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Invoice number prefix</label>
                  <input
                    type="text"
                    defaultValue="INV"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default GST rate (%)</label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                New invoice numbers will look like INV-0001. The default GST rate pre-fills (but doesn't lock) the field on new invoices.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'staff' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-500">
          Staff management view coming soon.
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-500">
          Database backup options coming soon.
        </div>
      )}
    </DashboardLayout>
  );
}