const express = require('express');
const router = express.Router();

const { getRemedy, getHistory } = require('../controllers/consultationController');
const { getAllProducts, getProductById } = require('../controllers/productController');

// ---------------------------------------------------------------------------
// Consultation routes
// ---------------------------------------------------------------------------
router.post('/consultation', getRemedy);     // Get AI remedy
router.get('/consultations', getHistory);     // Past consultations

// ---------------------------------------------------------------------------
// Product routes
// ---------------------------------------------------------------------------
router.get('/products', getAllProducts);        // List / filter products
router.get('/products/:id', getProductById);   // Single product by catalogue ID

module.exports = router;
