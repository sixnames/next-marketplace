import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import ShopDetails, { ShopDetailsInterface } from 'components/shops/ShopDetails';

interface CompanyShopInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopDetailsInterface, 'basePath'> {}

const CompanyShop: NextPage<CompanyShopInterface> = ({ layoutProps, shop }) => {
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: shop.name,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${shop.company?.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopDetails
        basePath={`${companyBasePath}/shops/shop`}
        shop={shop}
        breadcrumbs={breadcrumbs}
      />
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
