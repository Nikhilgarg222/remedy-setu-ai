import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaHistory, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getHistory } from '../api';

const concernEmojis = {
  career: '💼',
  marriage: '💑',
  health: '🏥',
  finance: '💰',
};

function SkeletonTimeline() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 skeleton" />
              <div className="h-3 w-1/2 skeleton" />
              <div className="h-3 w-2/3 skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryCard({ consultation }) {
  const [expanded, setExpanded] = useState(false);
  const concern = consultation.concern?.toLowerCase() || '';
  const emoji = concernEmojis[concern] || '🔮';
  const aiResponse = consultation.aiResponse || consultation.response || {};
  const products = aiResponse.recommendations || aiResponse.recommendedProducts || aiResponse.products || [];
  const analysis = aiResponse.analysis || aiResponse.summary || '';
  const advice = aiResponse.generalAdvice || aiResponse.advice || '';
  const date = consultation.createdAt
    ? new Date(consultation.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border border-gray-100"
    >
      {/* Header */}
      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0 text-2xl">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-800">
                {consultation.name || 'Consultation'}
              </h3>
              <p className="text-xs text-gray-400 capitalize">
                {consultation.concern} • {consultation.language || 'English'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {date && (
                <span className="text-xs text-gray-400 hidden sm:inline-flex items-center gap-1">
                  <FaCalendarAlt className="text-[10px]" />
                  {date}
                </span>
              )}
              <button className="text-gray-400 hover:text-primary-500 transition-colors">
                {expanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
          </div>
          {date && (
            <span className="text-xs text-gray-400 sm:hidden inline-flex items-center gap-1 mt-1">
              <FaCalendarAlt className="text-[10px]" />
              {date}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
              {/* Analysis */}
              {analysis && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Analysis
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {analysis}
                  </p>
                </div>
              )}

              {/* Products */}
              {products.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Recommended Products
                  </p>
                  <div className="space-y-2">
                    {products.map((product, idx) => (
                      <div
                        key={product._id || idx}
                        className="flex items-center gap-3 bg-primary-50/50 rounded-lg px-3 py-2"
                      >
                        <span className="text-lg">
                          {product.category?.toLowerCase() === 'gemstone'
                            ? '💎'
                            : product.category?.toLowerCase() === 'rudraksha'
                            ? '📿'
                            : product.category?.toLowerCase() === 'puja'
                            ? '🪔'
                            : '🌟'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {product.name || product.nameEn}
                          </p>
                          {product.reason && (
                            <p className="text-xs text-gray-500 truncate">
                              {product.reason}
                            </p>
                          )}
                        </div>
                        {product.price != null && (
                          <span className="text-sm font-bold text-primary-600 whitespace-nowrap">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {advice && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    General Advice
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {advice}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HistoryPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        const list = Array.isArray(data) ? data : (data?.data || data?.consultations || []);
        setConsultations(list);
      } catch (err) {
        toast.error(err.message || 'Failed to load history');
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaHistory className="text-primary-500 text-xl" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Consultation History
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            View your past remedy consultations
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <SkeletonTimeline />
        ) : consultations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-5xl block mb-4">📜</span>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No consultations yet
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Start your first AI remedy consultation
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              🙏 Start Consultation
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation, index) => (
              <HistoryCard
                key={consultation._id || consultation.id || index}
                consultation={consultation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
