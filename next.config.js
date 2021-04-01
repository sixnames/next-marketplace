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
  },
  /*async headers() {
    return [
      // Catalogue
      {
        source: '/:catalogue*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=604800000, stale-while-revalidate=86400000',
          },
        ],
      },
      {
        source: '/product/:card*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=604800000, stale-while-revalidate=86400000',
          },
        ],
      },
      // Assets
      {
        source: '/:all*(woff2|woff|svg|jpg|jpeg|png|ico)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      // Api
      {
        source: '/api/(.*)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
      // Dashboard
      {
        source: '/cms/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
      {
        source: '/app/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },*/
};
