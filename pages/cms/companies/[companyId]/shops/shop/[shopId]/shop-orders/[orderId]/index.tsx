import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_SHOPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { ShopInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getConsoleOrder } from 'lib/orderUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ShopOrder, { ShopOrderInterface } from 'components/shops/ShopOrder';

interface CompanyShopAssetsInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopOrderInterface, 'basePath' | 'title'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({
  layoutProps,
  pageCompanySlug,
  shop,
  order,
}) => {
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;
  const title = `Заказ №${order.itemId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
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
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
      {
        name: 'Заказы',
        href: `${companyBasePath}/shops/shop/${shop._id}/orders`,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopOrder
        pageCompanySlug={pageCompanySlug}
        title={title}
        order={order}
        breadcrumbs={breadcrumbs}
        basePath={`${companyBasePath}/shops/shop`}
        shop={shop}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAssetsInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);

  const { query } = context;
  const { shopId, orderId } = query;
  const initialProps = await getAppInitialData({ context });

  if (!initialProps.props || !shopId || !orderId) {
    return {
      notFound: true,
    };
  }

  const shopAggregationResult = await shopsCollection
    .aggregate<ShopInterface>([
      {
        $match: {
          _id: new ObjectId(`${shopId}`),
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

  const shop = shopAggregationResult[0];
  if (!shop) {
    return {
      notFound: true,
    };
  }

  const locale = initialProps.props.sessionLocale;
  const order = await getConsoleOrder({
    locale,
    orderId: `${query.orderId}`,
  });
  if (!order) {
    return {
      notFound: true,
    };
  }

  const pageCompanySlug =
    shop.company && shop.company.domain ? shop.company.slug : DEFAULT_COMPANY_SLUG;

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
      order: castDbData(order),
      pageCompanySlug,
    },
  };
};

export default CompanyShopAssets;
