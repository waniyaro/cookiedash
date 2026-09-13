/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cookie: {
          dark: '#0e0b08',
          card: '#18130e',
          border: '#32251a',
          accent: '#e59a38',
          gold: '#f5b041',
          oven: '#ff5722',
          glow: '#ff9800',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cookie-glow': '0 0 25px -5px rgba(229, 154, 56, 0.25)',
        'oven-glow': '0 0 35px -5px rgba(255, 87, 34, 0.3)',
      },
    },
  },
  plugins: [],
}
