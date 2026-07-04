const asyncHandler = require('../middleware/asyncHandler');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { success, error } = require('../utils/apiResponse');

const getCustomers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = { business: req.businessId };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const customers = await Customer.find(query).sort({ totalSpend: -1 });
  success(res, customers);
});

const getTopCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ business: req.businessId })
    .sort({ totalSpend: -1 })
    .limit(5);
  success(res, customers);
});

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, business: req.businessId });
  if (!customer) return error(res, 'Customer not found', 404);

  const orders = await Order.find({ customer: customer._id, business: req.businessId }).sort({
    createdAt: -1,
  });

  success(res, { customer, orders });
});

const createCustomer = asyncHandler(async (req, res) => {
  const { name, phone, email, notes } = req.body;

  if (!name) return error(res, 'Customer name is required', 400);

  const customer = await Customer.create({
    business: req.businessId,
    name,
    phone,
    email,
    notes,
  });

  success(res, customer, 201);
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, business: req.businessId });
  if (!customer) return error(res, 'Customer not found', 404);

  const allowedFields = ['name', 'phone', 'email', 'notes', 'tags'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) customer[field] = req.body[field];
  });

  await customer.save();
  success(res, customer);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, business: req.businessId });
  if (!customer) return error(res, 'Customer not found', 404);

  await customer.deleteOne();
  success(res, { message: 'Customer deleted' });
});

module.exports = {
  getCustomers,
  getTopCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
