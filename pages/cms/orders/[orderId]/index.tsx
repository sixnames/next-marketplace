import Currency from 'components/Currency';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import ProductShopPrices from 'components/Product/ProductShopPrices';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import {
  COL_ORDER_CUSTOMERS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OrderInterface, OrderProductInterface } from 'db/uiInterfaces';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface OrderProductProductInterface {
  orderProduct: OrderProductInterface;
}

const OrderProduct: React.FC<OrderProductProductInterface> = ({ orderProduct }) => {
  const { originalName, shopProduct, itemId, price, amount, totalPrice } = orderProduct;

  const productImageSrc = shopProduct
    ? shopProduct.mainImage
    : `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`;
  const imageWidth = 35;
  const imageHeight = 120;

  return (
    <div className='flex mb-4 py-8 bg-secondary rounded-lg pr-6'>
      <div className='flex items-center justify-center px-4 w-20 lg:w-28'>
        <Image
          src={productImageSrc}
          alt={`${originalName}`}
          title={`${originalName}`}
          width={imageWidth}
          height={imageHeight}
        />
      </div>

      <div className='flex-grow'>
        <div className='text-secondary-text mb-3 text-sm'>{`Артикул: ${itemId}`}</div>

        <div className='grid gap-4 lg:flex lg:items-baseline lg:justify-between'>
          <div className='text-lg font-bold flex-grow'>{originalName}</div>

          <div>
            <div className='flex items-baseline ml-auto flex-grow-0'>
              <ProductShopPrices className='text-lg font-bold' price={price} size={'small'} />
              <Icon name={'cross'} className='w-2 h-2 mx-4' />
              <div className='font-medium'>{amount}</div>
            </div>
            <div className='flex gap-2 lg:justify-end text-secondary-text'>
              <span>Итого:</span>
              <Currency value={totalPrice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrderPageConsumerInterface {
  order: OrderInterface;
}

const OrderPageConsumer: React.FC<OrderPageConsumerInterface> = ({ order }) => {
  const { itemId, createdAt, totalPrice, status, products, shop, customer } = order;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Заказ №${itemId}`,
    config: [
      {
        name: 'Список заказов',
        href: `${ROUTE_CMS}/orders`,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Inner testId={`order-details`}>
        <div className='grid gap-4 md:flex justify-between items-baseline mb-12'>
          <div>
            <Title low>Заказ №{itemId}</Title>
            <div className='text-secondary-text'>
              от <FormattedDate value={createdAt} />
            </div>
          </div>
        </div>

        <div className='md:grid grid-cols-9 gap-8'>
          <div className='col-span-6'>
            {products?.map((orderProduct) => {
              return <OrderProduct orderProduct={orderProduct} key={`${orderProduct._id}`} />;
            })}
          </div>

          <div className='relative col-span-3'>
            <div className='sticky bg-secondary rounded-lg py-8 px-6'>
              {/*status*/}
              <div className='flex items-baseline justify-between mb-6'>
                <div className='text-secondary-text'>Статус</div>
                {status ? (
                  <div className='font-medium' style={status ? { color: status.color } : {}}>
                    {status.name}
                  </div>
                ) : (
                  <div className='text-wp-error font-medium'>Статус не найден</div>
                )}
              </div>

              {/*customer*/}
              <div className='mb-6'>
                <div className='text-secondary-text mb-3'>Заказчик:</div>
                {customer ? (
                  <div className='space-y-2'>
                    <div className='font-medium'>{customer?.fullName}</div>
                    <div className='font-medium text-secondary-text'>
                      <LinkEmail value={customer.email} />
                    </div>
                    <div className='font-medium text-secondary-text'>
                      <LinkPhone value={customer.formattedPhone} />
                    </div>
                  </div>
                ) : (
                  <div className='text-wp-error font-medium'>Заказчик не найден</div>
                )}
              </div>

              {/*shop info*/}
              <div className='mb-6'>
                <div className='text-secondary-text mb-3'>Магазин:</div>

                {shop ? (
                  <div className='space-y-2'>
                    <span className='text-primary-text font-medium'>{shop.name}</span>
                    <div className='text-secondary-text'>{shop.address.formattedAddress}</div>
                  </div>
                ) : (
                  <div className='text-wp-error font-medium'>Магазин не найден</div>
                )}
              </div>

              <div className='flex flex-wrap gap-2 items-baseline'>
                <div className='text-secondary-text'>Итого:</div>
                <Currency className='text-2xl' valueClassName='font-medium' value={totalPrice} />
              </div>
            </div>
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
    status: initialOrder.status
      ? {
          ...initialOrder.status,
          name: getFieldStringLocale(initialOrder.status.nameI18n, props.sessionLocale),
        }
      : null,
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
