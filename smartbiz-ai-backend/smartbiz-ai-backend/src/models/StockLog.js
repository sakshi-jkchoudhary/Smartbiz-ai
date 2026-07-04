const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    changeType: {
      type: String,
      enum: ['restock', 'sale', 'manual_adjustment', 'return'],
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    resultingStockQty: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

stockLogSchema.index({ business: 1, product: 1, createdAt: -1 });

module.exports = mongoose.model('StockLog', stockLogSchema);
