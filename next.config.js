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
    DEFAULT_DOMAIN: process.env.DEFAULT_DOMAIN,
  },
  async headers() {
    return [
      // Assets
      {
        source: '/fonts/:all*(woff2|woff)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ];
  },
};
