import axiosInstance from './axiosInstance';

export const orderApi = {
  getAll: (params) => axiosInstance.get('/orders', { params }),
  getById: (id) => axiosInstance.get(`/orders/${id}`),
  create: (payload) => axiosInstance.post('/orders', payload),
  updateStatus: (id, status) => axiosInstance.put(`/orders/${id}/status`, { status }),
};
