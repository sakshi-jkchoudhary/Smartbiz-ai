import React, { useState, useEffect } from 'react';
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
  // 1. Dynamic state to track dark mode switch instantly
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial mode on mount
    setIsDark(document.documentElement.classList.contains('dark'));

    // 2. Observe html class alterations live
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const chartData = {
    labels: data?.map((d) => d.name) || [],
    datasets: [
      {
        data: data?.map((d) => d.revenue) || [],
        backgroundColor: isDark ? '#6366f1' : '#4f46e5',
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
        backgroundColor: isDark ? '#0f172a' : '#1e293b',
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
          color: isDark ? 'rgba(241, 245, 249, 0.08)' : 'rgba(15, 23, 42, 0.06)' 
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 }
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          // Absolute explicit solid colors based on live tracked state
          color: isDark ? '#f8fafc' : '#1e293b',
          font: { size: 12, weight: '500' }
        }
      }
    }
  };

  return (
    <div className="w-full min-h-[320px] relative pt-2">
      {/* Changing key matching the tracked state strictly forces dynamic layout redraw */}
      <Bar key={isDark ? 'chart-dark' : 'chart-light'} data={chartData} options={options} />
    </div>
  );
}