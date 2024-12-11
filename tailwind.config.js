/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,jsx}",
    "./node_modules/tw-elements/js/**/*.jsx",
  ],
  theme: {
    extend: {
      clipPath: {
        'artistic': 'polygon(0% 12%, 100% 0%, 100% 88%, 0% 100%)', // Custom clip path
      },
      colors: {
        'light-cream': '#FCF3C4',
        'pale-peach': '#FCDBBE',
        'soft-pink': '#FBC3B8',
        'warm-pink': '#FBABB2',
        'light-rose': '#FA92AC',
        'vibrant-pink': '#FA7AA6',
        'rich-pink': '#F962A0',
        'dark-charcoal': '#4A4A4A',
        'taupe-brown': '#6D4C41',
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'], // Optional: for a more modern feel
        'body': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        'sans': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ]
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
      animation: {
        fadeInOut: 'fadeInOut 1.5s infinite ease-in-out', // Adjust timing here
      },
      keyframes: {
        fadeInOut: {
          '0%': {
            color: '#455A64', // Initial color (Gray)
          },
          '50%': {
            color: '#4bb8a9', // Primary color
          },
          '100%': {
            color: '#455A64', // Return to initial color
          },
        },
      },
      // Extend Tailwind to transition colors
      transitionProperty: {
        'colors': 'color, background-color', // Apply to background and text color
      },
    },
  },
  plugins: [
    require("tw-elements/plugin.cjs")
  ],
  darkMode: "class"
};
