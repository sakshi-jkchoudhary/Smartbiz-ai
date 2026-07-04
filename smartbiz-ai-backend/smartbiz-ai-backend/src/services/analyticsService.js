const Order = require('../models/Order');
const mongoose = require('mongoose');

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getRevenueForRange = async (businessId, from, to) => {
  const result = await Order.aggregate([
    {
      $match: {
        business: new mongoose.Types.ObjectId(businessId),
        status: 'completed',
        createdAt: { $gte: from, $lte: to },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$finalAmount' },
        orders: { $sum: 1 },
      },
    },
  ]);

  return result[0] ? { revenue: result[0].revenue, orders: result[0].orders } : { revenue: 0, orders: 0 };
};

const getSummary = async (businessId) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = daysAgo(7);
  const monthStart = daysAgo(30);

  const [today, week, month] = await Promise.all([
    getRevenueForRange(businessId, todayStart, now),
    getRevenueForRange(businessId, weekStart, now),
    getRevenueForRange(businessId, monthStart, now),
  ]);

  const avgOrderValue = month.orders > 0 ? Math.round(month.revenue / month.orders) : 0;

  return { today, week, month, avgOrderValue };
};

const getSalesTrend = async (businessId, days = 7) => {
  const from = daysAgo(days - 1);

  const result = await Order.aggregate([
    {
      $match: {
        business: new mongoose.Types.ObjectId(businessId),
        status: 'completed',
        createdAt: { $gte: from },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$finalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const map = new Map(result.map((r) => [r._id, r.revenue]));
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgo(i);
    const key = date.toISOString().split('T')[0];
    trend.push({
      label: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      revenue: map.get(key) || 0,
    });
  }
  return trend;
};

const getTopProducts = async (businessId, limit = 5) => {
  const result = await Order.aggregate([
    { $match: { business: new mongoose.Types.ObjectId(businessId), status: 'completed' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        revenue: { $sum: '$items.subtotal' },
        quantity: { $sum: '$items.quantity' },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    { $project: { _id: 0, name: '$_id', revenue: 1, quantity: 1 } },
  ]);

  return result;
};

const getCategorySales = async (businessId) => {
  const result = await Order.aggregate([
    { $match: { business: new mongoose.Types.ObjectId(businessId), status: 'completed' } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$productInfo.category', 'Uncategorized'] },
        revenue: { $sum: '$items.subtotal' },
      },
    },
    { $sort: { revenue: -1 } },
    { $project: { _id: 0, category: '$_id', revenue: 1 } },
  ]);

  return result;
};

module.exports = { getSummary, getSalesTrend, getTopProducts, getCategorySales };
