const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    nameHindi: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Gemstones', 'Rudraksha', 'Puja Services'],
    },
    description: {
      type: String,
      required: true,
    },
    descriptionHindi: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: String,
      default: null,
    },
    origin: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    concerns: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((c) => ['career', 'marriage', 'health', 'finance'].includes(c)),
        message: 'Each concern must be one of: career, marriage, health, finance',
      },
    },
    imageUrl: {
      type: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
