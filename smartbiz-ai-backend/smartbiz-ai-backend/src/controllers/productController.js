const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');
const { success, error } = require('../utils/apiResponse');

const getProducts = asyncHandler(async (req, res) => {
  const { search, category, lowStock } = req.query;

  const query = { business: req.businessId, isActive: true };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }

  let products = await Product.find(query).sort({ createdAt: -1 });

  if (lowStock === 'true') {
    products = products.filter((p) => p.stockQty <= p.reorderThreshold);
  }

  success(res, products);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, business: req.businessId });
  if (!product) return error(res, 'Product not found', 404);
  success(res, product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, sku, barcode, price, costPrice, stockQty, unit, reorderThreshold } = req.body;

  if (!name || price === undefined || stockQty === undefined) {
    return error(res, 'Name, price, and stock quantity are required', 400);
  }

  const product = await Product.create({
    business: req.businessId,
    name,
    category,
    sku,
    barcode,
    price,
    costPrice,
    stockQty,
    unit,
    reorderThreshold,
  });

  success(res, product, 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, business: req.businessId });
  if (!product) return error(res, 'Product not found', 404);

  const allowedFields = [
    'name',
    'category',
    'sku',
    'barcode',
    'price',
    'costPrice',
    'stockQty',
    'unit',
    'reorderThreshold',
    'imageUrl',
  ];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  await product.save();
  success(res, product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, business: req.businessId });
  if (!product) return error(res, 'Product not found', 404);

  product.isActive = false;
  await product.save();

  success(res, { message: 'Product deleted' });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
