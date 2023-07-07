/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "video-current-progress": "#5558DD",
        "video-progress": "#343434",
      }
    },
  },
  plugins: [],
}

