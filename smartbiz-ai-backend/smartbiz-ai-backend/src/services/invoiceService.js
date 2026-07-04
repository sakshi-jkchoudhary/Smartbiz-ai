const Invoice = require('../models/Invoice');

const generateInvoiceNumber = async (businessId) => {
  const count = await Invoice.countDocuments({ business: businessId });
  return `INV-${String(count + 1).padStart(4, '0')}`;
};

module.exports = { generateInvoiceNumber };
