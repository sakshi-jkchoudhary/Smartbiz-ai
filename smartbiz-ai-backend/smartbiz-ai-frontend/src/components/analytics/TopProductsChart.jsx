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
  const chartData = {
    labels: data?.map((d) => d.name) || [],
    datasets: [
      {
        data: data?.map((d) => d.revenue) || [],
        backgroundColor: () => document.documentElement.classList.contains('dark') ? '#6366f1' : '#4f46e5',
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
        backgroundColor: () => document.documentElement.classList.contains('dark') ? '#0f172a' : '#1e293b',
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
          color: () => document.documentElement.classList.contains('dark') ? 'rgba(241, 245, 249, 0.08)' : 'rgba(15, 23, 42, 0.06)' 
        },
        ticks: {
          color: () => document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b',
          font: { size: 11 }
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          // ABSOLUTE DYNAMIC EXECUTION FOR DARK/LIGHT PARITY
          color: () => document.documentElement.classList.contains('dark') ? '#f8fafc' : '#1e293b',
          font: { size: 12, weight: '500' }
        }
      }
    }
  };

  // Check current theme value for dynamic conditional wrapper rendering
  const isDarkActive = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div className="w-full min-h-[320px] relative pt-2">
      {/* Forcing canvas refresh on toggle updates using timestamp or state keys */}
      <Bar 
        key={isDarkActive ? 'canvas-dark-theme' : 'canvas-light-theme'} 
        data={chartData} 
        options={options} 
      />
    </div>
  );
}