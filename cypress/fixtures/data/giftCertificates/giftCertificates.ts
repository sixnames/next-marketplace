import { DEFAULT_LOCALE } from '../../../../config/common';
import { GiftCertificateModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const certificates: GiftCertificateModel[] = [
  {
    _id: getObjectId(`gift certificate a`),
    userId: getObjectId('admin'),
    companyId: getObjectId('company Company A'),
    companySlug: 'company_a',
    initialValue: 5000,
    value: 4000,
    descriptionI18n: {
      [DEFAULT_LOCALE]: 'Описание gift certificate a',
    },
    nameI18n: {
      [DEFAULT_LOCALE]: 'gift certificate a',
    },
    log: [
      {
        orderId: getObjectId('order a'),
        value: 1000,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = certificates;
