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
        "background": "#221F1F",
        "background-secondary": "#141414",
        "background-secondary-alt": "#191919",
        "primary": "#A020F0"
      },
      fontFamily: {
        'app': ['Josefin Sans', 'sans-serif'], // Reemplaza 'Open Sans' con el nombre de la fuente que importaste
      },
    },
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'class'})],
}

