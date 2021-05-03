const { fontFamily } = require('tailwindcss/defaultTheme');
// const colors = require('tailwindcss/colors');

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
        'border-color': `var(--borderColor)`,
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
        primary: `var(--primaryBackground)`,
        secondary: `var(--secondaryBackground)`,
        'secondary-light': `var(--secondaryBackgroundLight)`,
        'secondary-button-background': `var(--secondaryButtonBackground)`,
        'secondary-b-button-background': `var(--primaryBackground)`,
        backdrop: `rgba(50, 50, 50, 0.3)`,
      },
      minHeight: {
        'full-height': 'var(--fullHeight, 100vh)',
        'control-button-height': 'var(--formInputHeight)',
        'control-button-height-s': 'var(--formInputHeightSmall)',
        'control-button-height-xs': 'var(--formInputHeightSmaller)',
      },
      height: {},
      screens: {
        'wp-desktop': '1025px',
      },
      boxShadow: {},
      spacing: {
        'full-height': 'var(--fullHeight, 100vh)',
        'logo-width': '10rem',
        'inner-block-max-width': '1296px',
        'inner-block-vertical-padding': '1.5rem',
        'inner-block-horizontal-padding': '1.5rem',
        'form-input-height': '3.5rem',
        'small-button-height': '2rem',
        'form-input-height-sm': '2.5rem',
        'form-input-height-2xsm': '2rem',
        'form-line-height': '2rem',
        'input-padding-horizontal': 'var(--inputPaddingHorizontal)',
        'button-min-width': '14rem',
        'button-min-width-sm': '9rem',
        'control-button-height': 'var(--formInputHeight)',
        'control-button-height-s': 'var(--formInputHeightSmall)',
        'control-button-height-xs': 'var(--formInputHeightSmaller)',
        'min-link-height': 'var(--formInputHeight)',
        'min-link-height-s': 'var(--formInputHeightSmall)',
        'min-link-height-xs': 'var(--formInputHeightSmaller)',
        'tabs-nav-height': 'var(--formInputHeight)',
        'tabs-nav-height-s': 'var(--formInputHeightSmall)',
        'tabs-nav-height-xs': 'var(--formInputHeightSmaller)',
        'mobile-nav-height': '85px',
        'input-icon-size': 'var(--inputIconSize)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
