import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { COL_ORDER_CUSTOMERS, COL_ORDER_STATUSES, COL_ORDERS, COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ShopInterface } from 'db/uiInterfaces';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import ShopOrders, { ShopOrdersInterface } from 'components/shops/ShopOrders';

interface CompanyShopAssetsInterface
  extends PagePropsInterface,
    Omit<ShopOrdersInterface, 'basePath'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ pageUrls, shop }) => {
  const router = useRouter();

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopOrders
        basePath={`${ROUTE_CMS}/companies/${router.query.companyId}/shops/shop`}
        shop={shop}
      />
    </CmsLayout>
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
