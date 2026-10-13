/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -4px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.3)',
        card: '0 2px 10px -2px rgba(15, 23, 42, 0.04), 0 10px 25px -4px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 14px 34px -4px rgba(16, 185, 129, 0.15), 0 6px 14px -2px rgba(15, 23, 42, 0.05)',
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '0%', opacity: '0.85' },
          '50%': { top: '96%', opacity: '1' },
        },
        soundwave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '22px' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        scan: 'scan 2.4s ease-in-out infinite',
        soundwave: 'soundwave 1.1s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        leaf: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
    },
  },
  plugins: [],
};

