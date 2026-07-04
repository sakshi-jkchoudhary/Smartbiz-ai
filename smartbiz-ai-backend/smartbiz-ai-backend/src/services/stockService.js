const Product = require('../models/Product');
const StockLog = require('../models/StockLog');

const adjustStock = async ({ businessId, productId, changeType, quantityChange, note = '' }) => {
  const product = await Product.findOne({ _id: productId, business: businessId });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const resultingStockQty = product.stockQty + quantityChange;

  if (resultingStockQty < 0) {
    const err = new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQty}`);
    err.statusCode = 400;
    throw err;
  }

  product.stockQty = resultingStockQty;
  await product.save();

  await StockLog.create({
    business: businessId,
    product: productId,
    changeType,
    quantityChange,
    resultingStockQty,
    note,
  });

  return product;
};

module.exports = { adjustStock };
