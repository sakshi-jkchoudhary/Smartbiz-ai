const { error } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  error(res, `Route not found: ${req.originalUrl}`, 404);
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return error(res, messages.join(', '), 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return error(res, `${field} already exists`, 400);
  }

  if (err.name === 'CastError') {
    return error(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  const statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  error(res, err.message || 'Internal server error', statusCode);
};

module.exports = { notFound, errorHandler };
