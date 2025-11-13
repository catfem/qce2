/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050810',
        foreground: '#f8fafc',
        primary: {
          DEFAULT: '#6366F1',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#14b8a6',
          foreground: '#020617'
        },
        muted: '#1f2937',
        accent: '#22d3ee'
      },
      borderRadius: {
        xl: '1.25rem'
      },
      boxShadow: {
        glass: '0 30px 80px rgba(99, 102, 241, 0.25)',
        card: '0 12px 32px rgba(15, 23, 42, 0.4)'
      },
      backdropBlur: {
        xs: '3px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 55%)',
        'gradient-surface': 'linear-gradient(145deg, rgba(30,41,59,0.72), rgba(15,23,42,0.4))'
      },
      animation: {
        pulseGlow: 'pulseGlow 4s ease-in-out infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.9 },
          '50%': { opacity: 1 }
        }
      }
    }
  },
  plugins: []
};
