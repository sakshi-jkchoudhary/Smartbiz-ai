const geminiModel = require('../config/gemini');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Business = require('../models/Business');
const AIInsightCache = require('../models/AIInsightCache');
const analyticsService = require('./analyticsService');

const buildBusinessContext = async (businessId) => {
  const business = await Business.findById(businessId);

  const products = await Product.find({ business: businessId, isActive: true });
  const lowStockProducts = products.filter((p) => p.stockQty <= p.reorderThreshold);

  const topCustomers = await Customer.find({ business: businessId })
    .sort({ totalSpend: -1 })
    .limit(5);

  const summary = await analyticsService.getSummary(businessId);
  const topProducts = await analyticsService.getTopProducts(businessId, 5);

  const recentOrders = await Order.find({ business: businessId })
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    businessName: business?.name || 'the business',
    businessCategory: business?.category || 'general',
    currency: business?.currency || 'INR',
    totalProducts: products.length,
    lowStockProducts: lowStockProducts.map((p) => ({
      name: p.name,
      stockQty: p.stockQty,
      reorderThreshold: p.reorderThreshold,
      unit: p.unit,
    })),
    topCustomers: topCustomers.map((c) => ({
      name: c.name,
      totalSpend: c.totalSpend,
      totalOrders: c.totalOrders,
    })),
    todayRevenue: summary.today.revenue,
    todayOrders: summary.today.orders,
    weekRevenue: summary.week.revenue,
    monthRevenue: summary.month.revenue,
    avgOrderValue: summary.avgOrderValue,
    topProducts: topProducts.map((p) => ({ name: p.name, revenue: p.revenue, quantity: p.quantity })),
    recentOrderCount: recentOrders.length,
  };
};

const formatContextForPrompt = (ctx) => {
  const lowStockText =
    ctx.lowStockProducts.length > 0
      ? ctx.lowStockProducts
          .map((p) => `${p.name} (${p.stockQty} ${p.unit} left, reorder threshold ${p.reorderThreshold})`)
          .join('; ')
      : 'None — all products are adequately stocked';

  const topCustomersText =
    ctx.topCustomers.length > 0
      ? ctx.topCustomers
          .map((c) => `${c.name} (₹${c.totalSpend} lifetime, ${c.totalOrders} orders)`)
          .join('; ')
      : 'No customer data yet';

  const topProductsText =
    ctx.topProducts.length > 0
      ? ctx.topProducts.map((p) => `${p.name} (₹${p.revenue} revenue, ${p.quantity} units sold)`).join('; ')
      : 'No sales data yet';

  return `
Business name: ${ctx.businessName}
Business type: ${ctx.businessCategory}
Currency: ${ctx.currency}

Today's revenue: ₹${ctx.todayRevenue} across ${ctx.todayOrders} orders
This week's revenue: ₹${ctx.weekRevenue}
This month's revenue: ₹${ctx.monthRevenue}
Average order value: ₹${ctx.avgOrderValue}

Low stock products: ${lowStockText}

Top customers by lifetime spend: ${topCustomersText}

Top selling products: ${topProductsText}
`.trim();
};

const askGemini = async (businessId, userQuestion) => {
  const context = await buildBusinessContext(businessId);
  const contextText = formatContextForPrompt(context);

  const prompt = `You are a friendly, sharp business advisor helping the owner of "${context.businessName}" (a ${context.businessCategory}) run their business better.

Here is their current business data:
${contextText}

Owner's question: "${userQuestion}"

Instructions:
- Answer using ONLY the data provided above. Do not invent numbers.
- Be concise (3-5 sentences max) and conversational, like a smart advisor, not a report.
- Use ₹ for currency and be specific with numbers where relevant.
- If the question can't be answered from the data given, say so honestly and suggest what data would help.
- Give actionable advice where appropriate, not just facts.`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
};

const getCachedInsight = async (businessId, type, promptBuilder) => {
  const today = new Date().toISOString().split('T')[0];

  const cached = await AIInsightCache.findOne({ business: businessId, type, generatedForDate: today });
  if (cached) {
    return { content: cached.content, cached: true };
  }

  const context = await buildBusinessContext(businessId);
  const contextText = formatContextForPrompt(context);
  const prompt = promptBuilder(context, contextText);

  const result = await geminiModel.generateContent(prompt);
  const content = result.response.text().trim();

  await AIInsightCache.create({
    business: businessId,
    type,
    content,
    generatedForDate: today,
  });

  return { content, cached: false };
};

const getDailySummary = (businessId) =>
  getCachedInsight(businessId, 'daily_summary', (ctx, contextText) => `
You are a business advisor. Here is today's data for "${ctx.businessName}":
${contextText}

Write a short (3-4 sentence), encouraging daily business summary for the owner to read first thing —
highlight what's going well, flag anything urgent (like low stock), and end with one clear suggestion.
Use ₹ for currency. Be warm and specific, not generic.`);

const getReorderRecommendation = (businessId) =>
  getCachedInsight(businessId, 'reorder_recommendation', (ctx, contextText) => `
You are an inventory advisor. Here is the business data for "${ctx.businessName}":
${contextText}

Based on the low stock products and top-selling products above, recommend what the owner should
reorder first and why (prioritize by sales velocity where you can infer it). Keep it to 3-4 sentences.
If nothing is low on stock, say so positively and suggest what to watch for next.`);

const getDiscountSuggestion = (businessId) =>
  getCachedInsight(businessId, 'discount_suggestion', (ctx, contextText) => `
You are a sales strategy advisor. Here is the business data for "${ctx.businessName}":
${contextText}

Suggest one specific, practical discount or promotion idea based on this data (e.g. slow-moving
stock, a customer win-back offer, or a bundle of top sellers). Keep it to 3-4 sentences and make
it something the owner could realistically run this week.`);

module.exports = {
  buildBusinessContext,
  askGemini,
  getDailySummary,
  getReorderRecommendation,
  getDiscountSuggestion,
};
