/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"  // Tailwind va scanner tous tes fichiers React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
