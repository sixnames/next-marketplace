import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ShopOrder, {
  ShopOrderInterface,
} from '../../../../../../../../../components/shops/ShopOrder';
import { DEFAULT_COMPANY_SLUG } from '../../../../../../../../../config/common';
import { COL_COMPANIES, COL_SHOPS } from '../../../../../../../../../db/collectionNames';
import { getConsoleOrder } from '../../../../../../../../../db/dao/orders/getConsoleOrder';
import { getDatabase } from '../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  ShopInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';

interface CompanyShopAssetsInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopOrderInterface, 'basePath' | 'title'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({
  layoutProps,
  pageCompanySlug,
  shop,
  order,
  orderStatuses,
}) => {
  const title = `Заказ №${order.itemId}`;

  const { root, parentLink, shops, ...links } = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
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
        href: `${links.shop}/${shop._id}`,
      },
      {
        name: 'Заказы',
        href: links.shop.root,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopOrder
        pageCompanySlug={pageCompanySlug}
        title={title}
        order={order}
        orderStatuses={orderStatuses}
        breadcrumbs={breadcrumbs}
        basePath={links.shop.shopBasePath}
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
