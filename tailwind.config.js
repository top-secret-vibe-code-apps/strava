/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        strava: {
          orange: '#fc4c02',
          'orange-light': '#ff6b35',
        }
      }
    },
  },
  plugins: [],
}
