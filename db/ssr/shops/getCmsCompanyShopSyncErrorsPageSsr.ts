import { COL_COMPANIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getPaginatedNotSyncedProducts } from 'db/ssr/shops/getPaginatedNotSyncedProducts';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsCompanyShopSyncErrorsPageInterface } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/sync-errors/[...filters]';

export const getCmsCompanyShopSyncErrorsPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsCompanyShopSyncErrorsPageInterface>> => {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shopAggregation = await shopsCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(`${shopId}`) },
      },
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          foreignField: '_id',
          localField: 'companyId',
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
        },
      },
    ])
    .toArray();
  const shop = shopAggregation[0];

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  const payload = await getPaginatedNotSyncedProducts({
    filters: alwaysArray(query.filters),
    shopId: alwaysString(shopId),
  });

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
      notSyncedProducts: castDbData(payload),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};
