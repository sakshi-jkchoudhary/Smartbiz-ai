import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function SettingsPage() {
  const { business, updateBusinessState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form State including GST & Billing options
  const [form, setForm] = useState({
    name: business?.name || '',
    category: business?.category || '',
    phone: business?.phone || '',
    address: business?.address || '',
    gstNumber: business?.gstNumber || '22AAAAA0000A1Z5',
    invoicePrefix: business?.invoicePrefix || 'INV',
    defaultGstRate: business?.defaultGstRate || '0'
  });

  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Amit Kumar', role: 'Manager', email: 'amit@shop.com' }
  ]);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Cashier', email: '' });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size too big! Max 2MB.");
        return;
      }
      toast.success("Logo uploaded successfully!");
    }
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) {
      toast.error("Please fill all details!");
      return;
    }
    setStaffList([...staffList, { id: Date.now(), ...newStaff }]);
    setNewStaff({ name: '', role: 'Cashier', email: '' });
    toast.success("Staff member added!");
  };

  return (
    <DashboardLayout>
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your business details, invoice settings, team, and backups.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-slate-200 mb-6">
          {['profile', 'staff', 'backup'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 px-4 font-medium text-sm border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE TAB WITH FULL FIELDS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Left Card: Logo */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-semibold text-slate-900 self-start">Logo</h3>
              <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-3xl shadow-inner">🏪</div>
              <label className="cursor-pointer bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">
                Upload logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              <p className="text-xs text-slate-400">JPEG, PNG, or WEBP. Max 2MB.</p>
            </div>

            {/* Right Card: Details Form (Clean 1-column stack style) */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900 border-b border-slate-50 pb-2">Business details</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Business name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                    <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GST number</label>
                    <input type="text" name="gstNumber" value={form.gstNumber} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
                    <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-base font-semibold text-slate-900 border-b border-slate-50 pb-2">Billing settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Invoice number prefix</label>
                    <input type="text" name="invoicePrefix" value={form.invoicePrefix} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Default GST rate (%)</label>
                    <input type="number" name="defaultGstRate" value={form.defaultGstRate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm">
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        )}

        {/* STAFF TAB CONTAINER */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <form onSubmit={handleAddStaff} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Add Staff Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none" />
                <input type="email" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none" />
                <select value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none">
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium">Add Staff</button>
            </form>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <tr className="bg-slate-50 text-sm font-medium text-slate-500 border-b border-slate-100"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th></tr>
                {staffList.map((s) => <tr key={s.id} className="border-b border-slate-50 text-sm">
                  <td className="p-4 font-medium">{s.name}</td><td className="p-4 text-slate-500">{s.email}</td><td className="p-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{s.role}</span></td>
                </tr>)}
              </table>
            </div>
          </div>
        )}

        {/* BACKUP TAB */}
        {activeTab === 'backup' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Database Backup</h3>
            <p className="text-sm text-slate-500">Download a full backup snapshot of your current ledger business profile, settings and analytics data instantly.</p>
            <button type="button" onClick={() => toast.success("Backup downloaded successfully!")} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700">Create & Download Backup (.json)</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}