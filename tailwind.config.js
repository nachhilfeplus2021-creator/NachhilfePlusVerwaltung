/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        background: '#020617',
        violet: {
          500: '#8b5cf6',
        },
        blue: {
          500: '#3b82f6',
        },
        pink: {
          500: '#d946ef',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #d946ef 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};