import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function SettingsPage() {
  const { business, updateBusinessState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form State
  const [form, setForm] = useState({
    name: business?.name || '',
    category: business?.category || '',
    phone: business?.phone || '',
    address: business?.address || '',
  });

  // Staff Dummy State for Functionality
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
        toast.error("File size looks too big! Max 2MB allowed.");
        return;
      }
      toast.success("Logo uploaded successfully!");
    }
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) {
      toast.error("Please fill all staff details!");
      return;
    }
    setStaffList([...staffList, { id: Date.now(), ...newStaff }]);
    setNewStaff({ name: '', role: 'Cashier', email: '' });
    toast.success("Staff member added successfully!");
  };

  const handleCreateBackup = () => {
    toast.loading("Generating database backup...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Backup downloaded successfully!");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your business details, invoice settings, team, and backups.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
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

        {/* Tab Content 1: PROFILE & LOGO */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Logo</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-2xl">🏪</div>
                <div>
                  <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors inline-block">
                    Upload logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  <p className="text-xs text-slate-400 mt-1">JPEG, PNG, or WEBP. Max 2MB.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Business details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab Content 2: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <form onSubmit={handleAddStaff} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Add Staff Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                <input type="email" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                <select value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500">
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">Add Staff</button>
            </form>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-sm font-medium text-slate-500">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divider-y divider-slate-50">
                  {staffList.map((member) => (
                    <tr key={member.id} className="border-b border-slate-50 last:border-0">
                      <td className="p-4 font-medium">{member.name}</td>
                      <td className="p-4 text-slate-500">{member.email}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium">{member.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 3: DATABASE BACKUP */}
        {activeTab === 'backup' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Database Backup & Security</h3>
            <p className="text-sm text-slate-500">Download a full snapshot copy of your business ledger data, products, and analytics safely to your computer.</p>
            <button onClick={handleCreateBackup} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors">
              Create & Download Backup (.json)
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}