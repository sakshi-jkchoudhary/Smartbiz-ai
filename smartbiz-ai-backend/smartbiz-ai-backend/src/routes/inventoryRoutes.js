const express = require('express');
const router = express.Router();
const {
  getLowStock,
  adjustStockHandler,
  getStockLogs,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/low-stock', getLowStock);
router.post('/adjust', adjustStockHandler);
router.get('/logs/:productId', getStockLogs);

module.exports = router;
