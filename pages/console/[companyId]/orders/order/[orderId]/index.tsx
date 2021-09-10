import Button from 'components/Button';
import CmsOrderDetails from 'components/CmsOrderDetails';
import FixedButtons from 'components/FixedButtons';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { ROUTE_CONSOLE } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
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
import { useCancelOrder, useConfirmOrder } from 'hooks/mutations/order/useOrderMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
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
  const { showLoading, showModal } = useMutationCallbacks({
    reload: true,
  });

  const [confirmOrderMutation] = useConfirmOrder();
  const [cancelOrderMutation] = useCancelOrder();

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
                    orderId: `${order._id}`,
                  }).catch(console.log);
                }}
              >
                Подтвердить заказ
              </Button>

              <Button
                theme={'secondary'}
                onClick={() => {
                  showModal<ConfirmModalInterface>({
                    variant: CONFIRM_MODAL,
                    props: {
                      testId: 'cancel-order-modal',
                      message: `Вы уверены, что хотите отменить заказ № ${order.orderId} ?`,
                      confirm: () => {
                        showLoading();
                        cancelOrderMutation({
                          orderId: `${order._id}`,
                        }).catch(console.log);
                      },
                    },
                  });
                }}
              >
                Отменить заказ
              </Button>
            </FixedButtons>
          </Inner>
        ) : null}
      </div>
    </AppContentWrapper>
  );
};

interface OrderPageInterface extends PagePropsInterface, OrderPageConsumerInterface {}

const OrderPage: NextPage<OrderPageInterface> = ({ pageUrls, order, currentCompany }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <OrderPageConsumer order={order} />
    </ConsoleLayout>
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
    totalPrice: initialOrder.products?.reduce((acc: number, { totalPrice, status }) => {
      const productStatus = castOrderStatus({
        initialStatus: status,
        locale: props.sessionLocale,
      });
      if (productStatus && productStatus.isCanceled) {
        return acc;
      }
      return acc + totalPrice;
    }, 0),
    status: castOrderStatus({
      initialStatus: initialOrder.status,
      locale: props.sessionLocale,
    }),
    products: initialOrder.products?.map((product) => {
      return {
        ...product,
        status: castOrderStatus({
          initialStatus: product.status,
          locale: props.sessionLocale,
        }),
      };
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

  console.log(JSON.stringify(order.products, null, 2));

  return {
    props: {
      ...props,
      order: castDbData(order),
    },
  };
};

export default OrderPage;
