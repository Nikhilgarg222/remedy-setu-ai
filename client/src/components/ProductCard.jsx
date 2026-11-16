import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const categoryIcons = {
  gemstone: '💎',
  rudraksha: '📿',
  puja: '🪔',
  yantra: '🔯',
  default: '🌟',
};

const categoryGradients = {
  gemstone: 'from-violet-400 to-purple-500',
  rudraksha: 'from-amber-400 to-orange-500',
  puja: 'from-rose-400 to-red-500',
  yantra: 'from-blue-400 to-indigo-500',
  default: 'from-primary-400 to-accent-500',
};

function ProductCard({ product }) {
  const category = product.category?.toLowerCase() || 'default';
  const icon = categoryIcons[category] || categoryIcons.default;
  const gradient = categoryGradients[category] || categoryGradients.default;
  const inStock = product.inStock !== false;
  const benefits = product.benefits || [];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card flex flex-col h-full border border-gray-100 overflow-hidden p-0"
    >
      {/* Image Placeholder */}
      <div
        className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <span className="text-6xl drop-shadow-md">{icon}</span>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 badge bg-white/90 text-gray-700 shadow-sm capitalize">
          {icon} {product.category || 'Product'}
        </span>

        {/* Stock Badge */}
        <span
          className={`absolute top-3 right-3 badge ${
            inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {inStock ? (
            <>
              <FaCheckCircle className="mr-1 text-[10px]" /> In Stock
            </>
          ) : (
            <>
              <FaTimesCircle className="mr-1 text-[10px]" /> Out of Stock
            </>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-semibold text-gray-800 text-base mb-0.5">
          {product.nameEn || product.name}
        </h3>
        {(product.nameHindi || product.nameHi) && (
          <p className="text-xs text-gray-500 font-hindi mb-3">
            {product.nameHindi || product.nameHi}
          </p>
        )}

        {/* Price */}
        {product.price != null && (
          <p className="text-xl font-bold text-primary-600 mb-3">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </p>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="flex-1 mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Benefits
            </p>
            <ul className="space-y-1">
              {benefits.slice(0, 4).map((benefit, index) => (
                <li
                  key={index}
                  className="text-xs text-gray-600 flex items-start gap-1.5"
                >
                  <span className="text-accent-500 mt-0.5">✦</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description fallback */}
        {benefits.length === 0 && product.description && (
          <p className="text-xs text-gray-500 flex-1 mb-3 line-clamp-3">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default ProductCard;
