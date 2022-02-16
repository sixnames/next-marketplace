import { getDbCollections } from 'db/mongodb';
import { getPaginatedNotSyncedProducts } from 'db/ssr/shops/getPaginatedNotSyncedProducts';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ConsoleShopSyncErrorsListPageInterface } from 'pages/console/[companyId]/shops/shop/[shopId]/sync-errors/[...filters]';

export const getConsoleShopSyncErrorsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsoleShopSyncErrorsListPageInterface>> => {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getConsoleInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });
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
