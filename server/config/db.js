const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Falls back to local MongoDB if MONGODB_URI is not set.
 * Returns a boolean indicating whether the connection succeeded —
 * the app can still run in "in-memory fallback" mode if it fails.
 */
async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.log('ℹ️  No MONGODB_URI provided. Running in high-performance IN-MEMORY mode.');
    return false;
  }

  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // fail fast if no server
    });

    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.warn('⚠️  Running in IN-MEMORY fallback mode (data will not persist).');
    return false;
  }
}

module.exports = connectDB;
