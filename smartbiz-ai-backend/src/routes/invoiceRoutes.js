const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, generateInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/generate/:orderId', generateInvoice);

module.exports = router;
