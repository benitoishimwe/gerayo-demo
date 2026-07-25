/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gerayo: {
          bg: '#0d0d0d',
          panel: '#161616',
          card: '#1e1e1e',
          border: '#2a2a2a',
          from: '#22c55e',
          to: '#3b82f6',
          text: '#f5f5f5',
          muted: '#9ca3af',
          vip: '#f59e0b',
          taken: '#4b5563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
