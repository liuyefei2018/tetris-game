/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tetris-cyan': '#00f0f0',
        'tetris-blue': '#0000f0',
        'tetris-orange': '#f0a000',
        'tetris-yellow': '#f0f000',
        'tetris-green': '#00f000',
        'tetris-purple': '#a000f0',
        'tetris-red': '#f00000',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
      }
    },
  },
  plugins: [],
}