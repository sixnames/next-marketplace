import ShopSyncErrors, { ShopSyncErrorsInterface } from 'components/shops/ShopSyncErrors';
import { ROUTE_CMS } from 'config/common';
import { COL_NOT_SYNCED_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { NotSyncedProductModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface CompanyShopSyncErrorsInterface
  extends PagePropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const CompanyShopSyncErrors: NextPage<CompanyShopSyncErrorsInterface> = ({
  pageUrls,
  shop,
  notSyncedProducts,
}) => {
  const router = useRouter();

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopSyncErrors
        notSyncedProducts={notSyncedProducts}
        basePath={`${ROUTE_CMS}/companies/${router.query.companyId}/shops/shop`}
        shop={shop}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopSyncErrorsInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const notSyncedProductsCollection = db.collection<NotSyncedProductModel>(COL_NOT_SYNCED_PRODUCTS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  const notSyncedProducts = await notSyncedProductsCollection
    .find({
      shopId: shop._id,
    })
    .toArray();

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
      notSyncedProducts: castDbData(notSyncedProducts),
    },
  };
};

export default CompanyShopSyncErrors;
