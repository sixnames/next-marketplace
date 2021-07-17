import { ROUTE_CONSOLE } from 'config/common';
import { COL_COMPANIES, COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import ShopDetails, { ShopDetailsInterface } from 'components/shops/ShopDetails';

interface CompanyShopInterface extends PagePropsInterface, Omit<ShopDetailsInterface, 'basePath'> {}

const CompanyShop: NextPage<CompanyShopInterface> = ({ pageUrls, currentCompany, shop }) => {
  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: shop.name,
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
    ],
  };

  return (
    <AppLayout pageUrls={pageUrls} company={currentCompany}>
      <ShopDetails basePath={`${companyBasePath}/shop`} shop={shop} breadcrumbs={breadcrumbs} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const { query } = context;
  const { shopId, companyId } = query;
  const initialProps = await getConsoleInitialData({ context });

  const shopAggregation = await shopsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${shopId}`),
          companyId: new ObjectId(`${companyId}`),
        },
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
