import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Button from 'components/Buttons/Button';
import ButtonCross from 'components/Buttons/ButtonCross';
import ControlButton from 'components/Buttons/ControlButton';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Inner from 'components/Inner/Inner';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import ProductSnippetPrice from 'components/Product/ProductSnippetPrice/ProductSnippetPrice';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Title from 'components/Title/Title';
import { ROUTE_CATALOGUE } from 'config/common';
import { useNotificationsContext } from 'context/notificationsContext';
import { useSiteContext } from 'context/siteContext';
import { CartProductModel, ShopProductModel } from 'db/dbModels';
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
  shopProducts?: ShopProductModel[];
  slug: string;
}

const CartProductFrame: React.FC<CartProductFrameInterface> = ({
  cartProductId,
  children,
  isShopsVisible,
  mainImage,
  originalName,
  shopProducts,
  slug,
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
              testId={`${slug}-remove-from-cart`}
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

interface CartProductInterface {
  cartProduct: CartProductModel;
}

const CartShoplessProduct: React.FC<CartProductInterface> = ({ cartProduct }) => {
  const [isShopsVisible, setIsShopsVisible] = React.useState<boolean>(false);
  const { updateProductInCart } = useSiteContext();
  const { product, _id, amount } = cartProduct;
  if (!product) {
    return null;
  }

  const { itemId, originalName, slug, shopProducts, cardPrices, shopsCount, mainImage } = product;

  return (
    <CartProductFrame
      cartProductId={`${_id}`}
      slug={slug}
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

      <div className={`${classes.shoplessFrom}`}>
        <SpinnerInput
          name={'amount'}
          value={amount}
          min={1}
          testId={`${product.slug}-amount`}
          plusTestId={`${product.slug}-plus`}
          minusTestId={`${product.slug}-minus`}
          frameClassName={`${classes.shoplessFromInput}`}
          className={`${classes.amountInput}`}
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
          testId={`${product.slug}-show-shops`}
        >
          Выбрать винотеку
        </Button>
      </div>
    </CartProductFrame>
  );
};

const CartProduct: React.FC<CartProductInterface> = ({ cartProduct }) => {
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
    slug,
    mainImage,
  } = shopProduct;
  return (
    <CartProductFrame
      slug={slug}
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
            testId={`${slug}-amount`}
            plusTestId={`${slug}-plus`}
            minusTestId={`${slug}-minus`}
            className={classes.amountInput}
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
          <Spinner isNested />
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
          <div className={classes.emptyBtns}>
            <Button
              className={classes.emptyBtnsItem}
              theme={'secondary'}
              onClick={() => {
                router.push(`/`).catch(() => {
                  showErrorNotification();
                });
              }}
            >
              на главную
            </Button>
            <Button
              className={classes.emptyBtnsItem}
              theme={'secondary'}
              onClick={() => {
                router.push(`${ROUTE_CATALOGUE}/vino`).catch(() => {
                  showErrorNotification();
                });
              }}
            >
              каталог вин
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
            {cartProducts.map((cartProduct) => {
              const { _id, shopProduct } = cartProduct;

              if (!shopProduct) {
                return <CartShoplessProduct cartProduct={cartProduct} key={`${_id}`} />;
              }

              return <CartProduct cartProduct={cartProduct} key={`${_id}`} />;
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

type CartInterface = SiteLayoutProviderInterface;

const Cart: NextPage<CartInterface> = (props) => {
  return (
    <SiteLayoutProvider title={'Корзина'} {...props}>
      <CartRoute />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CartInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default Cart;
