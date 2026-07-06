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
      x: {
        grid: { color: 'rgba(241, 245, 249, 0.08)' },
        ticks: {
          // Dynamic text color checks: checks if dark mode is active on document root
          color: () => document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#64748b',
          font: { size: 11 }
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          // FIXED: Amul Milk aur baki labels dark mode me dynamic white/light gray ho jayenge
          color: () => document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#334155',
          font: { size: 12 }
        }
      }
    }
  }
};