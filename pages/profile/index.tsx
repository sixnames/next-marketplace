import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import ControlButton from 'components/Buttons/ControlButton';
import ControlButtonChevron from 'components/Buttons/ControlButtonChevron';
import Currency from 'components/Currency/Currency';
import FormattedDate from 'components/FormattedDateTime/FormattedDate';
import Icon from 'components/Icon/Icon';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import RequestError from 'components/RequestError';
import Tooltip from 'components/TTip/Tooltip';
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
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { itemId, createdAt, totalPrice, status, products } = order;
  const { repeatAnOrder } = useSiteContext();

  return (
    <Disclosure onChange={() => setIsOpen((prevState) => !prevState)}>
      <div className={classes.order} data-cy={`profile-order-${itemId}`}>
        <div className={`${classes.orderMainGrid} ${classes.orderHead}`}>
          <DisclosureButton as={'div'} className={`${classes.orderTrigger}`}>
            <ControlButtonChevron
              isActive={isOpen}
              testId={`profile-order-${itemId}-open`}
              className={classes.productsTrigger}
            />
          </DisclosureButton>
          <div className={classes.orderHeadMainGrid}>
            <div>
              <div className={classes.orderHeadGrid}>
                <div className={classes.orderNumber}>{`№ ${itemId}`}</div>
                <div className={classes.orderCreatedAt}>
                  от <FormattedDate value={createdAt} />
                </div>
              </div>
            </div>
            <div>
              <div className={classes.orderHeadGrid}>
                <div>
                  <Currency className={classes.orderTotalPrice} value={totalPrice} />
                </div>
                <div className={classes.orderStatus} style={status ? { color: status.color } : {}}>
                  {status?.name}
                </div>
              </div>
            </div>
          </div>
          <div>
            <Tooltip title={'Повторить заказ'}>
              <div>
                <ControlButton
                  roundedTopRight
                  onClick={() => repeatAnOrder(`${order._id}`)}
                  className={classes.orderCartBtn}
                  iconSize={'big'}
                  icon={'cart'}
                  testId={`profile-order-${itemId}-repeat`}
                />
              </div>
            </Tooltip>
          </div>
        </div>

        <DisclosurePanel data-cy={`profile-order-${itemId}-content`}>
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
        </DisclosurePanel>
      </div>
    </Disclosure>
  );
};

interface ProfileOrdersRouteInterface {
  orders: OrderInterface[];
}

const ProfileOrdersRoute: React.FC<ProfileOrdersRouteInterface> = ({ orders }) => {
  return (
    <div className={classes.frame} data-cy={'profile-orders'}>
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
