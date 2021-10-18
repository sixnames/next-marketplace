import { UserCategoryModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const userCategories: UserCategoryModel[] = [
  {
    _id: getObjectId('Company A category 1'),
    cashbackPercent: 10,
    discountPercent: 15,
    payFromCashbackPercent: 3,
    entryMinCharge: 10000,
    companyId: getObjectId('company Company A'),
    // addCashbackIfPayFromCashback: false,
    nameI18n: {
      ru: 'Company A category 1',
    },
    descriptionI18n: {
      ru: 'Company A category 1 description',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('Company B category 1'),
    cashbackPercent: 50,
    discountPercent: 50,
    payFromCashbackPercent: 50,
    entryMinCharge: 999,
    companyId: getObjectId('company Company B'),
    // addCashbackIfPayFromCashback: false,
    nameI18n: {
      ru: 'Company B category 1',
    },
    descriptionI18n: {
      ru: 'Company B category 1 description',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('Company C category 1'),
    cashbackPercent: 0,
    discountPercent: 5,
    payFromCashbackPercent: 0,
    entryMinCharge: 999,
    companyId: getObjectId('company Company C'),
    // addCashbackIfPayFromCashback: false,
    nameI18n: {
      ru: 'Company C category 1',
    },
    descriptionI18n: {
      ru: 'Company C category 1 description',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = userCategories;
