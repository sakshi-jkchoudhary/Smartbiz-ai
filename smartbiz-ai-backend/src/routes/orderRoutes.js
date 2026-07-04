const express = require('express');
const router = express.Router();
const { getOrders, getOrder, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getOrders).post(createOrder);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
