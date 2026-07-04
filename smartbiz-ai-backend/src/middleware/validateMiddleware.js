const { error } = require('../utils/apiResponse');

const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return error(res, `Missing required field(s): ${missing.join(', ')}`, 400);
  }

  next();
};

module.exports = { validateRequired };
