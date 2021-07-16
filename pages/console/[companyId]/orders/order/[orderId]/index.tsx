import Button from 'components/Button';
import CmsOrderDetails from 'components/CmsOrderDetails';
import FixedButtons from 'components/FixedButtons';
import Inner from 'components/Inner';
import { ROUTE_CONSOLE } from 'config/common';
import {
  COL_ORDER_CUSTOMERS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OrderInterface } from 'db/uiInterfaces';
import { useConfirmOrderMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getFullName } from 'lib/nameUtils';
import { castOrderStatus } from 'lib/orderUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface OrderPageConsumerInterface {
  order: OrderInterface;
}

const OrderPageConsumer: React.FC<OrderPageConsumerInterface> = ({ order }) => {
  const { query } = useRouter();
  const title = `Заказ № ${order.orderId}`;
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [confirmOrderMutation] = useConfirmOrderMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.confirmOrder),
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Список заказов',
        href: `${ROUTE_CONSOLE}/${query.companyId}/orders`,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <div className='relative'>
        <CmsOrderDetails order={order} title={title} />
        {order.status?.isPending ? (
          <Inner>
            <FixedButtons>
              <Button
                onClick={() => {
                  showLoading();
                  confirmOrderMutation({
                    variables: {
                      input: {
                        orderId: order._id,
                      },
                    },
                  }).catch(console.log);
                }}
              >
                Подтвердить заказ
              </Button>
            </FixedButtons>
          </Inner>
        ) : null}
      </div>
    </AppContentWrapper>
  );
};

interface OrderPageInterface extends PagePropsInterface, OrderPageConsumerInterface {}

const OrderPage: NextPage<OrderPageInterface> = ({ pageUrls, order }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <OrderPageConsumer order={order} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrderPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
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
        $lookup: {
          from: COL_ORDER_CUSTOMERS,
          as: 'customer',
          localField: '_id',
          foreignField: 'orderId',
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
        $addFields: {
          status: {
            $arrayElemAt: ['$status', 0],
          },
          customer: {
            $arrayElemAt: ['$customer', 0],
          },
          shop: {
            $arrayElemAt: ['$shop', 0],
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
    status: castOrderStatus({
      initialStatus: initialOrder.status,
      locale: props.sessionLocale,
    }),
    customer: initialOrder.customer
      ? {
          ...initialOrder.customer,
          fullName: getFullName(initialOrder.customer),
          formattedPhone: {
            raw: phoneToRaw(initialOrder.customer.phone),
            readable: phoneToReadable(initialOrder.customer.phone),
          },
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
