import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingCart, AlertTriangle, TrendingUp, Hourglass } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import LowStockWidget from '../components/dashboard/LowStockWidget';
import TopCustomersWidget from '../components/dashboard/TopCustomersWidget';
import RecentOrdersWidget from '../components/dashboard/RecentOrdersWidget';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { analyticsApi } from '../api/analyticsApi';
import { inventoryApi } from '../api/inventoryApi';
import { customerApi } from '../api/customerApi';
import { orderApi } from '../api/orderApi';
import { formatCurrency } from '../utils/formatCurrency';

export default function DashboardPage() {
  const { user, business } = useAuth();
  const [summary, setSummary] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [summaryRes, trendRes, lowStockRes, customersRes, ordersRes] = await Promise.all([
          analyticsApi.getSummary(),
          analyticsApi.getSalesTrend(7),
          inventoryApi.getLowStock(),
          customerApi.getTop(),
          orderApi.getAll({ limit: 5 }),
        ]);
        setSummary(summaryRes.data.data);
        setSalesTrend(trendRes.data.data);
        setLowStock(lowStockRes.data.data);
        setTopCustomers(customersRes.data.data);
        setRecentOrders(ordersRes.data.data);
      } catch (err) {
        console.error('Dashboard load failed', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <Loader full label="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Greetings Section with Perfect Dark Mode Text */}
        <div className="mb-6">
            <h2 className="text-2xl fixed font-bold text-slate-900 dark:text-white transition-colors duration-200">
            Welcome back, {firstName}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-200">
            Here's how your business is doing today.
          </p>
        </div>

        {/* Top Stat Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <StatCard
            label="Today's revenue"
            value={formatCurrency(summary?.today?.revenue)}
            icon={IndianRupee}
            accent
          />
          <StatCard
            label="Orders today"
            value={summary?.today?.orders ?? 0}
            icon={ShoppingCart}
          />
          <StatCard
            label="Low stock items"
            value={lowStock.length}
            icon={AlertTriangle}
          />
          <StatCard
            label="Avg order value"
            value={formatCurrency(summary?.avgOrderValue)}
            icon={TrendingUp}
          />
          <StatCard
            label="Pending orders"
            value={formatCurrency(
              recentOrders?.filter((o) => o.discount === 0.99).reduce((sum, o) => sum + (o.finalAmount || 0), 0)
            )}
            icon={Hourglass}
          />
        </div>

        {/* Middle Section: Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-200">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Revenue trend, last 7 days
            </p>
            <RevenueChart data={salesTrend} />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-200">
            <AIInsightCard />
          </div>
        </div>

        {/* Lower Section: Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-200">
            <LowStockWidget items={lowStock} />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-200">
            <TopCustomersWidget customers={topCustomers} />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-200">
            <RecentOrdersWidget orders={recentOrders} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}