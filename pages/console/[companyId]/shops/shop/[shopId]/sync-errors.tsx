import ShopSyncErrors, { ShopSyncErrorsInterface } from 'components/shops/ShopSyncErrors';
import { ROUTE_CONSOLE } from 'config/common';
import { COL_NOT_SYNCED_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { NotSyncedProductModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface CompanyShopSyncErrorsInterface
  extends PagePropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const CompanyShopSyncErrors: NextPage<CompanyShopSyncErrorsInterface> = ({
  pageUrls,
  shop,
  notSyncedProducts,
  currentCompany,
}) => {
  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Ошибки синхронизации',
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shop/${shop._id}`,
      },
    ],
  };

  return (
    <AppLayout pageUrls={pageUrls} company={currentCompany}>
      <ShopSyncErrors
        showControls={false}
        showShopName={false}
        notSyncedProducts={notSyncedProducts}
        basePath={`${companyBasePath}/shop`}
        breadcrumbs={breadcrumbs}
        shop={shop}
      />
    </AppLayout>
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
  const initialProps = await getConsoleInitialData({ context });

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
