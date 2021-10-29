import {
  ASSETS_DIST_SHOPS,
  ASSETS_DIST_SHOPS_LOGOS,
  DEFAULT_CITY,
  GEO_POINT_TYPE,
} from '../../../../config/common';
import { ShopModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const shops: ShopModel[] = [
  {
    _id: getObjectId('shop Shop A'),
    itemId: '000001',
    token: '000001',
    slug: 'shop_a',
    name: 'Shop A',
    citySlug: DEFAULT_CITY,
    companyId: getObjectId('company Company A'),
    license: 'Shop A license 098324knlkajdf98798',
    logo: {
      index: 0,
      url: `/${ASSETS_DIST_SHOPS_LOGOS}/000001/000001-0.webp`,
    },
    mainImage: `/${ASSETS_DIST_SHOPS}/000001/000001-0.webp`,
    assets: [
      {
        index: 0,
        url: `/${ASSETS_DIST_SHOPS}/000001/000001-0.webp`,
      },
    ],
    mapMarker: {
      lightTheme: `/${ASSETS_DIST_SHOPS}/000001/marker-light.png`,
      darkTheme: `/${ASSETS_DIST_SHOPS}/000001/marker-dark.png`,
    },
    contacts: {
      emails: ['shopA@gmail.com'],
      phones: ['+75556667788'],
    },
    address: {
      formattedAddress: 'Ходынский бульвар, 20а, Москва, Россия, 125252',
      point: {
        type: GEO_POINT_TYPE,
        coordinates: [37.5228921272735, 55.790804890785395],
      },
    },
    rating: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('shop Shop B'),
    itemId: '000002',
    slug: 'shop_b',
    name: 'Shop B',
    citySlug: DEFAULT_CITY,
    license: 'Shop B license 098324knlkajdf98798',
    logo: {
      index: 0,
      url: `/${ASSETS_DIST_SHOPS_LOGOS}/000002/000002-0.webp`,
    },
    mainImage: `/${ASSETS_DIST_SHOPS}/000002/000002-0.webp`,
    assets: [
      {
        index: 0,
        url: `/${ASSETS_DIST_SHOPS}/000002/000002-0.webp`,
      },
    ],
    contacts: {
      emails: ['shopB@gmail.com'],
      phones: ['+76667778899'],
    },
    address: {
      formattedAddress: 'улица Пятницкая, 27а, Москва, Russia',
      point: {
        type: GEO_POINT_TYPE,
        coordinates: [37.62867021460195, 55.74116803925581],
      },
    },
    companyId: getObjectId('company Company B'),
    rating: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('shop Shop C'),
    itemId: '000003',
    token: '000003',
    slug: 'shop_c',
    name: 'Shop C',
    citySlug: DEFAULT_CITY,
    license: 'Shop C license 098324knlkajdf98798',
    logo: {
      index: 0,
      url: `/${ASSETS_DIST_SHOPS_LOGOS}/000003/000003-0.webp`,
    },
    mainImage: `/${ASSETS_DIST_SHOPS}/000003/000003-0.webp`,
    assets: [
      {
        index: 0,
        url: `/${ASSETS_DIST_SHOPS}/000003/000003-0.webp`,
      },
    ],
    contacts: {
      emails: ['shopC@gmail.com'],
      phones: ['+76665554433'],
    },
    address: {
      formattedAddress: 'Ходынский б-р, 20а, Москва, Russia, 125252',
      point: {
        type: GEO_POINT_TYPE,
        coordinates: [37.522890631943376, 55.79065483867902],
      },
    },
    companyId: getObjectId('company Company B'),
    rating: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('shop Shop D'),
    itemId: '000004',
    token: '000004',
    slug: 'shop_d',
    name: 'Shop D',
    citySlug: DEFAULT_CITY,
    license: 'Shop D license 098324knlkajdf98798',
    logo: {
      index: 0,
      url: `/${ASSETS_DIST_SHOPS_LOGOS}/000004/000004-0.webp`,
    },
    mainImage: `/${ASSETS_DIST_SHOPS}/000004/000004-0.webp`,
    assets: [
      {
        index: 0,
        url: `/${ASSETS_DIST_SHOPS}/000004/000004-0.webp`,
      },
    ],
    contacts: {
      emails: ['shopD@gmail.com'],
      phones: ['+76665554444'],
    },
    address: {
      formattedAddress: 'Ходынский б-р, 20а, Москва, Russia, 125252',
      point: {
        type: GEO_POINT_TYPE,
        coordinates: [37.522890631943376, 55.79065483867902],
      },
    },
    companyId: getObjectId('company Company C'),
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = shops;
