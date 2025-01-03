/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0093cd',
        textPrimaryLight: '#171923',
        textPrimaryDark: '#F0F1F5',
        main: {
          light: '#F4F5F9',
          dark: '#1F1F1F'
        },
        layout: {
          light: '#FCFCFC',
          dark: '#1B1B1C'
        },
        card: {
          light: '#FFFFFF',
          dark: '#2D2D2D'
        }
      },
      boxShadow: {
        insetShadow : 'inset #000000 0px 0px 37px -41px',
      }
    },
  },
  plugins: [],
}