const jwt = require('jsonwebtoken');

const generateToken = (userId, businessId) => {
  return jwt.sign({ userId, businessId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
