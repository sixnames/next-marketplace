require('dotenv').config();

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
  },
  images: {
    domains: [process.env.NEXT_AWS_DOMAIN],
  },
  env: {
    NEXT_AWS_IMAGE_FALLBACK: process.env.NEXT_AWS_IMAGE_FALLBACK,
    NEXT_AWS_PRODUCT_IMAGE_FALLBACK: process.env.NEXT_AWS_PRODUCT_IMAGE_FALLBACK,
    NEXT_GOOGLE_MAPS_API_KEY: process.env.NEXT_GOOGLE_MAPS_API_KEY,
  },
};
