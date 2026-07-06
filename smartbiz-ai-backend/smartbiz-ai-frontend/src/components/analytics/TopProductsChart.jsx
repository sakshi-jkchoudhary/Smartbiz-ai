import React from 'react';
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
  // 1. Dynamic check for instant real-time mode rendering values
  const isDarkMode = document.documentElement.classList.contains('dark');

  const chartData = {
    labels: data?.map((d) => d.name) || [],
    datasets: [
      {
        data: data?.map((d) => d.revenue) || [],
        backgroundColor: isDarkMode ? '#6366f1' : '#4f46e5', // Sleek dynamic indigo shades
        borderRadius: 6,
        maxBarThickness: 32,
      },
    ],
  };

  // 2. Options directly configured context aware to sync perfectly with toggles
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        padding: 10,
        callbacks: { label: (ctx) => formatCurrency(ctx.raw) },
      },
    },
    scales: {
      x: {
        grid: { 
          color: isDarkMode ? 'rgba(241, 245, 249, 0.08)' : 'rgba(15, 23, 42, 0.06)' 
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#64748b', // slate-400 vs slate-500
          font: { size: 11 }
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          // FIXED: Pure runtime sync parameters for absolute contrast resolution
          color: isDarkMode ? '#f8fafc' : '#1e293b', // slate-50 vs slate-900
          font: { size: 12, weight: '500' }
        }
      }
    }
  };

  return (
    <div className="w-full min-h-[320px] relative pt-2">
      {/* key component property forces ChartJS canvas to cleanly redraw whenever user switches theme layout */}
      <Bar key={isDarkMode ? 'dark-canvas' : 'light-canvas'} data={chartData} options={options} />
    </div>
  );
}