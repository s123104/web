/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#faf8ef',
        'game-bg-dark': '#f4e8d3',
        'board-bg': '#bbada0',
        'grid-cell': 'rgba(238, 228, 218, 0.35)',
        'tile-2': '#eee4da',
        'tile-4': '#ede0c8',
        'tile-8': '#f2b179',
        'tile-16': '#f59563',
        'tile-32': '#f67c5f',
        'tile-64': '#f65e3b',
        'tile-128': '#edcf72',
        'tile-256': '#edcc61',
        'tile-512': '#edc850',
        'tile-1024': '#edc53f',
        'tile-2048': '#edc22e',
        'text-dark': '#776e65',
        'text-light': '#f9f6f2',
      },
      fontFamily: {
        poppins: ['Poppins', 'Noto Sans TC', 'sans-serif'],
      },
      boxShadow: {
        'tile': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'game': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'button': '0 4px 10px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'tile-appear': 'tile-appear 0.2s ease-in-out',
        'tile-merge': 'tile-merge 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'glow': 'glow 1.5s infinite alternate',
        'super-glow': 'super-glow 1.5s infinite alternate',
        'mega-glow': 'mega-glow 1.5s infinite alternate',
      },
      keyframes: {
        'tile-appear': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'tile-merge': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 10px rgba(243, 215, 116, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(243, 215, 116, 0.8)' },
        },
        'super-glow': {
          '0%': { boxShadow: '0 0 15px rgba(124, 86, 223, 0.6)' },
          '100%': { boxShadow: '0 0 30px rgba(124, 86, 223, 0.9)' },
        },
        'mega-glow': {
          '0%': { boxShadow: '0 0 20px rgba(255, 45, 85, 0.7)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 45, 85, 1)' },
        },
      },
    },
  },
  plugins: [],
}
