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
        // Existing colors
        'light-cream': '#FCF3C4',
        'pale-peach': '#FCDBBE',
        'soft-pink': '#FBC3B8',
        'warm-pink': '#FBABB2',
        'light-rose': '#FA92AC',
        'vibrant-pink': '#FA7AA6',
        'rich-pink': '#F962A0',
        'dark-charcoal': '#4A4A4A',
        'taupe-brown': '#6D4C41',
        'completed': '#4BB543',
        primary: { 
          "50": "#eff6ff", 
          "100": "#dbeafe", 
          "200": "#bfdbfe", 
          "300": "#93c5fd", 
          "400": "#60a5fa", 
          "500": "#3b82f6", 
          "600": "#2563eb", 
          "700": "#1d4ed8", 
          "800": "#1e40af", 
          "900": "#1e3a8a", 
          "950": "#172554" 
        },
        palette: {
          // New palette from Coolors
          'mimi-pink': '#FBD2DA',
          'mimi-pink-1': '#FAD3DD',  // Base Mimi Pink
          'mimi-pink-2': '#FBD3DA', // Light variation
          'mimi-pink-3': '#F8D8DE', // Lighter variation
          'mimi-pink-4': '#FDD2DC', // Soft pink variation
          'white': '#FFFFFF', // White
          'complement': '#42385d',
          'complement-1':'#fcb96d',
          'complement-2':'#e6bcfe',
          'body': '#f5f5f5',
          'body-1': '#e1f7e7',
          'body-2': '#f2e7dd',
          'body-3': '#fef6f8',
          'body-4': '#fef2f5',
          // 'body-4': '#ea4c62',
          'chip-red': '#ea4c62',
          'button': '#19bcff',

          // If you want to add additional custom gradients or complementary colors
          'soft-gradient': 'linear-gradient(45deg, #FAD3DD, #FFFFFF, #FBD3DA, #F8D8DE, #FDD2DC)', // A gradient using the new palette
        }
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
        'top': '0 -4px 6px rgba(0, 0, 0, 0.1)',
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
        fadeInOut: 'fadeInOut 1.5s infinite ease-in-out',
        'translate-y': 'translateY 500ms ease-out',
        'translate-y-reverse': 'translateYReverse 500ms ease-out', 
      },
      keyframes: {
        fadeInOut: {
          '0%': {
            color: '#FBD3DA', // Initial color (Gray)
          },
          '50%': {
            color: '#455A64', // Primary color
          },
          '100%': {
            color: '#FBD3DA', // Return to initial color
          },
        },
        translateY: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' }, // Start above the normal position
          '100%': { opacity: '1', transform: 'translateY(0)' }, // Move to normal position
        },
        translateYReverse: {
          '0%': { opacity: '1', transform: 'translateY(0)' }, // Start at normal position
          '100%': { opacity: '0', transform: 'translateY(30px)' }, // Move below the normal position
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
