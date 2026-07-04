import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
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

  const firstName = user?.name?.split(' ')[0] || 'there';
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
    <DashboardLayout
      title={`Good day, ${firstName}`}
      subtitle={`${business?.name || 'Your business'} · ${today}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900 mb-4">
            Revenue trend, last 7 days
          </p>
          <RevenueChart data={salesTrend} />
        </Card>
        <AIInsightCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LowStockWidget items={lowStock} />
        <TopCustomersWidget customers={topCustomers} />
        <RecentOrdersWidget orders={recentOrders} />
      </div>
    </DashboardLayout>
  );
}
