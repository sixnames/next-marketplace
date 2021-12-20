import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ShopSyncErrors, {
  ShopSyncErrorsInterface,
} from '../../../../../../../components/shops/ShopSyncErrors';
import { DEFAULT_COMPANY_SLUG, ROUTE_CONSOLE } from '../../../../../../../config/common';
import { COL_SHOPS } from '../../../../../../../db/collectionNames';
import { getPaginatedNotSyncedProducts } from '../../../../../../../db/dao/notSyncedProducts/getPaginatedNotSyncedProducts';
import { ShopModel } from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { alwaysArray, alwaysString } from '../../../../../../../lib/arrayUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface CompanyShopSyncErrorsInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const CompanyShopSyncErrors: NextPage<CompanyShopSyncErrorsInterface> = ({
  layoutProps,
  shop,
  notSyncedProducts,
  companySlug,
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
    <ConsoleLayout {...layoutProps}>
      <ShopSyncErrors
        showControls={false}
        showShopName={false}
        notSyncedProducts={notSyncedProducts}
        basePath={`${companyBasePath}/shop`}
        breadcrumbs={breadcrumbs}
        shop={shop}
        companySlug={companySlug}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopSyncErrorsInterface>> => {
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

export default CompanyShopSyncErrors;
