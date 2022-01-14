import { Disclosure } from '@headlessui/react';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ControlButton from '../../components/button/ControlButton';
import ControlButtonChevron from '../../components/button/ControlButtonChevron';
import Currency from '../../components/Currency';
import FormattedDate from '../../components/FormattedDate';
import WpLink from '../../components/Link/WpLink';
import ProductShopPrices from '../../components/ProductShopPrices';
import RequestError from '../../components/RequestError';
import WpIcon from '../../components/WpIcon';
import WpImage from '../../components/WpImage';
import WpTitle from '../../components/WpTitle';
import WpTooltip from '../../components/WpTooltip';
import { IMAGE_FALLBACK, ROUTE_SIGN_IN } from '../../config/common';
import { useSiteContext } from '../../context/siteContext';
import {
  COL_GIFT_CERTIFICATES,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../../db/collectionNames';
import { summaryPipeline } from '../../db/dao/constantPipelines';
import { castOrderStatus } from '../../db/dao/orders/getConsoleOrder';
import { getPageSessionUser } from '../../db/dao/user/getPageSessionUser';
import { OrderModel } from '../../db/dbModels';
import { getDatabase } from '../../db/mongodb';
import { OrderInterface, OrderProductInterface } from '../../db/uiInterfaces';
import ProfileLayout from '../../layout/ProfileLayout/ProfileLayout';
import SiteLayout, { SiteLayoutProviderInterface } from '../../layout/SiteLayout';
import { getFieldStringLocale } from '../../lib/i18n';
import { noNaN } from '../../lib/numbers';
import { castDbData, getSiteInitialData } from '../../lib/ssrUtils';

interface ProfileOrderProductInterface {
  orderIndex: number;
  orderProduct: OrderProductInterface;
  testId: string | number;
}

const ProfileOrderProduct: React.FC<ProfileOrderProductInterface> = ({
  orderProduct,
  orderIndex,
  testId,
}) => {
  const { urlPrefix } = useSiteContext();
  const { addProductToCart, getShopProductInCartCount } = useSiteContext();
  const { originalName, summary, shopProduct, itemId, price, amount, totalPrice, productId } =
    orderProduct;
  const slug = `${summary?.slug}`;

  const addToCartAmount = 1;
  const inCartCount = getShopProductInCartCount(
    `${orderProduct.shopProductId}`,
    Boolean(summary?.allowDelivery),
  );
  const productNotExist = !shopProduct;
  const isCartButtonDisabled =
    productNotExist || addToCartAmount + inCartCount > noNaN(shopProduct?.available);

  const productImageSrc = shopProduct ? `${summary?.mainImage}` : IMAGE_FALLBACK;

  return (
    <div className='relative py-10 flex pr-[calc(var(--controlButtonHeightBig)+1rem)]'>
      <div className='relative flex items-center justify-center px-4 w-20 lg:w-28 flex-shrink-0 w-[120px]'>
        <div className='relative pb-[100%] w-full'>
          <WpImage
            url={productImageSrc}
            alt={`${originalName}`}
            title={`${originalName}`}
            width={240}
            className='absolute inset-0 w-full h-full object-contain'
          />
        </div>

        <WpLink
          target={'_blank'}
          className='block absolute z-10 inset-0 text-indent-full'
          href={`${urlPrefix}/${slug}`}
        >
          {summary?.snippetTitle}
        </WpLink>
      </div>

      <div className='flex-grow'>
        <div className='text-secondary-text mb-3 text-sm'>{`Артикул: ${itemId}`}</div>

        <div className='grid gap-4 lg:flex lg:items-baseline lg:justify-between'>
          <div className='text-lg font-bold flex-grow'>
            <WpLink
              target={'_blank'}
              className='block text-primary-text hover:no-underline hover:text-primary-text'
              href={`${urlPrefix}/${slug}`}
            >
              {summary?.snippetTitle}
            </WpLink>
          </div>

          <div>
            <div className='flex items-baseline ml-auto flex-grow-0'>
              <ProductShopPrices className='text-lg font-bold' price={price} size={'small'} />
              <WpIcon name={'cross'} className='w-2 h-2 mx-4' />
              <div className='font-medium'>{amount}</div>
            </div>
            <div className='flex gap-2 lg:justify-end text-secondary-text'>
              <span>Итого:</span>
              <Currency value={totalPrice} />
            </div>
          </div>
        </div>
      </div>

      <div className='absolute top-0 right-0'>
        <WpTooltip title={'Добавить в корзину'}>
          <div>
            <ControlButton
              disabled={isCartButtonDisabled}
              size={'big'}
              onClick={() => {
                addProductToCart({
                  amount: addToCartAmount,
                  productId,
                  shopProductId: `${shopProduct?._id}`,
                });
              }}
              testId={`profile-order-${orderIndex}-product-${testId}-add-to-cart`}
              icon={'cart'}
            />
          </div>
        </WpTooltip>
      </div>
    </div>
  );
};

interface ProfileOrderInterface {
  order: OrderInterface;
  orderIndex: number;
}

const ProfileOrder: React.FC<ProfileOrderInterface> = ({ order, orderIndex }) => {
  const {
    itemId,
    createdAt,
    discountedPrice,
    status,
    products,
    orderId,
    giftCertificate,
    giftCertificateChargedValue,
  } = order;
  const { repeatAnOrder } = useSiteContext();
  const firstProduct = (products || [])[0];

  return (
    <Disclosure>
      {({ open }) => (
        <div className='mb-4 bg-secondary rounded-lg' data-cy={`profile-order-${itemId}`}>
          {/*Order head*/}
          <div className='relative flex pr-[var(--controlButtonHeightBig)] items-start'>
            <Disclosure.Button
              className='flex items-center justify-center min-h-[4rem] w-20 lg:w-28'
              as={'div'}
            >
              <ControlButtonChevron isActive={open} testId={`profile-order-${itemId}-open`} />
            </Disclosure.Button>

            <div className='grid gap-4 flex-grow items-baseline sm:grid-cols-2 lg:grid-cols-4 py-4'>
              <div className='text-lg font-medium sm:pt-0'>{`№ ${orderId}`}</div>
              <div className='text-sm'>
                от <FormattedDate value={createdAt} />
              </div>
              <div>
                <Currency className='text-2xl' value={discountedPrice} />
              </div>
              <div className='font-medium' style={status ? { color: status.color } : {}}>
                {status?.name}
              </div>
            </div>

            <div className='absolute top-0 right-0'>
              <WpTooltip title={'Повторить заказ'}>
                <div>
                  <ControlButton
                    roundedTopRight
                    onClick={() => repeatAnOrder(`${order._id}`)}
                    iconSize={'big'}
                    size={'big'}
                    icon={'cart'}
                    theme={'accent'}
                    testId={`profile-order-${itemId}-repeat`}
                  />
                </div>
              </WpTooltip>
            </div>
          </div>

          {/*Order body*/}
          <Disclosure.Panel>
            <div data-cy={`profile-order-${itemId}-content`}>
              {/*shop info*/}
              <div className='mb-6 pl-20 lg:pl-28 pr-6'>
                {firstProduct.shop ? (
                  <div className=''>
                    <div className='text-secondary-text mb-2'>
                      магазин:{' '}
                      <span className='text-primary-text font-medium'>
                        {firstProduct.shop.name}
                      </span>
                    </div>
                    <div className='text-sm'>{firstProduct.shop.address.readableAddress}</div>
                  </div>
                ) : (
                  <div className='text-theme font-medium'>Магазин не найден</div>
                )}
              </div>

              {/*discount info*/}
              {giftCertificate ? (
                <div className='mt-4 pl-20 lg:pl-28 pr-6'>
                  <div className='text-secondary-text mb-1'>Применён подарочный сертификат</div>
                  <div>
                    {giftCertificate.name ? `${giftCertificate.name}: ` : 'С кодом: '}
                    {giftCertificate.code}
                    {' на сумму '}
                    <Currency value={giftCertificateChargedValue} />
                  </div>
                </div>
              ) : null}

              {(products || []).map((orderProduct, index) => {
                return (
                  <ProfileOrderProduct
                    testId={index}
                    orderIndex={orderIndex}
                    orderProduct={orderProduct}
                    key={`${orderProduct._id}`}
                  />
                );
              })}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

interface ProfileOrdersRouteInterface {
  orders: OrderInterface[];
}

const ProfileOrdersRoute: React.FC<ProfileOrdersRouteInterface> = ({ orders }) => {
  return (
    <div className='mb-8' data-cy={'profile-orders'}>
      {orders.length < 1 ? (
        <div>
          <WpTitle size={'small'}>История заказов</WpTitle>
          <RequestError message={'Вы ещё не сделали ни одного заказа'} />
        </div>
      ) : (
        <React.Fragment>
          <WpTitle size={'small'}>История заказов</WpTitle>
          {orders.map((order, orderIndex) => {
            return <ProfileOrder key={`${order._id}`} orderIndex={orderIndex} order={order} />;
          })}
        </React.Fragment>
      )}
    </div>
  );
};

interface ProfileInterface extends SiteLayoutProviderInterface, ProfileOrdersRouteInterface {}

const Profile: NextPage<ProfileInterface> = ({ orders, ...props }) => {
  return (
    <SiteLayout title={'История заказов'} {...props}>
      <ProfileLayout>
        <ProfileOrdersRoute orders={orders} />
      </ProfileLayout>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileInterface>> {
  const { db } = await getDatabase();
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  const { props } = await getSiteInitialData({
    context,
  });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });

  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: `${props.urlPrefix}${ROUTE_SIGN_IN}`,
      },
    };
  }

  const orderAggregation = await ordersCollection
    .aggregate<OrderInterface>([
      {
        $match: { customerId: new ObjectId(sessionUser.me._id) },
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
          from: COL_GIFT_CERTIFICATES,
          as: 'giftCertificate',
          localField: 'giftCertificateId',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          giftCertificate: {
            $arrayElemAt: ['$giftCertificate', 0],
          },
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
            ...summaryPipeline('$productId'),
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

  const locale = props.sessionLocale;
  const orders = orderAggregation.map((order) => {
    return {
      ...order,
      products: order.products?.reduce((acc: OrderProductInterface[], orderProduct) => {
        const productStatus = castOrderStatus({
          initialStatus: orderProduct.status,
          locale,
        });
        if (!productStatus || productStatus.isCanceled) {
          return acc;
        }

        // title
        return [
          ...acc,
          {
            ...orderProduct,
            status: productStatus,
            summary: orderProduct.summary
              ? {
                  ...orderProduct.summary,
                  snippetTitle: getFieldStringLocale(orderProduct.summary.snippetTitleI18n, locale),
                }
              : null,
          },
        ];
      }, []),
      status: castOrderStatus({
        initialStatus: order.status,
        locale,
      }),
      giftCertificate: order.giftCertificate
        ? {
            ...order.giftCertificate,
            name: getFieldStringLocale(order.giftCertificate.nameI18n, locale),
            description: getFieldStringLocale(order.giftCertificate.descriptionI18n, locale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      orders: castDbData(orders),
      showForIndex: false,
    },
  };
}

export default Profile;
