require('dotenv').config();

module.exports = {
  i18n: {
    localeDetection: false,
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
  },
  images: {
    domains: [process.env.OBJECT_STORAGE_DOMAIN],
  },
  env: {
    OBJECT_STORAGE_IMAGE_FALLBACK: process.env.OBJECT_STORAGE_IMAGE_FALLBACK,
    OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK: process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK,
    NEXT_GOOGLE_MAPS_API_KEY: process.env.NEXT_GOOGLE_MAPS_API_KEY,
    SITE: process.env.SITE,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: `/${process.env.DEFAULT_CITY}`,
        permanent: true,
      },
    ];
  },
};
