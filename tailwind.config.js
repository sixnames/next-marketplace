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
        'primary-text': `var(--textColor)`,
        'secondary-text': `var(--textSecondaryColor)`,
        checkbox: `var(--checkboxBg)`,
        'border-100': `var(--border-100)`,
        'border-200': `var(--border-200)`,
        'border-300': `var(--border-300)`,
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
        'primary-dark': `var(--primaryBackgroundDark)`,
        'primary-transparent': `var(--primaryBackgroundTransparent)`,
        secondary: {
          DEFAULT: `var(--secondaryBackground)`,
          light: `var(--secondaryBackgroundLight)`,
        },
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
        'input-icon-size': 'var(--inputIconSize)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: `var(--textColor)`,
          },
        },
      },
      screens: {
        xs: '480px',
      },
      gridTemplateColumns: {
        13: 'repeat(13,1fr)',
        14: 'repeat(14,1fr)',
        15: 'repeat(15,1fr)',
        16: 'repeat(16,1fr)',
        17: 'repeat(17,1fr)',
        18: 'repeat(18,1fr)',
        19: 'repeat(19,1fr)',
        20: 'repeat(20,1fr)',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
      },
      gridColumnEnd: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
