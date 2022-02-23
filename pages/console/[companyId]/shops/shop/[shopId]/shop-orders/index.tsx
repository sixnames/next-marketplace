import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopOrders, { ShopOrdersInterface } from 'components/shops/ShopOrders';
import {
  COL_COMPANIES,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
} from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, ShopInterface } from 'db/uiInterfaces';
import { SORT_DESC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';

import { getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
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
    Omit<ShopOrdersInterface, 'basePath'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ layoutProps, shop }) => {
  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Заказы',
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
      <ShopOrders breadcrumbs={breadcrumbs} basePath={links.parentLink} shop={shop} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAssetsInterface>> => {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getConsoleInitialData({ context });

  if (!initialProps.props || !shopId) {
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
      {
        $lookup: {
          from: COL_ORDERS,
          as: 'orders',
          let: { shopId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$shopId', '$$shopId'],
                },
              },
            },
            {
              $lookup: {
                from: COL_ORDER_STATUSES,
                as: 'status',
                localField: 'statusId',
                foreignField: '_id',
              },
            },
            {
              $lookup: {
                from: COL_ORDER_CUSTOMERS,
                as: 'customer',
                localField: '_id',
                foreignField: 'orderId',
              },
            },
            {
              $addFields: {
                status: {
                  $arrayElemAt: ['$status', 0],
                },
                customer: {
                  $arrayElemAt: ['$customer', 0],
                },
                productsCount: {
                  $size: '$shopProductIds',
                },
              },
            },
            {
              $sort: {
                createdAt: SORT_DESC,
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const shopResult = shopAggregationResult[0];
  if (!shopResult) {
    return {
      notFound: true,
    };
  }

  const shop: ShopInterface = {
    ...shopResult,
    orders: (shopResult.orders || []).map((order) => {
      return {
        ...order,
        status: order.status
          ? {
              ...order.status,
              name: getFieldStringLocale(order.status.nameI18n, initialProps.props?.sessionLocale),
            }
          : null,
        customer: order.customer
          ? {
              ...order.customer,
              shortName: getShortName(order.customer),
              formattedPhone: {
                raw: phoneToRaw(order.customer.phone),
                readable: phoneToReadable(order.customer.phone),
              },
            }
          : null,
      };
    }),
  };

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopAssets;
