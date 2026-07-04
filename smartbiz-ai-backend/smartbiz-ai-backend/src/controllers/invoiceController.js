const asyncHandler = require('../middleware/asyncHandler');
const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const { generateInvoiceNumber } = require('../services/invoiceService');
const { success, error } = require('../utils/apiResponse');

const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ business: req.businessId }).sort({ createdAt: -1 });
  success(res, invoices);
});

const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, business: req.businessId });
  if (!invoice) return error(res, 'Invoice not found', 404);
  success(res, invoice);
});

const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, business: req.businessId });
  if (!order) return error(res, 'Order not found', 404);

  const existing = await Invoice.findOne({ order: order._id });
  if (existing) {
    return success(res, existing);
  }

  const invoiceNumber = await generateInvoiceNumber(req.businessId);

  const invoice = await Invoice.create({
    business: req.businessId,
    order: order._id,
    invoiceNumber,
    customerNameSnapshot: order.customerNameSnapshot,
    items: order.items,
    totalAmount: order.totalAmount,
    discount: order.discount,
    finalAmount: order.finalAmount,
  });

  success(res, invoice, 201);
});

module.exports = { getInvoices, getInvoice, generateInvoice };
