const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const { error } = require('../utils/apiResponse');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return error(res, 'Not authorized, no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return error(res, 'Not authorized, user not found', 401);
    }

    req.user = user;
    req.businessId = decoded.businessId;
    next();
  } catch (err) {
    return error(res, 'Not authorized, invalid or expired token', 401);
  }
});

module.exports = { protect };
