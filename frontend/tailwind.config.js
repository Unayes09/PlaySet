/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#ff6b6b',
          orange: '#ff9f1a',
          dark: '#222',
        },
      },
      boxShadow: {
        soft: '0 8px 28px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
