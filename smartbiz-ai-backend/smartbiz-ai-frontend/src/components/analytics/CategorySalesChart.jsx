import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#10b981', '#f59e0b', '#ef4444'];

export default function CategorySalesChart({ data }) {
  const chartData = {
    labels: data?.map((d) => d.category) || [],
    datasets: [
      {
        data: data?.map((d) => d.revenue) || [],
        backgroundColor: COLORS,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 8, font: { size: 11 }, color: '#64748b', padding: 12 },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        cornerRadius: 8,
        callbacks: { label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}` },
      },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
