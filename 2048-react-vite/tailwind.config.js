/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primitive Tokens
        'beige-100': '#eee4da',
        'beige-200': '#ede0c8',
        'orange-300': '#f2b179',
        'orange-400': '#f59563',
        'orange-500': '#f67c5f',
        'orange-600': '#f65e3b',
        'gold-300': '#edcf72',
        'gold-400': '#edcc61',
        'gold-500': '#edc850',
        'gold-600': '#edc53f',
        'gold-700': '#edc22e',
        'brown-500': '#bbada0',
        'brown-600': '#776e65',
        'beige-warm': '#faf8ef',
        'beige-dark': '#f4e8d3',
        'cream': '#fff6ea',
        'white': '#f9f6f2',

        // Semantic Tokens
        'surface-game-bg': '#faf8ef',
        'surface-container': '#fff6ea',
        'surface-board': '#bbada0',
        'surface-grid-cell': 'rgba(238, 228, 218, 0.35)',
        'text-dark': '#776e65',
        'text-light': '#f9f6f2',

        // Component Tokens - Tile backgrounds
        'tile-2-bg': '#eee4da',
        'tile-4-bg': '#ede0c8',
        'tile-8-bg': '#f2b179',
        'tile-16-bg': '#f59563',
        'tile-32-bg': '#f67c5f',
        'tile-64-bg': '#f65e3b',
        'tile-128-bg': '#edcf72',
        'tile-256-bg': '#edcc61',
        'tile-512-bg': '#edc850',
        'tile-1024-bg': '#edc53f',
        'tile-2048-bg': '#edc22e',

        // Component Tokens - Tile text
        'tile-2-text': '#776e65',
        'tile-4-text': '#776e65',
        'tile-8-text': '#f9f6f2',
        'tile-16-text': '#f9f6f2',
        'tile-32-text': '#f9f6f2',
        'tile-64-text': '#f9f6f2',
        'tile-128-text': '#f9f6f2',
        'tile-256-text': '#f9f6f2',
        'tile-512-text': '#f9f6f2',
        'tile-1024-text': '#f9f6f2',
        'tile-2048-text': '#f9f6f2',
      },
      boxShadow: {
        'tile': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'game': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'button': '0 4px 10px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'primary': ['Poppins', 'Noto Sans TC', 'sans-serif'],
      },
      animation: {
        'tile-appear': 'tile-appear 0.2s ease-in-out',
        'tile-merge': 'tile-merge 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        'tile-appear': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'tile-merge': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
