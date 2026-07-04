import axiosInstance from './axiosInstance';

export const analyticsApi = {
  getSummary: () => axiosInstance.get('/analytics/summary'),
  getSalesTrend: (days = 7) => axiosInstance.get('/analytics/sales-trend', { params: { days } }),
  getTopProducts: () => axiosInstance.get('/analytics/top-products'),
  getCategorySales: () => axiosInstance.get('/analytics/category-sales'),
};
