require('dotenv').config();

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
  },
  images: {
    domains: [process.env.AWS_DOMAIN],
  },
  env: {
    AWS_IMAGE_FALLBACK: process.env.AWS_IMAGE_FALLBACK,
    AWS_PRODUCT_IMAGE_FALLBACK: process.env.AWS_PRODUCT_IMAGE_FALLBACK,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
};
