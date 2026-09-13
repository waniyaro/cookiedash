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
          page: '#090605',        // Deepest espresso soot background
          surface: '#221813',     // Elevated dark umbra card base (L ~13%)
          elevated: '#2d1f19',    // High elevation / hover surface (L ~17%)
          tray: '#0c0806',        // Inset black trays (L ~4%)
          border: '#442f24',      // Crisp tactile boundary
          borderMuted: '#2d1e17', // Secondary dividers
          flame: '#ff7a1a',       // Hero fire gradient start
          amber: '#ffb347',       // Hero fire gradient end
          gold: '#d4a15c',        // Secondary Vault antique gold
          goldMuted: '#9e7a46',
          ivory: '#f5ece1',       // Crisp high-contrast text
          taupe: '#968579',       // Legible ash taupe labels
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
