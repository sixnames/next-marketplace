import { ObjectIdModel, PromoBaseInterface, PromoProductModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import promo from '../promo/promo';

require('dotenv').config();
const shopAPromo = promo[0];

interface ShopPromoBaseInterface extends PromoBaseInterface {
  rubricSlug: string;
  rubricId: ObjectIdModel;
  promoId: ObjectIdModel;
  shopId: ObjectIdModel;
}

const shopAPromoBase: ShopPromoBaseInterface = {
  companyId: shopAPromo.companyId,
  companySlug: shopAPromo.companySlug,
  useBiggestDiscount: shopAPromo.useBiggestDiscount,
  useBiggestCashback: shopAPromo.useBiggestCashback,
  discountPercent: shopAPromo.discountPercent,
  cashbackPercent: shopAPromo.cashbackPercent,
  allowPayFromCashback: shopAPromo.allowPayFromCashback,
  addCategoryDiscount: shopAPromo.addCategoryDiscount,
  addCategoryCashback: shopAPromo.addCategoryCashback,
  rubricSlug: 'viski',
  rubricId: getObjectId('rubric Виски'),
  promoId: shopAPromo._id,
  shopId: getObjectId('shop Shop A'),
  endAt: shopAPromo.endAt,
  startAt: shopAPromo.startAt,
};

const promoProducts: PromoProductModel[] = [
  {
    _id: getObjectId('000011'),
    shopProductId: getObjectId('shop_a 000011'),
    productId: getObjectId('000011'),
    ...shopAPromoBase,
  },
  {
    _id: getObjectId('000010'),
    shopProductId: getObjectId('shop_a 000010'),
    productId: getObjectId('000010'),
    ...shopAPromoBase,
  },
  {
    _id: getObjectId('000009'),
    shopProductId: getObjectId('shop_a 000009'),
    productId: getObjectId('000009'),
    ...shopAPromoBase,
  },
];

// @ts-ignore
export = promoProducts;
