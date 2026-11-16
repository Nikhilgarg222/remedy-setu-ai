const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    concern: {
      type: String,
      required: true,
      enum: ['career', 'marriage', 'health', 'finance'],
    },
    language: {
      type: String,
      default: 'hi',
      enum: ['en', 'hi'],
    },
    aiResponse: {
      type: mongoose.Schema.Types.Mixed, // Structured JSON from the AI
      required: true,
    },
    recommendedProducts: {
      type: [String], // Array of product IDs
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We manage createdAt manually
  }
);

module.exports = mongoose.model('Consultation', consultationSchema);
