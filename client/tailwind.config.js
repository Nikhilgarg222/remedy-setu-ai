/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF8C00',
          600: '#FF6B00',
          700: '#E65100',
          800: '#BF360C',
          900: '#8B2500',
        },
        secondary: {
          50: '#FCE4EC',
          100: '#F8BBD0',
          200: '#F48FB1',
          300: '#C2185B',
          400: '#A01040',
          500: '#800020',
          600: '#6A001A',
          700: '#540014',
          800: '#3E000E',
          900: '#280008',
        },
        accent: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FFD700',
          600: '#FFC107',
          700: '#FFB300',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        background: '#FFF8F0',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(255, 107, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(255, 107, 0, 0.15)',
        glow: '0 0 20px rgba(255, 215, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B00, #FF8C00)',
        'gradient-warm': 'linear-gradient(135deg, #FF6B00, #FFD700)',
        'gradient-spiritual': 'linear-gradient(135deg, #800020, #FF6B00)',
      },
    },
  },
  plugins: [],
};
