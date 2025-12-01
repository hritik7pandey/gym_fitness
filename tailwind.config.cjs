const plugin = require('tailwindcss/plugin');

/** Tailwind config with iOS-inspired colors, radius, and an ios-glass helper */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // iOS26 Liquid Glass Design System
        primary: {
          50: '#F6F9FF',   // Mist
          100: '#EEF2FF',  // Light mist
          200: '#E6E9FF',  // Soft vapor
          300: '#93C5FD',  // Light blue
          400: '#60A5FA',  // Medium blue
          500: '#2D6EF8',  // iOS26 Neon Blue
          600: '#0A84FF',  // iOS Blue
          700: '#036BCE',  // Deep blue
          800: '#03408F',  // Darker blue
          900: '#082F5C',  // Navy
        },
        neon: {
          blue: '#2D6EF8',
          purple: '#8A5CF6',
          orange: '#FF6A3D',
          yellow: '#FFB800',
        },
        neutral: {
          50: '#FAFAFA',   // Almost white
          100: '#F5F5F5',  // Light grey
          200: '#E5E5E5',  // Grey
          300: '#D4D4D4',  // Medium grey
          400: '#A3A3A3',  // Grey
          500: '#737373',  // Dark grey
          600: '#525252',  // Darker grey
          700: '#404040',  // Very dark grey
          800: '#262626',  // Almost black
          900: '#171717',  // Black
        },
        accent: {
          purple: '#8B7BF7',  // Soft purple (muted)
          lavender: '#E4E0F9', // Pale lavender
          mint: '#B4E4CE',    // Soft mint
          peach: '#FFD5C2',   // Soft peach
        },
        // Legacy colors
        iosRed: '#FF3B30',
        iosBlue: '#0A84FF',
        iosCyan: '#64D2FF',
        iosPurple: '#BF5AF2',
      },
      backgroundImage: {
        'soft-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 50%, #E4E0F9 100%)',
        'hero-gradient': 'linear-gradient(135deg, #FAFAFA 0%, #DBEAFE 100%)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
        'liquid-gradient': 'linear-gradient(135deg, #2D6EF8 0%, #8A5CF6 100%)',
        'neon-gradient': 'linear-gradient(135deg, #FF6A3D 0%, #FFB800 100%)',
        'mist-gradient': 'linear-gradient(135deg, #F6F9FF 0%, #EEF2FF 50%, #E6E9FF 100%)',
        'aurora': 'linear-gradient(135deg, #2D6EF8 0%, #8A5CF6 50%, #FF6A3D 100%)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        'liquid': '24px',
        'liquid-lg': '28px',
        'liquid-xl': '32px',
        'pill': '40px',
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 30px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 8px 40px rgba(0, 0, 0, 0.10)',
        'depth': '0 20px 40px rgba(0, 0, 40, 0.25)',
        'ambient': '0 8px 20px rgba(0, 0, 0, 0.05)',
        'neon': '0 0 22px rgba(110, 90, 255, 0.4)',
        'neon-blue': '0 0 35px rgba(90, 140, 255, 0.4)',
        'neon-strong': '0 0 45px rgba(90, 140, 255, 0.6)',
        'liquid-inner': 'inset 0 0 15px rgba(255, 255, 255, 0.25), inset 0 0 30px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(8px)' },
          '50%': { opacity: '0.8', filter: 'blur(12px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.ios-glass-backdrop': {
          '-webkit-backdrop-filter': 'blur(10px) saturate(120%)',
          'backdrop-filter': 'blur(10px) saturate(120%)'
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.18)',
        },
        '.glass-card-light': {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      });
    })
  ]
};
