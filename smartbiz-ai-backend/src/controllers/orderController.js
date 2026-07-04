const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { adjustStock } = require('../services/stockService');
const { success, error } = require('../utils/apiResponse');

const generateOrderNumber = async (businessId) => {
  const count = await Order.countDocuments({ business: businessId });
  return `ORD-${String(count + 1).padStart(4, '0')}`;
};

const getOrders = asyncHandler(async (req, res) => {
  const { status, from, to, limit } = req.query;
  const query = { business: req.businessId };

  if (status) query.status = status;
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  let ordersQuery = Order.find(query).sort({ createdAt: -1 });
  if (limit) ordersQuery = ordersQuery.limit(Number(limit));

  const orders = await ordersQuery;
  success(res, orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, business: req.businessId });
  if (!order) return error(res, 'Order not found', 404);
  success(res, order);
});

const createOrder = asyncHandler(async (req, res) => {
  const { customerId, items, discount = 0, paymentMode = 'cash' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return error(res, 'Order must include at least one item', 400);
  }

  let customer = null;
  let customerNameSnapshot = 'Walk-in Customer';
  if (customerId) {
    customer = await Customer.findOne({ _id: customerId, business: req.businessId });
    if (!customer) return error(res, 'Customer not found', 404);
    customerNameSnapshot = customer.name;
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findOne({ _id: item.productId, business: req.businessId });
    if (!product) {
      return error(res, `Product not found: ${item.productId}`, 404);
    }
    if (product.stockQty < item.quantity) {
      return error(
        res,
        `Insufficient stock for ${product.name}. Available: ${product.stockQty}, requested: ${item.quantity}`,
        400
      );
    }

    const subtotal = product.price * item.quantity;
    totalAmount += subtotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal,
    });
  }

  const finalAmount = Math.max(totalAmount - Number(discount || 0), 0);
  const orderNumber = await generateOrderNumber(req.businessId);

  const order = await Order.create({
    business: req.businessId,
    customer: customer?._id || null,
    customerNameSnapshot,
    orderNumber,
    items: orderItems,
    totalAmount,
    discount,
    finalAmount,
    status: 'completed',
    paymentMode,
  });

  for (const item of orderItems) {
    await adjustStock({
      businessId: req.businessId,
      productId: item.product,
      changeType: 'sale',
      quantityChange: -item.quantity,
      note: `Sold via order ${orderNumber}`,
    });
  }

  if (customer) {
    customer.totalSpend += finalAmount;
    customer.totalOrders += 1;
    customer.lastOrderDate = new Date();
    if (customer.totalSpend >= 10000 && !customer.tags.includes('VIP')) {
      customer.tags.push('VIP');
    }
    await customer.save();
  }

  success(res, order, 201);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return error(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const order = await Order.findOne({ _id: req.params.id, business: req.businessId });
  if (!order) return error(res, 'Order not found', 404);

  if (status === 'cancelled' && order.status !== 'cancelled') {
    for (const item of order.items) {
      await adjustStock({
        businessId: req.businessId,
        productId: item.product,
        changeType: 'return',
        quantityChange: item.quantity,
        note: `Order ${order.orderNumber} cancelled`,
      });
    }
  }

  order.status = status;
  await order.save();

  success(res, order);
});

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };
