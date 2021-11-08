import Button from 'components/button/Button';
import CmsOrderDetails from 'components/order/CmsOrderDetails';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { ROUTE_CONSOLE } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import {
  COL_ORDER_CUSTOMERS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import { OrderInterface } from 'db/uiInterfaces';
import { useCancelOrder, useConfirmOrder } from 'hooks/mutations/useOrderMutations';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castOrderStatus } from 'lib/orderUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { generateSnippetTitle } from 'lib/titleUtils';
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
  const { showModal } = useAppContext();

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
        <Inner>
          <FixedButtons>
            {order.status?.isNew ? (
              <Button
                onClick={() => {
                  confirmOrderMutation({
                    orderId: `${order._id}`,
                  }).catch(console.log);
                }}
              >
                Подтвердить заказ
              </Button>
            ) : null}

            {!order.status?.isCanceled && !order.status?.isDone ? (
              <Button
                theme={'secondary'}
                onClick={() => {
                  showModal<ConfirmModalInterface>({
                    variant: CONFIRM_MODAL,
                    props: {
                      testId: 'cancel-order-modal',
                      message: `Вы уверены, что хотите отменить заказ № ${order.orderId} ?`,
                      confirm: () => {
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
            ) : null}
          </FixedButtons>
        </Inner>
      </div>
    </AppContentWrapper>
  );
};

interface OrderPageInterface extends PagePropsInterface, OrderPageConsumerInterface {}

const OrderPage: NextPage<OrderPageInterface> = ({ pageUrls, order, pageCompany }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={pageCompany}>
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
    .aggregate<OrderInterface>([
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
                  ...shopProductFieldsPipeline('$productId'),
                ],
              },
            },
            ...shopProductFieldsPipeline('$productId'),
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

  const locale = props.sessionLocale;

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
    products: initialOrder.products?.map((orderProduct) => {
      // title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: orderProduct.product?.brand,
        rubricName: getFieldStringLocale(orderProduct.product?.rubric?.nameI18n, locale),
        showRubricNameInProductTitle: orderProduct.product?.rubric?.showRubricNameInProductTitle,
        showCategoryInProductTitle: orderProduct.product?.rubric?.showCategoryInProductTitle,
        attributes: orderProduct.product?.attributes || [],
        categories: orderProduct.product?.categories,
        titleCategoriesSlugs: orderProduct.product?.titleCategoriesSlugs,
        originalName: `${orderProduct.product?.originalName}`,
        defaultGender: `${orderProduct.product?.gender}`,
      });

      return {
        ...orderProduct,
        status: castOrderStatus({
          initialStatus: orderProduct.status,
          locale: props.sessionLocale,
        }),
        product: orderProduct.product
          ? {
              ...orderProduct.product,
              snippetTitle,
            }
          : null,
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

  return {
    props: {
      ...props,
      order: castDbData(order),
    },
  };
};

export default OrderPage;
