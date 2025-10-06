/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'boss-red': '#e53e3e',
        'boss-orange': '#ff7a00',
        'boss-gray': '#2d3748',
        'boss-dark': '#1a202c',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}