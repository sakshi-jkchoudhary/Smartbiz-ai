const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const error = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message, statusCode });
};

module.exports = { success, error };
