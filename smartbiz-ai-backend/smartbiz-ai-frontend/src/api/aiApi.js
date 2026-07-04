import axiosInstance from './axiosInstance';

export const aiApi = {
  chat: (message) => axiosInstance.post('/ai/chat', { message }),
  getDailySummary: () => axiosInstance.get('/ai/insight/daily-summary'),
  getReorderRecommendation: () => axiosInstance.get('/ai/insight/reorder-recommendation'),
  getDiscountSuggestion: () => axiosInstance.get('/ai/insight/discount-suggestion'),
};
