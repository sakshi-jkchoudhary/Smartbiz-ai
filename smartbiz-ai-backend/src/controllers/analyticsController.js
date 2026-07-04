const asyncHandler = require('../middleware/asyncHandler');
const analyticsService = require('../services/analyticsService');
const { success } = require('../utils/apiResponse');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await analyticsService.getSummary(req.businessId);
  success(res, summary);
});

const getSalesTrend = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 7;
  const trend = await analyticsService.getSalesTrend(req.businessId, days);
  success(res, trend);
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await analyticsService.getTopProducts(req.businessId);
  success(res, products);
});

const getCategorySales = asyncHandler(async (req, res) => {
  const categories = await analyticsService.getCategorySales(req.businessId);
  success(res, categories);
});

module.exports = { getSummary, getSalesTrend, getTopProducts, getCategorySales };
