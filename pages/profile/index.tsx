import { Disclosure } from '@headlessui/react';
import { castOrderStatus } from 'db/cast/castOrderStatus';
import { summaryPipeline } from 'db/utils/constantPipelines';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import ControlButtonChevron from '../../components/button/ControlButtonChevron';
import { useSiteContext } from '../../components/context/siteContext';
import Currency from '../../components/Currency';
import FormattedDate from '../../components/FormattedDate';
import ProfileLayout from '../../components/layout/ProfileLayout/ProfileLayout';
import SiteLayout, { SiteLayoutProviderInterface } from '../../components/layout/SiteLayout';
import WpLink from '../../components/Link/WpLink';
import ProductShopPrices from '../../components/ProductShopPrices';
import RequestError from '../../components/RequestError';
import WpIcon from '../../components/WpIcon';
import WpImage from '../../components/WpImage';
import WpTitle from '../../components/WpTitle';
import WpTooltip from '../../components/WpTooltip';
import {
  COL_GIFT_CERTIFICATES,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../../db/collectionNames';
import { getPageSessionUser } from '../../db/dao/user/getPageSessionUser';
import { getDbCollections } from '../../db/mongodb';
import { OrderInterface, OrderProductInterface } from '../../db/uiInterfaces';
import { IMAGE_FALLBACK } from '../../lib/config/common';
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
  const { addCartProduct, getShopProductInCartCount } = useSiteContext();
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
    <div className='relative flex py-10 pr-[calc(var(--controlButtonHeightBig)+1rem)]'>
      <div className='relative flex w-20 w-[120px] flex-shrink-0 items-center justify-center px-4 lg:w-28'>
        <div className='relative w-full pb-[100%]'>
          <WpImage
            url={productImageSrc}
            alt={`${originalName}`}
            title={`${originalName}`}
            width={240}
            className='absolute inset-0 h-full w-full object-contain'
          />
        </div>

        <WpLink
          target={'_blank'}
          className='text-indent-full absolute inset-0 z-10 block'
          href={`/${slug}`}
        >
          {summary?.snippetTitle}
        </WpLink>
      </div>

      <div className='flex-grow'>
        <div className='mb-3 text-sm text-secondary-text'>{`Артикул: ${itemId}`}</div>

        <div className='grid gap-4 lg:flex lg:items-baseline lg:justify-between'>
          <div className='flex-grow text-lg font-bold'>
            <WpLink
              target={'_blank'}
              className='block text-primary-text hover:text-primary-text hover:no-underline'
              href={`/${slug}`}
            >
              {summary?.snippetTitle}
            </WpLink>
          </div>

          <div>
            <div className='ml-auto flex flex-grow-0 items-baseline'>
              <ProductShopPrices className='text-lg font-bold' price={price} size={'small'} />
              <WpIcon name={'cross'} className='mx-4 h-2 w-2' />
              <div className='font-medium'>{amount}</div>
            </div>
            <div className='flex gap-2 text-secondary-text lg:justify-end'>
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
                addCartProduct({
                  amount: addToCartAmount,
                  productId: `${productId}`,
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
        <div className='mb-4 rounded-lg bg-secondary' data-cy={`profile-order-${itemId}`}>
          {/*Order head*/}
          <div className='relative flex items-start pr-[var(--controlButtonHeightBig)]'>
            <Disclosure.Button
              className='flex min-h-[4rem] w-20 items-center justify-center lg:w-28'
              as={'div'}
            >
              <ControlButtonChevron isActive={open} testId={`profile-order-${itemId}-open`} />
            </Disclosure.Button>

            <div className='grid flex-grow items-baseline gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4'>
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
              <div className='mb-6 pl-20 pr-6 lg:pl-28'>
                {firstProduct.shop ? (
                  <div className=''>
                    <div className='mb-2 text-secondary-text'>
                      магазин:{' '}
                      <span className='font-medium text-primary-text'>
                        {firstProduct.shop.name}
                      </span>
                    </div>
                    <div className='text-sm'>{firstProduct.shop.address.readableAddress}</div>
                  </div>
                ) : (
                  <div className='font-medium text-theme'>Магазин не найден</div>
                )}
              </div>

              {/*discount info*/}
              {giftCertificate ? (
                <div className='mt-4 pl-20 pr-6 lg:pl-28'>
                  <div className='mb-1 text-secondary-text'>Применён подарочный сертификат</div>
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
        <React.Fragment>
          <WpTitle size={'small'}>История заказов</WpTitle>
          <RequestError message={'Вы ещё не сделали ни одного заказа'} />
        </React.Fragment>
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
  const collections = await getDbCollections();
  const ordersCollection = collections.ordersCollection();
  const { props } = await getSiteInitialData({
    context,
  });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });

  if (!sessionUser) {
    const links = getProjectLinks();
    return {
      redirect: {
        permanent: false,
        destination: links.signIn.url,
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
