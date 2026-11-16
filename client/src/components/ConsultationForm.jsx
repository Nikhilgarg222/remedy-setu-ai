import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FaUser,
  FaBriefcase,
  FaHeart,
  FaHeartbeat,
  FaMoneyBillWave,
  FaArrowRight,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaLanguage,
  FaPaperPlane,
} from 'react-icons/fa';
import { getRemedy } from '../api';
import RemedyResult from './RemedyResult';

const concerns = [
  {
    id: 'career',
    label: 'Career',
    labelHi: 'करियर',
    emoji: '💼',
    icon: FaBriefcase,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'Job, business, growth',
  },
  {
    id: 'marriage',
    label: 'Marriage',
    labelHi: 'विवाह',
    emoji: '💑',
    icon: FaHeart,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    desc: 'Relationship, compatibility',
  },
  {
    id: 'health',
    label: 'Health',
    labelHi: 'स्वास्थ्य',
    emoji: '🏥',
    icon: FaHeartbeat,
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
    desc: 'Wellness, vitality',
  },
  {
    id: 'finance',
    label: 'Finance',
    labelHi: 'वित्त',
    emoji: '💰',
    icon: FaMoneyBillWave,
    color: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Wealth, investments',
  },
];

const genders = [
  { id: 'male', label: 'Male', emoji: '👨' },
  { id: 'female', label: 'Female', emoji: '👩' },
  { id: 'other', label: 'Other', emoji: '🧑' },
];

const steps = [
  { id: 1, label: 'Personal Details' },
  { id: 2, label: 'Your Concern' },
  { id: 3, label: 'Language & Details' },
];

const pageVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

function ConsultationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    timeOfBirth: '',
    placeOfBirth: '',
    concern: '',
    language: 'english',
    additionalDetails: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      if (!formData.dateOfBirth) {
        toast.error('Please enter your date of birth');
        return;
      }
      if (!formData.gender) {
        toast.error('Please select your gender');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.concern) {
        toast.error('Please select a concern');
        return;
      }
    }
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        userName: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        timeOfBirth: formData.timeOfBirth || undefined,
        placeOfBirth: formData.placeOfBirth.trim() || undefined,
        concern: formData.concern,
        language: formData.language === 'hindi' ? 'hi' : 'en',
        additionalDetails: formData.additionalDetails.trim() || undefined,
      };
      const data = await getRemedy(payload);
      setResult(data);
      toast.success('Consultation complete! ✨');
    } catch (err) {
      toast.error(err.message || 'Failed to get remedy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setCurrentStep(1);
    setDirection(-1);
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: '',
      timeOfBirth: '',
      placeOfBirth: '',
      concern: '',
      language: 'english',
      additionalDetails: '',
    });
  };

  if (result) {
    return <RemedyResult result={result} userName={formData.name} onReset={resetForm} />;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-start justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-4xl animate-float inline-block mb-3">✨</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            AI Remedy Consultation
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Get personalized astrological remedies powered by AI
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1.5 font-medium transition-colors ${
                      currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-4 h-0.5 rounded-full bg-gray-200 self-start mt-4">
                    <motion.div
                      className="h-full bg-gradient-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: currentStep > step.id ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card relative overflow-hidden"
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-50 to-transparent rounded-bl-full opacity-60" />

          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative z-10"
              >
                <div className="flex items-center gap-2 mb-6">
                  <FaUser className="text-primary-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Personal Details
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      <FaCalendarAlt className="inline mr-1 text-primary-400" />
                      Date of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Gender <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {genders.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => updateField('gender', g.id)}
                          className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.gender === g.id
                              ? 'border-primary-400 bg-primary-50 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-primary-200'
                          }`}
                        >
                          <span className="text-xl">{g.emoji}</span>
                          <span className="text-xs font-medium text-gray-700">
                            {g.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time of Birth (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      <FaClock className="inline mr-1 text-primary-400" />
                      Time of Birth{' '}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="time"
                      value={formData.timeOfBirth}
                      onChange={(e) => updateField('timeOfBirth', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {/* Place of Birth (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      <FaMapMarkerAlt className="inline mr-1 text-primary-400" />
                      Place of Birth{' '}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., New Delhi, India"
                      value={formData.placeOfBirth}
                      onChange={(e) => updateField('placeOfBirth', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Concern */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative z-10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🔮</span>
                  <h2 className="text-lg font-semibold text-gray-800">
                    What concerns you?
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Select the area where you seek guidance
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {concerns.map((concern) => {
                    const Icon = concern.icon;
                    const isSelected = formData.concern === concern.id;
                    return (
                      <motion.button
                        key={concern.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateField('concern', concern.id)}
                        className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `${concern.border} ${concern.bg} shadow-md`
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="concernSelected"
                            className="absolute inset-0 rounded-2xl border-2 border-primary-400"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span className="text-3xl">{concern.emoji}</span>
                        <div className="text-center">
                          <p className="font-semibold text-gray-800 text-sm">
                            {concern.label}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {concern.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Language & Additional Details */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative z-10"
              >
                <div className="flex items-center gap-2 mb-6">
                  <FaLanguage className="text-primary-500 text-xl" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Language & Details
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Preferred Language
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateField('language', 'english')}
                        className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                          formData.language === 'english'
                            ? 'border-primary-400 bg-primary-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-primary-200'
                        }`}
                      >
                        <span className="text-lg">🇬🇧</span>
                        <span className="font-medium text-sm text-gray-800">
                          English
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('language', 'hindi')}
                        className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                          formData.language === 'hindi'
                            ? 'border-primary-400 bg-primary-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-primary-200'
                        }`}
                      >
                        <span className="text-lg">🇮🇳</span>
                        <span className="font-medium text-sm text-gray-800 font-hindi">
                          हिंदी
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Additional Details{' '}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share any specific questions or details you'd like the AI to consider..."
                      value={formData.additionalDetails}
                      onChange={(e) =>
                        updateField('additionalDetails', e.target.value)
                      }
                      className="input-field resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      📋 Consultation Summary
                    </h3>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <p>
                        <span className="font-medium">Name:</span>{' '}
                        {formData.name}
                      </p>
                      <p>
                        <span className="font-medium">DOB:</span>{' '}
                        {formData.dateOfBirth
                          ? new Date(formData.dateOfBirth).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )
                          : '-'}
                      </p>
                      <p>
                        <span className="font-medium">Concern:</span>{' '}
                        {concerns.find((c) => c.id === formData.concern)?.emoji}{' '}
                        {concerns.find((c) => c.id === formData.concern)?.label}
                      </p>
                      <p>
                        <span className="font-medium">Language:</span>{' '}
                        {formData.language === 'english' ? '🇬🇧 English' : '🇮🇳 Hindi'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 relative z-10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <FaArrowLeft className="text-xs" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                Next
                <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Consulting AI...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    Get Remedies
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Decorative bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          🔒 Your information is secure and used only for this consultation
        </motion.p>
      </div>
    </div>
  );
}

export default ConsultationForm;
