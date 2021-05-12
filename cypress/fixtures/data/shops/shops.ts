import { DEFAULT_CITY } from '../../../../config/common';
import { ShopModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const shops: ShopModel[] = [
  {
    _id: getObjectId('shop Shop A'),
    itemId: '000001',
    slug: 'shop_a',
    name: 'Shop A',
    citySlug: DEFAULT_CITY,
    companyId: getObjectId('company Company A'),
    logo: {
      index: 0,
      url: 'https://winepoint.storage.yandexcloud.net/shop-logos/000001/000001-0.webp',
    },
    mainImage: 'https://winepoint.storage.yandexcloud.net/shops/000001/000001-0.webp',
    assets: [
      {
        index: 0,
        url: 'https://winepoint.storage.yandexcloud.net/shops/000001/000001-0.webp',
      },
    ],
    contacts: {
      emails: ['shopA@gmail.com'],
      phones: ['+75556667788'],
    },
    address: {
      formattedAddress: 'Ходынский бульвар, 20а, Москва, Россия, 125252',
      point: {
        type: 'Point',
        coordinates: [37.5228921272735, 55.790804890785395],
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('shop Shop B'),
    itemId: '000002',
    slug: 'shop_b',
    name: 'Shop B',
    citySlug: DEFAULT_CITY,
    logo: {
      index: 0,
      url: 'https://winepoint.storage.yandexcloud.net/image-fallback.png',
    },
    mainImage: 'https://winepoint.storage.yandexcloud.net/image-fallback.png',
    assets: [
      {
        index: 0,
        url: 'https://winepoint.storage.yandexcloud.net/image-fallback.png',
      },
    ],
    contacts: {
      emails: ['shopB@gmail.com'],
      phones: ['+76667778899'],
    },
    address: {
      formattedAddress: 'улица Пятницкая, 27а, Москва, Russia',
      point: {
        type: 'Point',
        coordinates: [37.62867021460195, 55.74116803925581],
      },
    },
    companyId: getObjectId('company Company B'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export = shops;
