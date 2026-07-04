export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const BUSINESS_CATEGORIES = [
  'Retail Shop',
  'Grocery Store',
  'Cafe',
  'Salon',
  'Coaching Institute',
  'Clinic',
  'Other',
];

export const ORDER_STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export const PAYMENT_MODES = ['cash', 'upi', 'card', 'other'];

export const AI_QUICK_QUESTIONS = [
  'Which products are low in stock?',
  'Which customer buys the most?',
  "What are today's sales?",
  'Generate a business summary',
  'What should I reorder?',
  'Suggest a discount strategy',
];
