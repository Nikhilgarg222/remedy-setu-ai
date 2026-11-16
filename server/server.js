/**
 * Remedy Setu AI Assistant — Server Entry Point
 *
 * Starts an Express server with:
 *  • MongoDB connection (with in-memory fallback)
 *  • Product catalogue seeding
 *  • Security (Helmet, CORS, Rate Limiting)
 *  • API routes
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const catalogue = require('./data/catalogue.json');

const app = express();

// ---------------------------------------------------------------------------
// Security & parsing middleware
// ---------------------------------------------------------------------------
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiter — 30 requests per minute per IP for the consultation endpoint
const consultationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a minute before trying again.',
  },
});

// General rate limiter — 120 requests per minute per IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);
app.use('/api/consultation', consultationLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use('/api', apiRoutes);

// Health-check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Remedy Setu AI Assistant',
    dbConnected: app.locals.dbConnected,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Seed products from catalogue.json (if Mongo is connected & collection empty)
// ---------------------------------------------------------------------------
async function seedProducts() {
  try {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(catalogue);
      console.log(`🌱  Seeded ${catalogue.length} products from catalogue.json`);
    } else {
      console.log(`📦  Product collection already has ${count} items — skipping seed.`);
    }
  } catch (err) {
    console.error('❌  Product seeding failed:', err.message);
  }
}

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
async function start() {
  // 1. Attempt MongoDB connection
  const dbConnected = await connectDB();
  app.locals.dbConnected = dbConnected;

  // 2. Seed products if DB is connected
  if (dbConnected) {
    await seedProducts();
  } else {
    console.log(`📦  Using in-memory catalogue with ${catalogue.length} products.`);
  }

  // 3. Listen
  const PORT = parseInt(process.env.PORT, 10) || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀  Remedy Setu AI server running on port ${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Database    : ${dbConnected ? 'MongoDB' : 'In-Memory Fallback'}`);
    console.log(`   Health      : http://localhost:${PORT}/health\n`);
  });
}

start();
