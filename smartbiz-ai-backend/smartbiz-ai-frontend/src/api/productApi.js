import axiosInstance from './axiosInstance';

export const productApi = {
  getAll: (params) => axiosInstance.get('/products', { params }),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  create: (payload) => axiosInstance.post('/products', payload),
  update: (id, payload) => axiosInstance.put(`/products/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/products/${id}`),
};
