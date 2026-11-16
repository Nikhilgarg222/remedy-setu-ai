const catalogue = require('../data/catalogue.json');

// ---------------------------------------------------------------------------
// In-memory fallback store (used when MongoDB is unavailable)
// ---------------------------------------------------------------------------
let inMemoryProducts = [...catalogue];

/**
 * Determine whether to use Mongoose or in-memory storage.
 * The `req.app.locals.dbConnected` flag is set at startup.
 */
function useDB(req) {
  return req.app.locals.dbConnected === true;
}

// ---------------------------------------------------------------------------
// GET /api/products?category=Gemstones&concern=career&search=neelam
// ---------------------------------------------------------------------------
async function getAllProducts(req, res, next) {
  try {
    const { category, concern, search } = req.query;

    let products;

    if (useDB(req)) {
      const Product = require('../models/Product');
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      if (concern) filter.concerns = concern;
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ name: regex }, { nameHindi: regex }, { description: regex }];
      }
      products = await Product.find(filter).lean();
    } else {
      // In-memory filtering
      products = inMemoryProducts.filter((p) => {
        if (category && category !== 'all' && p.category.toLowerCase() !== category.toLowerCase()) return false;
        if (concern && !p.concerns.includes(concern.toLowerCase())) return false;
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchHindi = p.nameHindi && p.nameHindi.toLowerCase().includes(q);
          const matchDesc = p.description && p.description.toLowerCase().includes(q);
          if (!matchName && !matchHindi && !matchDesc) return false;
        }
        return true;
      });
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// GET /api/products/:id
// ---------------------------------------------------------------------------
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    let product;

    if (useDB(req)) {
      const Product = require('../models/Product');
      product = await Product.findOne({ id }).lean();
    } else {
      product = inMemoryProducts.find((p) => p.id === id) || null;
    }

    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllProducts, getProductById };
