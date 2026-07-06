import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { IndianRupee, ShoppingCart, TrendingUp, Percent } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import StatCard from '../components/dashboard/StatCard';
import SalesTrendChart from '../components/analytics/SalesTrendChart';
import CategorySalesChart from '../components/analytics/CategorySalesChart';
import TopProductsChart from '../components/analytics/TopProductsChart';
import { analyticsApi } from '../api/analyticsApi';
import { formatCurrency } from '../utils/formatCurrency';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, t, c, p] = await Promise.all([
          analyticsApi.getSummary(),
          analyticsApi.getSalesTrend(14),
          analyticsApi.getCategorySales(),
          analyticsApi.getTopProducts(),
        ]);
        setSummary(s.data.data);
        setTrend(t.data.data);
        setCategorySales(c.data.data);
        setTopProducts(p.data.data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Analytics">
        <Loader full label="Crunching your numbers..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* pt-4 lagane se Analytics heading Topbar se safe door niche shift ho jayegi */}
      <div className="w-full space-y-6 pt-4">
        
        {/* Clean Visible Page Title Block */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
            Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Understand what's driving your business
          </p>
        </div>

        {/* Stat Cards Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="This month" value={formatCurrency(summary?.month?.revenue)} icon={IndianRupee} />
          <StatCard label="This week" value={formatCurrency(summary?.week?.revenue)} icon={TrendingUp} />
          <StatCard label="Orders this month" value={summary?.month?.orders ?? 0} icon={ShoppingCart} />
          <StatCard label="Avg order value" value={formatCurrency(summary?.avgOrderValue)} icon={Percent} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <Card>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Revenue trend, last 14 days</p>
            <SalesTrendChart data={trend} />
          </Card>
          
          <Card>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Revenue by category</p>
            <CategorySalesChart data={categorySales} />
          </Card>
        </div>

        <Card>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top selling products</p>
          <TopProductsChart data={topProducts} />
        </Card>

      </div>
    </DashboardLayout>
  );
}