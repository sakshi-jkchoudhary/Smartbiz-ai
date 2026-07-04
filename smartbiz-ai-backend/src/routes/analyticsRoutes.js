const express = require('express');
const router = express.Router();
const {
  getSummary,
  getSalesTrend,
  getTopProducts,
  getCategorySales,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/sales-trend', getSalesTrend);
router.get('/top-products', getTopProducts);
router.get('/category-sales', getCategorySales);

module.exports = router;
