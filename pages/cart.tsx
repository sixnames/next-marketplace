import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Button from 'components/Buttons/Button';
import ButtonCross from 'components/Buttons/ButtonCross';
import ControlButton from 'components/Buttons/ControlButton';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Inner from 'components/Inner/Inner';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import ProductSnippetPrice from 'components/Product/ProductSnippetPrice/ProductSnippetPrice';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Title from 'components/Title/Title';
import { ROUTE_PROFILE } from 'config/common';
import { useNotificationsContext } from 'context/notificationsContext';
import { useSiteContext } from 'context/siteContext';
import { CartProductInterface, ShopProductInterface } from 'db/uiInterfaces';
import LayoutCard from 'layout/LayoutCard';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { noNaN } from 'lib/numbers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CartAside from 'routes/CartRoute/CartAside';
import { getSiteInitialData } from 'lib/ssrUtils';
import classes from 'styles/CartRoute.module.css';
import CartShopsList from 'routes/CartRoute/CartShopsList';

interface CartProductFrameInterface {
  cartProductId: string;
  isShopsVisible?: boolean;
  mainImage: string;
  originalName: string;
  shopProducts?: ShopProductInterface[];
  testId: number | string;
}

const CartProductFrame: React.FC<CartProductFrameInterface> = ({
  cartProductId,
  children,
  isShopsVisible,
  mainImage,
  originalName,
  shopProducts,
  testId,
}) => {
  const { deleteProductFromCart } = useSiteContext();

  return (
    <div className={classes.productHolder}>
      <LayoutCard className={classes.product} testId={'cart-product'}>
        <div className={classes.productMainGrid}>
          <div>
            <div className={classes.productImage}>
              <div className={classes.productImageHolder}>
                <Image
                  src={`${mainImage}`}
                  alt={originalName}
                  title={originalName}
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            </div>
          </div>
          <div className={classes.productContent}>
            {children}
            <ButtonCross
              testId={`cart-product-${testId}-remove-from-cart`}
              iconSize={'small'}
              className={classes.productRemove}
              onClick={() => {
                deleteProductFromCart({
                  cartProductId,
                });
              }}
            />
            <div className={classes.productButns}>
              <ControlButton iconSize={'mid'} icon={'compare'} />
              <ControlButton iconSize={'mid'} icon={'heart'} />
            </div>
          </div>
        </div>
      </LayoutCard>

      {isShopsVisible ? (
        <CartShopsList shopProducts={shopProducts || []} cartProductId={cartProductId} />
      ) : null}
    </div>
  );
};

interface CartProductMainDataInterface {
  itemId: string;
  originalName: string;
}

const CartProductMainData: React.FC<CartProductMainDataInterface> = ({ itemId, originalName }) => {
  return (
    <React.Fragment>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
      </div>
      <div className={classes.productName}>{originalName}</div>
    </React.Fragment>
  );
};

interface CartProductPropsInterface {
  cartProduct: CartProductInterface;
  testId: number | string;
}

const CartShoplessProduct: React.FC<CartProductPropsInterface> = ({ cartProduct, testId }) => {
  const [isShopsVisible, setIsShopsVisible] = React.useState<boolean>(false);
  const { updateProductInCart } = useSiteContext();
  const { product, _id, amount } = cartProduct;
  if (!product) {
    return null;
  }

  const { itemId, originalName, shopProducts, cardPrices, shopsCount, mainImage } = product;

  return (
    <CartProductFrame
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={mainImage}
      originalName={originalName}
      shopProducts={shopProducts}
      isShopsVisible={isShopsVisible}
    >
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData itemId={itemId} originalName={originalName} />
        </div>

        <div className={classes.productGridRight}>
          <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
        </div>
      </div>

      <div className='flex gap-6'>
        <SpinnerInput
          name={'amount'}
          value={amount}
          min={1}
          testId={`cart-product-${testId}-amount`}
          plusTestId={`cart-product-${testId}-plus`}
          minusTestId={`cart-product-${testId}-minus`}
          frameClassName='w-[var(--buttonMinWidth)]'
          onChange={(e) => {
            updateProductInCart({
              amount: noNaN(e.target.value),
              cartProductId: _id,
            });
          }}
        />
        <Button
          onClick={() => {
            setIsShopsVisible(true);
          }}
          testId={`cart-product-${testId}-show-shops`}
        >
          Выбрать винотеку
        </Button>
      </div>
    </CartProductFrame>
  );
};

const CartProduct: React.FC<CartProductPropsInterface> = ({ cartProduct, testId }) => {
  const { updateProductInCart } = useSiteContext();
  const { shopProduct, amount, _id } = cartProduct;
  if (!shopProduct) {
    return null;
  }

  const {
    formattedPrice,
    formattedOldPrice,
    discountedPercent,
    available,
    shop,
    itemId,
    originalName,
    mainImage,
  } = shopProduct;
  return (
    <CartProductFrame
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={mainImage}
      originalName={originalName}
    >
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData itemId={itemId} originalName={originalName} />
          <SpinnerInput
            name={'amount'}
            value={amount}
            min={1}
            max={available}
            testId={`cart-product-${testId}-amount`}
            plusTestId={`cart-product-${testId}-plus`}
            minusTestId={`cart-product-${testId}-minus`}
            frameClassName='w-[var(--buttonMinWidth)]'
            onChange={(e) => {
              updateProductInCart({
                amount: noNaN(e.target.value),
                cartProductId: _id,
              });
            }}
          />
        </div>

        <div className={classes.productGridRight}>
          <ProductShopPrices
            formattedPrice={`${formattedPrice}`}
            formattedOldPrice={formattedOldPrice}
            discountedPercent={discountedPercent}
          />
          <div className={classes.productConnections}>
            <div className={classes.connectionsGroup}>{`В наличии ${available} шт`}</div>
          </div>

          <div className={classes.shop}>
            <div>
              <span>винотека: </span>
              {shop?.name}
            </div>
            <div>{shop?.address.formattedAddress}</div>
            <div className={classes.shopMap}>Смотреть на карте</div>
          </div>
        </div>
      </div>
    </CartProductFrame>
  );
};

const CartRoute: React.FC = () => {
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  const { cart, loadingCart } = useSiteContext();

  if (loadingCart && !cart) {
    return (
      <div className={classes.cart}>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Spinner isNested isTransparent />
        </Inner>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className={classes.cart}>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <RequestError />
        </Inner>
      </div>
    );
  }

  const { productsCount, cartProducts } = cart;

  if (cartProducts.length < 1) {
    return (
      <div className={classes.cart}>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Title className={classes.cartTitle}>Корзина пуста</Title>
          <div className='flex gap-4 flex-wrap'>
            <Button
              theme={'secondary'}
              onClick={() => {
                router.push(`/`).catch(() => {
                  showErrorNotification();
                });
              }}
            >
              Продолжить покупки
            </Button>
            <Button
              onClick={() => {
                router.push(ROUTE_PROFILE).catch(() => {
                  showErrorNotification();
                });
              }}
              theme={'secondary'}
            >
              Мои заказы
            </Button>
          </div>
        </Inner>
      </div>
    );
  }

  return (
    <div className={classes.cart}>
      <Breadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        <Title className={classes.cartTitle}>
          Корзина
          <span>{`(${productsCount})`}</span>
        </Title>
        <div className={classes.frame}>
          <div data-cy={'cart-products'}>
            {cartProducts.map((cartProduct, index) => {
              const { _id, shopProduct } = cartProduct;

              if (!shopProduct) {
                return (
                  <CartShoplessProduct testId={index} cartProduct={cartProduct} key={`${_id}`} />
                );
              }

              return <CartProduct testId={index} cartProduct={cartProduct} key={`${_id}`} />;
            })}
          </div>

          <div className={classes.aside}>
            <CartAside
              cart={cart}
              buttonText={'Купить'}
              onConfirmHandler={() => {
                router.push(`/make-an-order`).catch(() => {
                  showErrorNotification();
                });
              }}
            />
          </div>
        </div>
      </Inner>
    </div>
  );
};

type CartPageInterface = SiteLayoutProviderInterface;

const CartPage: NextPage<CartPageInterface> = (props) => {
  return (
    <SiteLayoutProvider title={'Корзина'} {...props}>
      <CartRoute />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CartPageInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default CartPage;
