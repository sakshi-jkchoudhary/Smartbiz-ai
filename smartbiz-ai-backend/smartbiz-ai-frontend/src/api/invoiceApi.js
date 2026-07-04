import axiosInstance from './axiosInstance';

export const invoiceApi = {
  getAll: () => axiosInstance.get('/invoices'),
  getById: (id) => axiosInstance.get(`/invoices/${id}`),
  generate: (orderId) => axiosInstance.post(`/invoices/generate/${orderId}`),
};
