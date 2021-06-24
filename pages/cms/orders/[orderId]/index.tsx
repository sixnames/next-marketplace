import FormattedDate from 'components/FormattedDate';
import Inner from 'components/Inner';
import Title from 'components/Title';
import {
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OrderInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface OrderPageConsumerInterface {
  order: OrderInterface;
}

const OrderPageConsumer: React.FC<OrderPageConsumerInterface> = ({ order }) => {
  const { itemId, createdAt, totalPrice, status, products } = order;

  console.log({
    totalPrice,
    products,
  });

  return (
    <AppContentWrapper>
      <Inner testId={`order-details`}>
        <div className='grid gap-4 md:flex justify-between items-baseline mb-12'>
          <div>
            <Title low>Заказ №{itemId}</Title>
            <div className='text-secondary-text'>
              от <FormattedDate value={createdAt} />
            </div>
          </div>
          <div className='font-medium' style={status ? { color: status.color } : {}}>
            {status?.name}
          </div>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface OrderPageInterface extends OrderPageConsumerInterface, PagePropsInterface {}

const OrderPage: NextPage<OrderPageInterface> = ({ pageUrls, order }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={`Заказ №${order.itemId}`}>
      <OrderPageConsumer order={order} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrderPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.orderId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);
  const orderAggregationResult = await ordersCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.orderId}`),
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
        $addFields: {
          status: {
            $arrayElemAt: ['$status', 0],
          },
        },
      },
      {
        $lookup: {
          from: COL_ORDER_PRODUCTS,
          as: 'products',
          let: { orderId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$orderId', '$orderId'],
                },
              },
            },
            {
              $lookup: {
                from: COL_SHOPS,
                as: 'shop',
                let: { shopId: '$shopId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$shopId', '$_id'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: COL_SHOP_PRODUCTS,
                as: 'shopProduct',
                let: { shopProductId: '$shopProductId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$shopProductId', '$_id'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                shopProduct: {
                  $arrayElemAt: ['$shopProduct', 0],
                },
                shop: {
                  $arrayElemAt: ['$shop', 0],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const initialOrder = orderAggregationResult[0];

  if (!initialOrder) {
    return {
      notFound: true,
    };
  }

  const order: OrderInterface = {
    ...initialOrder,
    totalPrice: initialOrder.products?.reduce((acc: number, { totalPrice }) => {
      return acc + totalPrice;
    }, 0),
    status: initialOrder.status
      ? {
          ...initialOrder.status,
          name: getFieldStringLocale(initialOrder.status.nameI18n, props.sessionLocale),
        }
      : null,
  };

  return {
    props: {
      ...props,
      order: castDbData(order),
    },
  };
};

export default OrderPage;
