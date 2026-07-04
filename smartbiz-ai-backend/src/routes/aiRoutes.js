const express = require('express');
const router = express.Router();
const {
  chat,
  dailySummary,
  reorderRecommendation,
  discountSuggestion,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/chat', chat);
router.get('/insight/daily-summary', dailySummary);
router.get('/insight/reorder-recommendation', reorderRecommendation);
router.get('/insight/discount-suggestion', discountSuggestion);

module.exports = router;
