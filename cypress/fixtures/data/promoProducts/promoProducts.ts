import { ONE_WEEK } from '../../../../config/common';
import { PromoProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const promoProducts: PromoProductModel[] = [
  {
    _id: getObjectId('promo a'),
    promoId: getObjectId('promo a'),
    shopId: getObjectId('shop Shop A'),
    companyId: getObjectId('company Company A'),
    companySlug: 'company_a',
    shopProductId: getObjectId('f7a28552e11e528e2cd0a8ca'),
    productId: getObjectId('63fc012952c3c3741cee5616'),
    rubricSlug: 'viski',
    rubricId: getObjectId('rubric Виски'),

    // discount
    discountPercent: 10,
    addCategoryDiscount: true,
    useBiggestDiscount: false,

    // cashback
    cashbackPercent: 10,
    addCategoryCashback: true,
    useBiggestCashback: false,
    allowPayFromCashback: true,

    // dates
    startAt: new Date(),
    endAt: new Date(new Date().getTime() + ONE_WEEK),
  },
];

// @ts-ignore
export = promoProducts;
