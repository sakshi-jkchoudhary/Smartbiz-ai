const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Business = require('../models/Business');
const generateToken = require('../utils/generateToken');
const { success, error } = require('../utils/apiResponse');

const signup = asyncHandler(async (req, res) => {
  const { businessName, category, ownerName, email, password } = req.body;

  if (!businessName || !ownerName || !email || !password) {
    return error(res, 'Business name, owner name, email, and password are required', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return error(res, 'An account with this email already exists', 400);
  }

  const business = await Business.create({
    name: businessName,
    category: category || 'Other',
  });

  const user = await User.create({
    business: business._id,
    name: ownerName,
    email: email.toLowerCase(),
    password,
    role: 'owner',
  });

  const token = generateToken(user._id, business._id);

  success(
    res,
    {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      business: { id: business._id, name: business.name, category: business.category },
    },
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return error(res, 'Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return error(res, 'Invalid email or password', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return error(res, 'Invalid email or password', 401);
  }

  const business = await Business.findById(user.business);
  const token = generateToken(user._id, user.business);

  success(res, {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    business: {
      id: business._id,
      name: business.name,
      category: business.category,
      phone: business.phone,
      address: business.address,
      currency: business.currency,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.businessId);

  success(res, {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    business: {
      id: business._id,
      name: business.name,
      category: business.category,
      phone: business.phone,
      address: business.address,
      currency: business.currency,
      lowStockThresholdDefault: business.lowStockThresholdDefault,
    },
  });
});

const updateBusiness = asyncHandler(async (req, res) => {
  const { name, category, phone, address, lowStockThresholdDefault } = req.body;

  const business = await Business.findById(req.businessId);
  if (!business) {
    return error(res, 'Business not found', 404);
  }

  if (name !== undefined) business.name = name;
  if (category !== undefined) business.category = category;
  if (phone !== undefined) business.phone = phone;
  if (address !== undefined) business.address = address;
  if (lowStockThresholdDefault !== undefined)
    business.lowStockThresholdDefault = lowStockThresholdDefault;

  await business.save();

  success(res, {
    id: business._id,
    name: business.name,
    category: business.category,
    phone: business.phone,
    address: business.address,
    currency: business.currency,
    lowStockThresholdDefault: business.lowStockThresholdDefault,
  });
});

module.exports = { signup, login, getMe, updateBusiness };
