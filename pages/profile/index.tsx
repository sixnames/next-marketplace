import { Disclosure, Transition } from '@headlessui/react';
import ControlButton from 'components/ControlButton';
import ControlButtonChevron from 'components/ControlButtonChevron';
import Currency from 'components/Currency';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import RequestError from 'components/RequestError';
import Tooltip from 'components/Tooltip';
import { ROUTE_SIGN_IN } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import {
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { OrderModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { OrderInterface, OrderProductInterface } from 'db/uiInterfaces';
import ProfileLayout from 'layout/ProfileLayout/ProfileLayout';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import classes from 'styles/ProfileOrdersRoute.module.css';

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
  const { addProductToCart, getShopProductInCartCount } = useSiteContext();
  const { originalName, shopProduct, itemId, shop, price, amount } = orderProduct;

  const addToCartAmount = 1;
  const inCartCount = getShopProductInCartCount(`${orderProduct.shopProductId}`);
  const productNotExist = !shopProduct;
  const isCartButtonDisabled =
    productNotExist || addToCartAmount + inCartCount > noNaN(shopProduct?.available);

  const productImageSrc = shopProduct
    ? shopProduct.mainImage
    : `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`;
  const imageWidth = 35;
  const imageHeight = 120;

  return (
    <div className={`${classes.orderProduct} ${classes.orderMainGrid}`}>
      <div className={classes.productImage}>
        <Image
          src={productImageSrc}
          alt={`${originalName}`}
          title={`${originalName}`}
          width={imageWidth}
          height={imageHeight}
        />
      </div>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>

        <div className={classes.orderProductGrid}>
          <div className={classes.productName}>{originalName}</div>

          <div className={classes.productTotals}>
            <ProductShopPrices
              className={classes.productTotalsPrice}
              formattedPrice={price}
              size={'small'}
            />
            <Icon name={'cross'} className={classes.productTotalsIcon} />
            <div className={classes.productTotalsAmount}>{amount}</div>
          </div>

          {shop ? (
            <div className={classes.shop}>
              <div>
                <span>винотека: </span>
                {shop.name}
              </div>
              <div>{shop.address.formattedAddress}</div>
            </div>
          ) : (
            <div className={classes.shop}>Магазин не найден</div>
          )}
        </div>
      </div>
      <div className={classes.orderProductBtn}>
        <Tooltip title={'Добавить в корзину'}>
          <div>
            <ControlButton
              disabled={isCartButtonDisabled}
              onClick={() => {
                addProductToCart({
                  amount: addToCartAmount,
                  shopProductId: `${shopProduct?._id}`,
                });
              }}
              testId={`profile-order-${orderIndex}-product-${testId}-add-to-cart`}
              icon={'cart'}
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

interface ProfileOrderInterface {
  order: OrderInterface;
  orderIndex: number;
}

const ProfileOrder: React.FC<ProfileOrderInterface> = ({ order, orderIndex }) => {
  const { itemId, createdAt, totalPrice, status, products } = order;
  const { repeatAnOrder } = useSiteContext();

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <>
          <div className={classes.order} data-cy={`profile-order-${itemId}`}>
            {/*Order head*/}
            <div className='relative flex pr-16 items-start'>
              <Disclosure.Button
                as={'div'}
                className='flex items-center justify-center w-20 min-h-[4rem] lg:w-28'
              >
                <ControlButtonChevron isActive={open} testId={`profile-order-${itemId}-open`} />
              </Disclosure.Button>

              <div className='grid gap-4 flex-grow items-baseline sm:grid-cols-2 sm:pt-4 lg:grid-cols-4'>
                <div className='text-lg font-medium pt-4 sm:pt-0'>{`№ ${itemId}`}</div>
                <div className='text-sm'>
                  от <FormattedDate value={createdAt} />
                </div>
                <div>
                  <Currency className='text-2xl' value={totalPrice} />
                </div>
                <div className='font-medium' style={status ? { color: status.color } : {}}>
                  {status?.name}
                </div>
              </div>

              <div className='absolute top-0 right-0'>
                <Tooltip title={'Повторить заказ'}>
                  <ControlButton
                    roundedTopRight
                    onClick={() => repeatAnOrder(`${order._id}`)}
                    iconSize={'big'}
                    size={'big'}
                    icon={'cart'}
                    theme={'accent'}
                    testId={`profile-order-${itemId}-repeat`}
                  />
                </Tooltip>
              </div>
            </div>

            {/*Order body*/}
            <Transition
              show={open}
              enter='transition duration-100 ease-out'
              enterFrom='transform opacity-0'
              enterTo='transform opacity-100'
              leave='transition duration-75 ease-out'
              leaveFrom='transform opacity-100'
              leaveTo='transform opacity-0'
            >
              <Disclosure.Panel static>
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
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
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
          <RequestError message={'Вы ещё не сделали ни одного заказа'} />
        </div>
      ) : (
        <React.Fragment>
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
    <SiteLayoutProvider title={'История заказов'} {...props}>
      <ProfileLayout>
        <ProfileOrdersRoute orders={orders} />
      </ProfileLayout>
    </SiteLayoutProvider>
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

  if (!props.sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  const orderAggregation = await ordersCollection
    .aggregate<OrderInterface>([
      {
        $match: { customerId: new ObjectId(props.sessionUser._id) },
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
      {
        $addFields: {
          status: {
            $arrayElemAt: ['$status', 0],
          },
        },
      },
    ])
    .toArray();

  const orders = orderAggregation.map((order) => {
    return {
      ...order,
      totalPrice: order.products?.reduce((acc: number, { amount, price }) => {
        return acc + amount * price;
      }, 0),
      status: order.status
        ? {
            ...order.status,
            name: getFieldStringLocale(order.status.nameI18n, props.sessionLocale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      orders: castDbData(orders),
    },
  };
}

export default Profile;
