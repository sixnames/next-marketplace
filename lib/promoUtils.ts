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
