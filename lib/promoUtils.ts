import { SORT_DESC } from 'config/common';
import { COL_PROMO } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { PromoInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';

interface GetPromoListSsrInterface {
  locale: string;
  companyId: string;
}

export async function getPromoListSsr({
  companyId,
  locale,
}: GetPromoListSsrInterface): Promise<PromoInterface[]> {
  const { db } = await getDatabase();
  const promoCollection = db.collection<PromoInterface>(COL_PROMO);
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
  const { db } = await getDatabase();
  const promoCollection = db.collection<PromoInterface>(COL_PROMO);
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
