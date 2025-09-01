/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        p: '#676D7C',
        main: '#696CFF',
        stroke: '#ebeef2',
        h1: '#0B1223',
        white: '#fff',
        black: '#000',
      },
      boxShadow: {
        'box': '1px 0px 20px 5px rgba(0,0,0,0.05)',
      },
      aspectRatio: {
        '1/8': '8 / 1',
      },
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '0.2rem',
        xl: '2px',
        '2xl': '6rem',
      },
      center: true,
    },
    components: {
      Badge: {
        dotSize: 8,
      },
    },

  },


  plugins: [],
}