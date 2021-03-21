import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import ControlButton from 'components/Buttons/ControlButton';
import ControlButtonChevron from 'components/Buttons/ControlButtonChevron';
import Currency from 'components/Currency/Currency';
import FormattedDate from 'components/FormattedDateTime/FormattedDate';
import Icon from 'components/Icon/Icon';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Tooltip from 'components/TTip/Tooltip';
import { ROUTE_SIGN_IN } from 'config/common';
import {
  MyOrderFragment,
  MyOrderProductFragment,
  useGetAllMyOrdersQuery,
} from 'generated/apolloComponents';
import useCartMutations from 'hooks/useCartMutations';
import ProfileLayout from 'layout/ProfileLayout/ProfileLayout';
import { noNaN } from 'lib/numbers';
import { getSession } from 'next-auth/client';
import Image from 'next/image';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import classes from 'routes/ProfileOrdersRoute/ProfileOrdersRoute.module.css';

interface ProfileOrderProductInterface {
  orderProduct: MyOrderProductFragment;
}

const ProfileOrderProduct: React.FC<ProfileOrderProductInterface> = ({ orderProduct }) => {
  const { addProductToCart } = useCartMutations();
  const {
    name,
    shopProduct,
    itemId,
    shop,
    formattedPrice,
    formattedOldPrice,
    discountedPercent,
    amount,
  } = orderProduct;

  const addToCartAmount = 1;
  let inCartCount = 1;
  if (shopProduct) {
    inCartCount = shopProduct.inCartCount;
  }
  const productNotExist = !shopProduct || !shopProduct.product;
  const isCartButtonDisabled =
    productNotExist || addToCartAmount + inCartCount > noNaN(shopProduct?.available);

  const productImageSrc = shopProduct
    ? shopProduct.product.mainImage
    : `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`;
  const imageWidth = 35;
  const imageHeight = 120;

  return (
    <div className={`${classes.orderProduct} ${classes.orderMainGrid}`}>
      <div className={classes.productImage}>
        <Image
          src={productImageSrc}
          alt={name}
          title={name}
          width={imageWidth}
          height={imageHeight}
        />
      </div>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>

        <div className={classes.orderProductGrid}>
          <div className={classes.productName}>{name}</div>

          <div className={classes.productTotals}>
            <ProductShopPrices
              className={classes.productTotalsPrice}
              formattedPrice={formattedPrice}
              formattedOldPrice={formattedOldPrice}
              discountedPercent={discountedPercent}
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
              testId={`profile-order-product-${shopProduct?.product?.slug}-add-to-cart`}
              icon={'cart'}
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

interface ProfileOrderInterface {
  order: MyOrderFragment;
}

const ProfileOrder: React.FC<ProfileOrderInterface> = ({ order }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { itemId, createdAt, formattedTotalPrice, status, products } = order;
  const { repeatAnOrder } = useCartMutations();

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
                  <Currency className={classes.orderTotalPrice} value={formattedTotalPrice} />
                </div>
                <div className={classes.orderStatus} style={{ color: status.color }}>
                  {status.name}
                </div>
              </div>
            </div>
          </div>
          <div>
            <Tooltip title={'Повторить заказ'}>
              <div>
                <ControlButton
                  roundedTopRight
                  onClick={() => repeatAnOrder(order._id)}
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
          {products.map((orderProduct) => {
            return <ProfileOrderProduct orderProduct={orderProduct} key={orderProduct._id} />;
          })}
        </DisclosurePanel>
      </div>
    </Disclosure>
  );
};

const ProfileOrdersRoute: React.FC = () => {
  const { data, loading, error } = useGetAllMyOrdersQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllMyOrders) {
    return <RequestError />;
  }

  const { docs } = data.getAllMyOrders;

  return (
    <div className={classes.frame} data-cy={'profile-orders'}>
      {docs.length < 1 ? (
        <div>
          <RequestError message={'Вы ещё не сделали ни одного заказа'} />
        </div>
      ) : (
        <React.Fragment>
          {docs.map((order) => {
            return <ProfileOrder key={order._id} order={order} />;
          })}
        </React.Fragment>
      )}
    </div>
  );
};

interface ProfileInterface extends PagePropsInterface, SiteLayoutInterface {}

const Profile: NextPage<ProfileInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout title={'История заказов'} navRubrics={navRubrics}>
      <ProfileLayout>
        <ProfileOrdersRoute />
      </ProfileLayout>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  return {
    props,
  };
}

export default Profile;
