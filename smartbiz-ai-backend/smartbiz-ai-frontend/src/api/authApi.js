import axiosInstance from './axiosInstance';

export const authApi = {
  signup: (payload) => axiosInstance.post('/auth/signup', payload),
  login: (payload) => axiosInstance.post('/auth/login', payload),
  getMe: () => axiosInstance.get('/auth/me'),
  updateBusiness: (payload) => axiosInstance.put('/auth/business', payload),
};
