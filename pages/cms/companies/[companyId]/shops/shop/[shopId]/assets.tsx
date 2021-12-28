import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ShopAssets, { ShopAssetsInterface } from '../../../../../../../components/shops/ShopAssets';
import { COL_COMPANIES, COL_SHOPS } from '../../../../../../../db/collectionNames';
import { ShopModel } from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface CompanyShopAssetsInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopAssetsInterface, 'basePath'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ layoutProps, shop }) => {
  const { root, parentLink, shops, ...links } = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: `${shop.company?.name}`,
        href: root,
      },
      {
        name: 'Магазины',
        href: shops,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopAssets basePath={links.shop.shopBasePath} shop={shop} breadcrumbs={breadcrumbs} />
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

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopAssets;
