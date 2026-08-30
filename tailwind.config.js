/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',      // InJourney Deep Navy (Sidebar & Header)
          cyan: '#0284c7',      // InJourney AIRPORTS Cyan Blue
          teal: '#0891b2',      // Accent Teal
          accent: '#06b6d4',    // Bright Sky Cyan
          soft: '#f1f5f9',      // Soft Slate Background
          card: '#ffffff',      // Crisp Card
          badgeActive: '#0284c7', // Active (InJourney Cyan)
          badgeBroken: '#e11d48', // Broken/Maintenance (Rose)
          badgeStorage: '#d97706',// In Storage (Amber)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.12)',
        'glass-hover': '0 12px 40px 0 rgba(2, 132, 199, 0.20)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
      }
    },
  },
  plugins: [],
}
