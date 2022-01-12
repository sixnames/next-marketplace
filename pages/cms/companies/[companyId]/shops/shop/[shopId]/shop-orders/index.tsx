import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ShopOrders, {
  ShopOrdersInterface,
} from '../../../../../../../../components/shops/ShopOrders';
import { SORT_DESC } from '../../../../../../../../config/common';
import {
  COL_COMPANIES,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOPS,
} from '../../../../../../../../db/collectionNames';
import { ShopModel } from '../../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  ShopInterface,
} from '../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../../../../../../lib/i18n';
import { getCmsCompanyLinks } from '../../../../../../../../lib/linkUtils';
import { getShortName } from '../../../../../../../../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../../../../../../../../lib/phoneUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../lib/ssrUtils';

interface CompanyShopAssetsInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopOrdersInterface, 'basePath'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ layoutProps, shop }) => {
  const links = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Заказы',
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${shop.company?.name}`,
        href: links.root,
      },
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
      <ShopOrders breadcrumbs={breadcrumbs} shop={shop} />
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
