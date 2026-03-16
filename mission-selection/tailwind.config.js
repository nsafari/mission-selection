/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        rank: {
          critical: '#dc2626',  // red-600
          high: '#ea580c',      // orange-600
          medium: '#ca8a04',    // yellow-600
          low: '#16a34a',       // green-600
        },
      },
    },
  },
  plugins: [],
};
