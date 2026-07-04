const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const { adjustStock } = require('../services/stockService');
const { success, error } = require('../utils/apiResponse');

const getLowStock = asyncHandler(async (req, res) => {
  const products = await Product.find({ business: req.businessId, isActive: true });
  const lowStockProducts = products.filter((p) => p.stockQty <= p.reorderThreshold);
  success(res, lowStockProducts);
});

const adjustStockHandler = asyncHandler(async (req, res) => {
  const { productId, changeType, quantityChange, note } = req.body;

  if (!productId || !changeType || quantityChange === undefined) {
    return error(res, 'productId, changeType, and quantityChange are required', 400);
  }

  const product = await adjustStock({
    businessId: req.businessId,
    productId,
    changeType,
    quantityChange: Number(quantityChange),
    note,
  });

  success(res, product);
});

const getStockLogs = asyncHandler(async (req, res) => {
  const logs = await StockLog.find({
    business: req.businessId,
    product: req.params.productId,
  }).sort({ createdAt: -1 });

  success(res, logs);
});

module.exports = { getLowStock, adjustStockHandler, getStockLogs };
