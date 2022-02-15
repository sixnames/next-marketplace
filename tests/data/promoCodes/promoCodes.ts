import { DEFAULT_LOCALE, ONE_WEEK } from 'lib/config/common';
import { PromoCodeModel } from 'db/dbModels';
import { getObjectId } from 'mongo-seeding';
require('dotenv').config();

const promoCodes: PromoCodeModel[] = [
  {
    _id: getObjectId('promo code a'),
    active: true,
    promoSlug: '000001',
    promoId: getObjectId('promo a'),
    companyId: getObjectId('company Company A'),
    companySlug: 'company_a',
    code: 'code',
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'Promo-code description. consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },

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
export = promoCodes;
