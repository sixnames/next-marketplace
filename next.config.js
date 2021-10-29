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
    DEV_ENV: process.env.DEV_ENV,
    OBJECT_STORAGE_DOMAIN: process.env.OBJECT_STORAGE_DOMAIN,
    OBJECT_STORAGE_IMAGE_FALLBACK: process.env.OBJECT_STORAGE_IMAGE_FALLBACK,
    NEXT_GOOGLE_MAPS_API_KEY: process.env.NEXT_GOOGLE_MAPS_API_KEY,
    DEFAULT_DOMAIN: process.env.DEFAULT_DOMAIN,
    NEXTAUTH_KEY: process.env.NEXTAUTH_KEY,
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
    DEFAULT_CITY: process.env.DEFAULT_CITY,
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
