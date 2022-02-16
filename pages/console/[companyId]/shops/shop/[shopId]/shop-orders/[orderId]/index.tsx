import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopOrder, { ShopOrderInterface } from 'components/shops/ShopOrder';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getConsoleOrder } from 'db/ssr/orders/getConsoleOrder';
import { AppContentWrapperBreadCrumbs, ShopInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getConsoleCompanyLinks } from 'lib/linkUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CompanyShopAssetsInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopOrderInterface, 'basePath' | 'title'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({
  layoutProps,
  pageCompanySlug,
  shop,
  order,
  orderStatuses,
}) => {
  const title = `Заказ №${order.orderId}`;

  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
      {
        name: 'Заказы',
        href: links.shop.order.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopOrder
        orderStatuses={orderStatuses}
        pageCompanySlug={pageCompanySlug}
        title={title}
        order={order}
        breadcrumbs={breadcrumbs}
        basePath={links.parentLink}
        shop={shop}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAssetsInterface>> => {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();

  const { query } = context;
  const { shopId, orderId } = query;
  const initialProps = await getConsoleInitialData({ context });

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
  const payload = await getConsoleOrder({
    locale,
    orderId: `${query.orderId}`,
  });
  if (!payload) {
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
      order: castDbData(payload.order),
      orderStatuses: castDbData(payload.orderStatuses),
      pageCompanySlug,
    },
  };
};

export default CompanyShopAssets;
