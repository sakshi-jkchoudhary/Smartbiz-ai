import axiosInstance from './axiosInstance';

export const inventoryApi = {
  getLowStock: () => axiosInstance.get('/inventory/low-stock'),
  adjustStock: (payload) => axiosInstance.post('/inventory/adjust', payload),
  getLogs: (productId) => axiosInstance.get(`/inventory/logs/${productId}`),
};
