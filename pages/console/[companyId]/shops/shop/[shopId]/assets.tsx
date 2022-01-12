import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ShopAssets, { ShopAssetsInterface } from '../../../../../../components/shops/ShopAssets';
import { COL_SHOPS } from '../../../../../../db/collectionNames';
import { ShopModel } from '../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs } from '../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../lib/linkUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';

interface CompanyShopAssetsInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopAssetsInterface, 'basePath'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ layoutProps, shop }) => {
  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
    config: [
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopAssets basePath={links.root} shop={shop} breadcrumbs={breadcrumbs} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAssetsInterface>> => {
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

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopAssets;
