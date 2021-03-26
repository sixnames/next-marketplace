const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './routes/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['Gilroy', ...defaultTheme.fontFamily.sans],
      },
      minWidth: {
        button: '12rem',
        'button-small': '9rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
