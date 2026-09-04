/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0284c7',
          darkBlue: '#0369a1',
          teal: '#0d9488',
        }
      }
    },
  },
  plugins: [],
}
