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
          bg: '#070d18',
          card: '#0d172a',
          surface: '#121f38',
          border: '#1e293b',
          blue: '#38bdf8',
          cyan: '#0ea5e9',
          gold: '#f59e0b',
          amber: '#fbbf24',
          oven: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
