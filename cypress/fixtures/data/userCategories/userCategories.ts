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
    nameI18n: {
      ru: 'Company A category 1',
    },
    descriptionI18n: {
      ru: 'Company A category 1 description',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = userCategories;
