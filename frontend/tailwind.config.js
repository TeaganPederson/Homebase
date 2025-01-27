/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#0052FF',
        white: '#FFFFFF',
        black: '#000000',
      },
    },
  },
  plugins: [],
};


