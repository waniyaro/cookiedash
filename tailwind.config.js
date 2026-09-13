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
          bg: '#080402',
          dark: '#0d0704',
          card: '#140a05',
          surface: '#1c0e07',
          border: '#2c150a',
          borderLight: '#4a2512',
          blue: '#f59e0b', // warm golden honey replacement
          cyan: '#fbbf24',
          gold: '#f59e0b',
          amber: '#fbbf24',
          caramel: '#d97706',
          ember: '#ea580c',
          flame: '#f97316',
          oven: '#ea580c',
          crust: '#78350f',
          dough: '#fef3c7',
          cream: '#fffbeb',
          soot: '#180d07',
        },
      },
      fontFamily: {
        display: ['Syne', 'Outfit', 'sans-serif'],
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
