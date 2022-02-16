import { ObjectId } from 'mongodb';
import { getDbCollections } from '../db/mongodb';
import { PromoInterface } from '../db/uiInterfaces';
import { SORT_DESC } from './config/common';
import { getFieldStringLocale } from './i18n';

interface GetPromoListSsrInterface {
  locale: string;
  companyId: string;
}

export async function getPromoListSsr({
  companyId,
  locale,
}: GetPromoListSsrInterface): Promise<PromoInterface[]> {
  const collections = await getDbCollections();
  const promoCollection = collections.promoCollection();
  const promoAggregation = await promoCollection
    .aggregate<PromoInterface>([
      {
        $match: {
          companyId: new ObjectId(companyId),
        },
      },
      {
        $sort: {
          endAt: SORT_DESC,
        },
      },
    ])
    .toArray();

  const promoList: PromoInterface[] = promoAggregation.map((promo) => {
    return {
      ...promo,
      name: getFieldStringLocale(promo.nameI18n, locale),
      description: getFieldStringLocale(promo.descriptionI18n, locale),
    };
  });

  return promoList;
}

interface GetPromoSsrInterface {
  locale: string;
  promoId: string;
}

export async function getPromoSsr({
  promoId,
  locale,
}: GetPromoSsrInterface): Promise<PromoInterface | null> {
  const collections = await getDbCollections();
  const promoCollection = collections.promoCollection();
  const promoAggregation = await promoCollection
    .aggregate<PromoInterface>([
      {
        $match: {
          _id: new ObjectId(promoId),
        },
      },
      {
        $sort: {
          endAt: SORT_DESC,
        },
      },
    ])
    .toArray();
  const promoResult = promoAggregation[0];
  if (!promoResult) {
    return null;
  }

  const promo: PromoInterface = {
    ...promoResult,
    name: getFieldStringLocale(promoResult.nameI18n, locale),
    description: getFieldStringLocale(promoResult.descriptionI18n, locale),
  };

  return promo;
}
