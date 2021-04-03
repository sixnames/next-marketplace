const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './routes/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['Gilroy', ...fontFamily.sans],
      },
      minWidth: {
        button: '12rem',
        'button-small': '9rem',
      },
      colors: {
        theme: `var(--theme)`,
        'link-text': `var(--linkColor)`,
        'primary-text': `var(--textColor)`,
        'secondary-text': `var(--textSecondaryColor)`,
        'wp-error': `var(--wp-error)`,
        'wp-white': `var(--wp-white)`,
        'wp-dark-pink': `var(--wp-dark-pink)`,
        'wp-yellow': `var(--wp-yellow)`,
        'wp-light-green': `var(--wp-light-green)`,
        'wp-dark-green': `var(--wp-dark-green)`,
        'wp-dark-gray-100': `var(--wp-dark-gray-100)`,
        'wp-dark-gray-200': `var(--wp-dark-gray-200)`,
        'wp-dark-gray-250': `var(--wp-dark-gray-250)`,
        'wp-dark-gray-300': `var(--wp-dark-gray-300)`,
        'wp-dark-gray-400': `var(--wp-dark-gray-400)`,
        'wp-mid-gray-100': `var(--wp-mid-gray-100)`,
        'wp-light-gray-100': `var(--wp-light-gray-100)`,
        'wp-light-gray-200': `var(--wp-light-gray-200)`,
        'wp-light-gray-300': `var(--wp-light-gray-300)`,
        'primary-background': `var(--primaryBackground)`,
        'secondary-background': `var(--secondaryBackground)`,
        'secondary-background-light': `var(--secondaryBackgroundLight)`,
        'secondary-button-background': `var(--secondaryButtonBackground)`,
      },
      minHeight: {
        'full-height': 'var(--fullHeight, 100vh)',
      },
      screens: {
        'wp-desktop': '1025px',
      },
      boxShadow: {},
      spacing: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
