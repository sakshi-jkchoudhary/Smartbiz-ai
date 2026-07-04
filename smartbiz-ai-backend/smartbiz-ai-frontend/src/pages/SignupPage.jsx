import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';
import { Input, Select } from '../components/common/Input';
import Button from '../components/common/Button';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { BUSINESS_CATEGORIES } from '../utils/constants';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    businessName: '',
    category: BUSINESS_CATEGORIES[0],
    ownerName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.businessName) newErrors.businessName = 'Business name is required';
    if (!form.ownerName) newErrors.ownerName = 'Your name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password || form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.signup(form);
      login(res.data.data);
      toast.success('Account created — welcome to SmartBiz AI');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your business dashboard in under 2 minutes"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Business name"
          name="businessName"
          placeholder="Sharma General Store"
          value={form.businessName}
          onChange={handleChange}
          error={errors.businessName}
        />
        <Select
          label="Business category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {BUSINESS_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
        <Input
          label="Your name"
          name="ownerName"
          placeholder="Ramesh Sharma"
          value={form.ownerName}
          onChange={handleChange}
          error={errors.ownerName}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@business.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Create account
        </Button>
      </form>
      <p className="text-sm text-slate-500 mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
