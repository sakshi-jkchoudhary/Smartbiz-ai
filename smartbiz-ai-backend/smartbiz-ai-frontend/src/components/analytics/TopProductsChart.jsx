import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function TopProductsChart({ data }) {
  const chartData = {
    labels: data?.map((d) => d.name) || [],
    datasets: [
      {
        data: data?.map((d) => d.revenue) || [],
        backgroundColor: '#4f46e5',
        borderRadius: 6,
        maxBarThickness: 32,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        cornerRadius: 8,
        callbacks: { label: (ctx) => formatCurrency(ctx.raw) },
      },
    },
    scales: {
      x: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: { grid: { display: false }, ticks: { color: '#334155', font: { size: 12 } } },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}
