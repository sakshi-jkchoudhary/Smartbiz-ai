const asyncHandler = require('../middleware/asyncHandler');
const aiService = require('../services/aiService');
const { success, error } = require('../utils/apiResponse');

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return error(res, 'Message is required', 400);
  }

  try {
    const reply = await aiService.askGemini(req.businessId, message.trim());
    res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return error(res, 'AI assistant is temporarily unavailable. Please try again.', 503);
  }
});

const dailySummary = asyncHandler(async (req, res) => {
  try {
    const result = await aiService.getDailySummary(req.businessId);
    success(res, result);
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return error(res, 'Could not generate insight right now', 503);
  }
});

const reorderRecommendation = asyncHandler(async (req, res) => {
  try {
    const result = await aiService.getReorderRecommendation(req.businessId);
    success(res, result);
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return error(res, 'Could not generate insight right now', 503);
  }
});

const discountSuggestion = asyncHandler(async (req, res) => {
  try {
    const result = await aiService.getDiscountSuggestion(req.businessId);
    success(res, result);
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return error(res, 'Could not generate insight right now', 503);
  }
});

module.exports = { chat, dailySummary, reorderRecommendation, discountSuggestion };
