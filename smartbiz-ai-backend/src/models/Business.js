const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: [
        'Retail Shop',
        'Grocery Store',
        'Cafe',
        'Salon',
        'Coaching Institute',
        'Clinic',
        'Other',
      ],
      default: 'Other',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    lowStockThresholdDefault: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
