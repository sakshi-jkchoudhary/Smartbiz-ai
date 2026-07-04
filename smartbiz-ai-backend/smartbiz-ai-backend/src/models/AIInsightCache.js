const mongoose = require('mongoose');

const aiInsightCacheSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'daily_summary',
        'reorder_recommendation',
        'discount_suggestion',
        'general_insight',
      ],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    generatedForDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

aiInsightCacheSchema.index(
  { business: 1, type: 1, generatedForDate: 1 },
  { unique: true }
);

module.exports = mongoose.model('AIInsightCache', aiInsightCacheSchema);
