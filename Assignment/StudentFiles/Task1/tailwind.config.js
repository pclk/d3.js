/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        viridis: {
          yellow: '#fde725',
          green: '#f5f5f5',
          teal: '#21918c',
          purple: '#440154',
        },
        dashboard: {
          background: '#040404',
        }
      }
    },
  },
  plugins: [],
}

