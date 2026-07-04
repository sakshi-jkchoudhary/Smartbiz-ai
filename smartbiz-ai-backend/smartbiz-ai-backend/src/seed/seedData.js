require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Business = require('../models/Business');
const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const StockLog = require('../models/StockLog');
const Invoice = require('../models/Invoice');
const AIInsightCache = require('../models/AIInsightCache');

const DEMO_EMAIL = 'demo@sharmastore.com';
const DEMO_PASSWORD = 'demo1234';

const PRODUCT_CATALOG = [
  { name: 'Basmati Rice 5kg', category: 'Grains', price: 450, costPrice: 380, stockQty: 8, unit: 'bag', reorderThreshold: 10 },
  { name: 'Sugar 1kg', category: 'Staples', price: 45, costPrice: 38, stockQty: 4, unit: 'kg', reorderThreshold: 15 },
  { name: 'Toor Dal 1kg', category: 'Pulses', price: 130, costPrice: 105, stockQty: 32, unit: 'kg', reorderThreshold: 10 },
  { name: 'Sunflower Oil 1L', category: 'Cooking Oil', price: 155, costPrice: 130, stockQty: 25, unit: 'bottle', reorderThreshold: 8 },
  { name: 'Wheat Flour 5kg', category: 'Grains', price: 220, costPrice: 185, stockQty: 40, unit: 'bag', reorderThreshold: 10 },
  { name: 'Tea Powder 250g', category: 'Beverages', price: 95, costPrice: 75, stockQty: 50, unit: 'pack', reorderThreshold: 12 },
  { name: 'Salt 1kg', category: 'Staples', price: 20, costPrice: 14, stockQty: 60, unit: 'kg', reorderThreshold: 15 },
  { name: 'Turmeric Powder 200g', category: 'Spices', price: 60, costPrice: 45, stockQty: 35, unit: 'pack', reorderThreshold: 10 },
  { name: 'Red Chilli Powder 200g', category: 'Spices', price: 70, costPrice: 52, stockQty: 30, unit: 'pack', reorderThreshold: 10 },
  { name: 'Biscuits Family Pack', category: 'Snacks', price: 80, costPrice: 62, stockQty: 45, unit: 'pack', reorderThreshold: 15 },
  { name: 'Detergent Powder 1kg', category: 'Household', price: 110, costPrice: 88, stockQty: 28, unit: 'pack', reorderThreshold: 10 },
  { name: 'Milk 500ml', category: 'Dairy', price: 30, costPrice: 24, stockQty: 3, unit: 'packet', reorderThreshold: 20 },
];

const CUSTOMER_LIST = [
  { name: 'Ramesh Kumar', phone: '9876543210' },
  { name: 'Priya Singh', phone: '9876543211' },
  { name: 'Amit Verma', phone: '9876543212' },
  { name: 'Sunita Devi', phone: '9876543213' },
  { name: 'Vikram Rathore', phone: '9876543214' },
  { name: 'Anjali Mehta', phone: '9876543215' },
];

const PAYMENT_MODES = ['cash', 'upi', 'card'];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];

const clearExistingDemoData = async (businessId) => {
  await Promise.all([
    Product.deleteMany({ business: businessId }),
    Customer.deleteMany({ business: businessId }),
    Order.deleteMany({ business: businessId }),
    StockLog.deleteMany({ business: businessId }),
    Invoice.deleteMany({ business: businessId }),
    AIInsightCache.deleteMany({ business: businessId }),
  ]);
};

const seed = async () => {
  await connectDB();
  console.log('Connected. Seeding demo data...');

  let user = await User.findOne({ email: DEMO_EMAIL });
  let business;

  if (user) {
    business = await Business.findById(user.business);
    console.log('Demo account already exists — refreshing data...');
    await clearExistingDemoData(business._id);
  } else {
    business = await Business.create({
      name: 'Sharma General Store',
      category: 'Grocery Store',
      phone: '+91 98765 00000',
      address: '14 MG Road, Jaipur, Rajasthan',
    });

    user = await User.create({
      business: business._id,
      name: 'Ramesh Sharma',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      role: 'owner',
    });
    console.log('Created demo business and owner account');
  }

  const businessId = business._id;

  const products = await Product.insertMany(
    PRODUCT_CATALOG.map((p) => ({ ...p, business: businessId }))
  );
  console.log(`Seeded ${products.length} products`);

  const customers = await Customer.insertMany(
    CUSTOMER_LIST.map((c) => ({ ...c, business: businessId }))
  );
  console.log(`Seeded ${customers.length} customers`);

  let orderCount = 0;
  const stockLogEntries = [];

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const ordersToday = randomInt(1, dayOffset < 7 ? 8 : 5);

    for (let i = 0; i < ordersToday; i++) {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - dayOffset);
      orderDate.setHours(randomInt(9, 20), randomInt(0, 59), 0, 0);

      const itemCount = randomInt(1, 4);
      const chosenProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, itemCount);

      const orderItems = chosenProducts.map((p) => {
        const quantity = randomInt(1, 3);
        return {
          product: p._id,
          name: p.name,
          price: p.price,
          quantity,
          subtotal: p.price * quantity,
        };
      });

      const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const discount = Math.random() < 0.15 ? randomInt(10, 50) : 0;
      const finalAmount = Math.max(totalAmount - discount, 0);

      const useCustomer = Math.random() < 0.7;
      const customer = useCustomer ? randomItem(customers) : null;

      orderCount += 1;
      const orderNumber = `ORD-${String(orderCount).padStart(4, '0')}`;

      const order = await Order.create({
        business: businessId,
        customer: customer?._id || null,
        customerNameSnapshot: customer?.name || 'Walk-in Customer',
        orderNumber,
        items: orderItems,
        totalAmount,
        discount,
        finalAmount,
        status: 'completed',
        paymentMode: randomItem(PAYMENT_MODES),
        createdAt: orderDate,
        updatedAt: orderDate,
      });

      if (customer) {
        await Customer.findByIdAndUpdate(customer._id, {
          $inc: { totalSpend: finalAmount, totalOrders: 1 },
          $set: { lastOrderDate: orderDate },
        });
      }

      for (const item of orderItems) {
        stockLogEntries.push({
          business: businessId,
          product: item.product,
          changeType: 'sale',
          quantityChange: -item.quantity,
          resultingStockQty: 0,
          note: `Sold via order ${orderNumber}`,
          createdAt: orderDate,
        });
      }
    }
  }

  await StockLog.insertMany(stockLogEntries);
  console.log(`Seeded ${orderCount} orders across the last 30 days`);
  console.log(`Seeded ${stockLogEntries.length} stock log entries`);

  const updatedCustomers = await Customer.find({ business: businessId });
  for (const c of updatedCustomers) {
    if (c.totalSpend >= 10000 && !c.tags.includes('VIP')) {
      c.tags.push('VIP');
      await c.save();
    }
  }

  const recentOrder = await Order.findOne({ business: businessId }).sort({ createdAt: -1 });
  if (recentOrder) {
    await Invoice.create({
      business: businessId,
      order: recentOrder._id,
      invoiceNumber: 'INV-0001',
      customerNameSnapshot: recentOrder.customerNameSnapshot,
      items: recentOrder.items,
      totalAmount: recentOrder.totalAmount,
      discount: recentOrder.discount,
      finalAmount: recentOrder.finalAmount,
    });
    console.log('Seeded 1 sample invoice');
  }

  console.log('\nSeed complete!\n');
  console.log('Demo login credentials:');
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log('\nNote: products were seeded with intentionally low stock on');
  console.log('Basmati Rice, Sugar, and Milk - so the dashboard shows live low-stock');
  console.log('alerts and the AI assistant has something real to talk about.\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
