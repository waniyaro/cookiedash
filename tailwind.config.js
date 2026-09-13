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
          page: '#0d0907',        // Deep roasted charcoal/obsidian
          surface: '#1a1310',     // Elevated dark umbra card base
          elevated: '#251b16',    // Higher elevation / hover surface
          tray: '#080504',        // Deepest soot inset trays
          border: '#38261e',      // Defined boundary
          borderMuted: '#241813', // Subtle dividers
          flame: '#ff7a1a',       // Hero fire gradient start
          amber: '#ffb347',       // Hero fire gradient end
          gold: '#d4a15c',        // Secondary Vault antique gold
          goldMuted: '#9e7a46',
          ivory: '#f5ece1',       // Crisp high-contrast text
          taupe: '#8f8075',       // Cool ash taupe labels
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
