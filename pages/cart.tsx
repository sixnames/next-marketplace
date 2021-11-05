import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import ButtonCross from 'components/ButtonCross';
import ControlButton from 'components/ControlButton';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { MapModalInterface } from 'components/Modal/MapModal';
import ProductShopPrices from 'components/ProductShopPrices';
import WpImage from 'components/WpImage';
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
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CartAside from 'components/CartAside';
import { getSiteInitialData } from 'lib/ssrUtils';
import CartShopsList from 'components/CartShopsList';

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
    <div className='grid gap-4'>
      <LayoutCard className='grid px-6 py-8 gap-6 sm:grid-cols-8 relative' testId={'cart-product'}>
        {/*image*/}
        <div className='flex flex-col gap-4 items-center justify-center sm:col-span-2'>
          <div className='relative flex justify-center flex-shrink-0 w-full max-w-[180px]'>
            <div className='relative pb-[100%] w-full'>
              <WpImage
                url={mainImage}
                alt={`${snippetTitle}`}
                title={`${snippetTitle}`}
                width={240}
                className='absolute inset-0 w-full h-full object-contain'
              />
            </div>

            <Link
              target={'_blank'}
              className='block absolute z-10 inset-0 text-indent-full'
              href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
            >
              {snippetTitle}
            </Link>
          </div>
        </div>

        {/*main data*/}
        <div className='sm:col-span-6'>{children}</div>

        {/*remove button*/}
        <ButtonCross
          testId={`cart-product-${testId}-remove-from-cart`}
          iconSize={'small'}
          className='absolute top-0 right-0 z-30'
          onClick={() => {
            deleteProductFromCart({
              cartProductId,
            });
          }}
        />
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
      <div className='text-secondary-text'>{`Артикул: ${itemId}`}</div>
      <Link
        target={'_blank'}
        className='block mb-6 text-primary-text hover:no-underline hover:text-primary-text font-medium text-lg lg:text-2xl'
        href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
      >
        {snippetTitle}
      </Link>
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
      <CartProductMainData
        rubricSlug={rubricSlug}
        slug={slug}
        itemId={itemId}
        snippetTitle={snippetTitle}
      />

      <div className='flex flex-wrap gap-6 mb-4 items-center'>
        <div>
          <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
        </div>

        <div className='flex justify-center items-center gap-4'>
          <ControlButton iconSize={'mid'} icon={'compare'} />
          <ControlButton iconSize={'mid'} icon={'heart'} />
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

  const { price, oldPrice, discountedPercent, available, shop, itemId, rubricSlug, product } =
    shopProduct;

  if (!shop || !product) {
    return null;
  }

  const lightThemeMarker = shop.mapMarker?.lightTheme;
  const darkThemeMarker = shop.mapMarker?.darkTheme;
  const marker = (isDark ? darkThemeMarker : lightThemeMarker) || '/marker.svg';

  return (
    <CartProductFrame
      rubricSlug={rubricSlug}
      slug={product.slug}
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={product.mainImage}
      snippetTitle={product.snippetTitle}
    >
      <CartProductMainData
        rubricSlug={rubricSlug}
        slug={product.slug}
        itemId={itemId}
        snippetTitle={product.snippetTitle}
      />

      <div className='flex flex-wrap gap-6 mb-4'>
        {/*amount input*/}
        <div>
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

        <div>
          {/*shop product price*/}
          <ProductShopPrices
            price={price}
            oldPrice={oldPrice}
            discountedPercent={discountedPercent}
          />
          {/*available*/}
          <div className='text-secondary-text'>{`В наличии ${available} шт`}</div>
        </div>

        <div className='flex justify-center items-center gap-4'>
          <ControlButton iconSize={'mid'} icon={'compare'} />
          <ControlButton iconSize={'mid'} icon={'heart'} />
        </div>
      </div>

      {/*shop info*/}
      <div className=''>
        <div className='mb-2'>
          Магазин: <span className='font-medium text-lg'>{shop.name}</span>
        </div>
        <div>{shop.address.formattedAddress}</div>
        <div
          className='text-theme cursor-pointer'
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
      <div>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Spinner isNested isTransparent />
        </Inner>
      </div>
    );
  }

  if (!cart) {
    return (
      <div>
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
      <div>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Title>Корзина пуста</Title>
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
    <div className='mb-12'>
      <Breadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        <Title>В корзине товаров {productsCount} шт.</Title>
        <div className='grid md:grid-cols-8 lg:grid-cols-16 gap-6'>
          <div className='md:col-span-5 lg:col-span-11 grid gap-6' data-cy={'cart-products'}>
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

          <div className='md:col-span-3 lg:col-span-5'>
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
