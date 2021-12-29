import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import { alwaysArray, alwaysString } from '../../../lib/arrayUtils';
import { castDbData, getConsoleInitialData } from '../../../lib/ssrUtils';
import { ConsoleShopSyncErrorsListPageInterface } from '../../../pages/console/[companyId]/shops/shop/[shopId]/sync-errors/[...filters]';
import { COL_SHOPS } from '../../collectionNames';
import { ShopModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { getPaginatedNotSyncedProducts } from '../notSyncedProducts/getPaginatedNotSyncedProducts';

export const getConsoleShopSyncErrorsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsoleShopSyncErrorsListPageInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
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
