import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import ButtonCross from 'components/ButtonCross';
import ControlButton from 'components/ControlButton';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { MapModalInterface } from 'components/Modal/MapModal';
import ProductShopPrices from 'components/ProductShopPrices';
import { MAP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import { ROUTE_CATALOGUE, ROUTE_PROFILE } from 'config/common';
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
  snippetTitle?: string | null;
  shopProducts?: ShopProductInterface[] | null;
  testId: number | string;
  rubricSlug: string;
  slug: string;
}

const CartProductFrame: React.FC<CartProductFrameInterface> = ({
  cartProductId,
  children,
  isShopsVisible,
  mainImage,
  snippetTitle,
  shopProducts,
  testId,
  rubricSlug,
  slug,
}) => {
  const { deleteProductFromCart } = useSiteContext();

  return (
    <div className={classes.productHolder}>
      <LayoutCard className={classes.product} testId={'cart-product'}>
        <div className={classes.productMainGrid}>
          <div className='relative'>
            <div className={classes.productImage}>
              <Image
                src={`${mainImage}`}
                alt={`${snippetTitle}`}
                title={`${snippetTitle}`}
                layout='fill'
                objectFit='contain'
              />
              <Link
                target={'_blank'}
                className='block absolute z-10 inset-0 text-indent-full'
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
              >
                {snippetTitle}
              </Link>
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
  snippetTitle?: string | null;
  rubricSlug: string;
  slug: string;
}

const CartProductMainData: React.FC<CartProductMainDataInterface> = ({
  itemId,
  snippetTitle,
  rubricSlug,
  slug,
}) => {
  return (
    <React.Fragment>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
      </div>
      <div className={classes.productName}>
        <Link
          target={'_blank'}
          className='block text-primary-text hover:no-underline hover:text-primary-text'
          href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
        >
          {snippetTitle}
        </Link>
      </div>
    </React.Fragment>
  );
};

interface CartProductPropsInterface {
  cartProduct: CartProductInterface;
  testId: number | string;
}

const CartShoplessProduct: React.FC<CartProductPropsInterface> = ({ cartProduct, testId }) => {
  const [isShopsVisible, setIsShopsVisible] = React.useState<boolean>(false);
  const { product, _id } = cartProduct;
  if (!product) {
    return null;
  }

  const {
    itemId,
    snippetTitle,
    shopProducts,
    cardPrices,
    shopsCount,
    mainImage,
    rubricSlug,
    slug,
  } = product;

  return (
    <CartProductFrame
      rubricSlug={rubricSlug}
      slug={slug}
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={mainImage}
      snippetTitle={snippetTitle}
      shopProducts={shopProducts}
      isShopsVisible={isShopsVisible}
    >
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData
            rubricSlug={rubricSlug}
            slug={slug}
            itemId={itemId}
            snippetTitle={snippetTitle}
          />
        </div>

        <div className={classes.productGridRight}>
          <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
        </div>
      </div>

      <Button
        onClick={() => {
          setIsShopsVisible(true);
        }}
        testId={`cart-product-${testId}-show-shops`}
      >
        Выбрать магазин
      </Button>
    </CartProductFrame>
  );
};

const CartProduct: React.FC<CartProductPropsInterface> = ({ cartProduct, testId }) => {
  const { showModal } = useAppContext();
  const { isDark } = useThemeContext();
  const { updateProductInCart } = useSiteContext();
  const { shopProduct, amount, _id } = cartProduct;
  const minAmount = 1;

  if (!shopProduct) {
    return null;
  }

  const {
    price,
    oldPrice,
    discountedPercent,
    available,
    shop,
    itemId,
    snippetTitle,
    mainImage,
    rubricSlug,
    slug,
  } = shopProduct;

  if (!shop) {
    return null;
  }

  const lightThemeMarker = shop.mapMarker?.lightTheme;
  const darkThemeMarker = shop.mapMarker?.darkTheme;
  const marker = (isDark ? darkThemeMarker : lightThemeMarker) || '/marker.svg';

  return (
    <CartProductFrame
      rubricSlug={rubricSlug}
      slug={slug}
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={mainImage}
      snippetTitle={snippetTitle}
    >
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData
            rubricSlug={rubricSlug}
            slug={slug}
            itemId={itemId}
            snippetTitle={snippetTitle}
          />
          <SpinnerInput
            name={'amount'}
            value={amount}
            min={minAmount}
            max={noNaN(available)}
            testId={`cart-product-${testId}-amount`}
            plusTestId={`cart-product-${testId}-plus`}
            minusTestId={`cart-product-${testId}-minus`}
            frameClassName='w-[var(--buttonMinWidth)]'
            onChange={(e) => {
              const amount = noNaN(e.target.value);
              if (amount >= minAmount && amount <= noNaN(available)) {
                updateProductInCart({
                  amount,
                  cartProductId: _id,
                });
              }
            }}
          />
        </div>

        <div className={classes.productGridRight}>
          <ProductShopPrices
            price={price}
            oldPrice={oldPrice}
            discountedPercent={discountedPercent}
          />
          <div className={classes.productConnections}>
            <div className={classes.connectionsGroup}>{`В наличии ${available} шт`}</div>
          </div>

          <div className={classes.shop}>
            <div>
              <span>Магазин: </span>
              {shop.name}
            </div>
            <div>{shop.address.formattedAddress}</div>
            <div
              className={classes.shopMap}
              onClick={() => {
                showModal<MapModalInterface>({
                  variant: MAP_MODAL,
                  props: {
                    title: shop.name,
                    testId: `shop-map-modal`,
                    markers: [
                      {
                        _id: shop._id,
                        icon: marker,
                        name: shop.name,
                        address: shop.address,
                      },
                    ],
                  },
                });
              }}
            >
              Смотреть на карте
            </div>
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
  const { configs } = useConfigContext();

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
        <Title className={classes.cartTitle}>В корзине товаров {productsCount} шт.</Title>
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
              buttonText={configs.buyButtonText}
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
