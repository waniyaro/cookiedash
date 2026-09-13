/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          bg: '#140d0a',          // Deep roasted cacao & espresso
          surface: '#1e1410',     // Dark umbra card base
          elevated: '#281a15',    // Slightly elevated surface
          border: '#3a251e',      // Subtle warm boundary
          borderMuted: '#2a1a15',
          flame: '#ff7a1a',       // Hero primary fire
          amber: '#ffb347',       // Hero bright caramel
          gold: '#d4a15c',        // Secondary Vault gold
          goldMuted: '#9e7a46',
          ivory: '#f5ece1',       // High-contrast primary text
          dough: '#e8dcce',       // Soft dough text
          taupe: '#998376',       // Muted secondary label text
          soot: '#0e0806',        // Deepest plate/tray background
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
