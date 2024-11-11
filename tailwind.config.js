/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,jsx}",
    "./node_modules/tw-elements/js/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        'light-cream': '#FCF3C4',
        'pale-peach': '#FCDBBE',
        'soft-pink': '#FBC3B8',
        'warm-pink': '#FBABB2',
        'light-rose': '#FA92AC',
        'vibrant-pink': '#FA7AA6',
        'rich-pink': '#F962A0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'], // Optional: for a more modern feel
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
      },
      borderRadius: {
        'xl': '1.5rem', // Rounded corners for modern, mobile-friendly UI
      },
      boxShadow: {
        'custom': '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for cards, etc.
      },
      screens: {
        'xs': '375px',  // Target small mobile devices (e.g., iPhone 6, 7, 8)
        'sm': '640px',  // Standard mobile devices (e.g., iPhone X)
        'md': '768px',  // Tablet screen
        'lg': '1024px', // Laptop screen
        'xl': '1280px', // Large desktop
        '2xl': '1536px', // Extra-large desktop screens
      },
    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
  darkMode: "class"
};