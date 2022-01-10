import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ShopDetails, {
  ShopDetailsInterface,
} from '../../../../../../../components/shops/ShopDetails';
import { COL_COMPANIES, COL_SHOPS } from '../../../../../../../db/collectionNames';
import { ShopModel } from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../db/uiInterfaces';
import { getCmsCompanyLinks } from '../../../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';

interface CompanyShopInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopDetailsInterface, 'basePath'> {}

const CompanyShop: NextPage<CompanyShopInterface> = ({ layoutProps, shop }) => {
  const { root, parentLink, shops, ...links } = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: shop.name,
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
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopDetails basePath={links.shop.itemPath} shop={shop} breadcrumbs={breadcrumbs} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopInterface>> => {
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

export default CompanyShop;
