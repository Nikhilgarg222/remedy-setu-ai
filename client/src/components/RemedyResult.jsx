import { motion } from 'framer-motion';
import { FaRedo, FaExternalLinkAlt, FaStar, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const categoryIcons = {
  gemstones: '💎',
  gemstone: '💎',
  rudraksha: '📿',
  'puja services': '🪔',
  puja: '🪔',
  yantra: '🔯',
  default: '🌟',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

function RemedyResult({ result, userName, onReset }) {
  // Normalize whatever response payload was passed
  const root = result?.data || result || {};
  const consultation = root.consultation || root.aiResponse || root;
  const engine = result?.meta?.engine || root?.engine || 'Vedic AI Assistant';

  const greeting =
    consultation.greeting || `Namaste ${userName || 'ji'} 🙏`;
  const analysis =
    consultation.analysis ||
    consultation.summary ||
    'Based on your birth details and astrological energies, here is our Vedic remedy analysis.';
  const advice =
    consultation.generalAdvice ||
    consultation.advice ||
    'Begin your days with positive intention and peace.';
  const disclaimer =
    consultation.disclaimer ||
    'These recommendations are for spiritual guidance only and not a substitute for professional advice.';

  // Build merged products list combining catalogue details (price, image) with AI reasons
  const recList = consultation.recommendations || [];
  const rawProducts = root.products || [];
  const productMap = new Map(rawProducts.map((p) => [p.id, p]));

  let displayProducts = [];
  if (recList.length > 0) {
    displayProducts = recList.map((rec) => {
      const fullProd = productMap.get(rec.productId) || {};
      return {
        id: rec.productId,
        name: rec.productName || fullProd.name || 'Remedy Item',
        nameHindi: fullProd.nameHindi,
        category: fullProd.category || 'Spiritual Remedy',
        price: fullProd.price,
        weight: fullProd.weight,
        origin: fullProd.origin,
        reason: rec.reason,
        benefits: fullProd.benefits || [],
      };
    });
  } else if (rawProducts.length > 0) {
    displayProducts = rawProducts.map((p) => ({
      ...p,
      reason: p.description,
    }));
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:py-12">
      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Engine Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Engine: {engine}
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="text-5xl inline-block mb-3 animate-bounce">🙏</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 font-display">
            {greeting}
          </h1>
          <p className="text-gray-500 text-sm">
            Your personalized astrological remedy consultation is ready
          </p>
        </motion.div>

        {/* Astrological Analysis Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 sm:p-7 shadow-md mb-6 border-l-4 border-l-amber-500 border border-amber-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <FaStar className="text-amber-500 text-lg" />
            <h2 className="text-lg font-bold text-gray-800">
              Vedic Astrological Analysis
            </h2>
          </div>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {analysis}
          </p>
        </motion.div>

        {/* Recommended Products */}
        {displayProducts.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <h2 className="text-xl font-bold text-gray-800">
                  Recommended Remedies ({displayProducts.length})
                </h2>
              </div>
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                100% Catalogue Verified
              </span>
            </div>

            <div className="space-y-4">
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product.id || index}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row gap-5"
                >
                  {/* Category Graphic */}
                  <div className="w-full sm:w-28 h-28 rounded-xl bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 flex flex-col items-center justify-center flex-shrink-0 border border-amber-200">
                    <span className="text-4xl mb-1">
                      {categoryIcons[product.category?.toLowerCase()] || categoryIcons.default}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-900 uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          {product.name}
                        </h3>
                        {product.nameHindi && (
                          <p className="text-xs text-gray-500 font-medium font-hindi">
                            {product.nameHindi}
                          </p>
                        )}
                      </div>
                      {product.price != null && (
                        <span className="text-orange-600 font-extrabold text-xl whitespace-nowrap">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {product.weight && (
                      <span className="inline-block text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded mr-2 mb-2">
                        ⚖️ {product.weight}
                      </span>
                    )}

                    {product.origin && (
                      <span className="inline-block text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded mb-2">
                        📍 {product.origin}
                      </span>
                    )}

                    {/* AI Astrological Reason */}
                    {product.reason && (
                      <div className="mt-2.5 p-3 rounded-xl bg-orange-50/70 border border-orange-100 text-sm text-gray-700 leading-relaxed">
                        <span className="font-semibold text-orange-800">
                          Why this remedy helps:{' '}
                        </span>
                        {product.reason}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        ✓ In Stock & Authenticated
                      </span>
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        View Catalogue
                        <FaExternalLinkAlt className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* General Advice */}
        {advice && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm mb-6 border border-amber-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <FaLightbulb className="text-amber-600 text-lg" />
              <h2 className="text-base font-bold text-gray-800">
                Spiritual & Lifestyle Guidance
              </h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {advice}
            </p>
          </motion.div>
        )}

        {/* Reset Button */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <FaRedo className="text-sm" />
            Start Another Consultation
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex items-start gap-2 p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500"
        >
          <FaShieldAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p>{disclaimer}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RemedyResult;
