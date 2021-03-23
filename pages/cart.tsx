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
import { useNotificationsContext } from 'context/notificationsContext';
import {
  CartProductFragment,
  ProductSnippetFragment,
  SnippetConnectionFragment,
} from 'generated/apolloComponents';
import useCart from 'hooks/useCart';
import useCartMutations from 'hooks/useCartMutations';
import LayoutCard from 'layout/LayoutCard/LayoutCard';
import { noNaN } from 'lib/numbers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CartAside from 'routes/CartRoute/CartAside';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import classes from 'styles/CartRoute.module.css';
import CartShopsList from 'routes/CartRoute/CartShopsList';

interface CartProductFrameInterface {
  product: ProductSnippetFragment;
  cartProductId: string;
  isShopsVisible?: boolean;
}

const CartProductFrame: React.FC<CartProductFrameInterface> = ({
  product,
  cartProductId,
  children,
  isShopsVisible,
}) => {
  const { deleteProductFromCart } = useCartMutations();
  const { mainImage, name, _id } = product;

  return (
    <div className={classes.productHolder}>
      <LayoutCard className={classes.product} testId={'cart-product'}>
        <div className={classes.productMainGrid}>
          <div>
            <div className={classes.productImage}>
              <div className={classes.productImageHolder}>
                <Image src={mainImage} alt={name} title={name} layout='fill' objectFit='contain' />
              </div>
            </div>
          </div>
          <div className={classes.productContent}>
            {children}
            <ButtonCross
              testId={`${product.slug}-remove-from-cart`}
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

      {isShopsVisible ? <CartShopsList productId={_id} cartProductId={cartProductId} /> : null}
    </div>
  );
};

interface CartProductMainDataInterface {
  product: ProductSnippetFragment;
}

const CartProductMainData: React.FC<CartProductMainDataInterface> = ({ product }) => {
  const { itemId, name, listFeatures } = product;

  const listFeaturesString = listFeatures
    .map(({ readableValue }) => {
      return readableValue;
    })
    .join(', ');

  return (
    <React.Fragment>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
      </div>
      <div className={classes.productName}>{name}</div>
      <div className={classes.productMeta}>{listFeaturesString}</div>
    </React.Fragment>
  );
};

interface CartProductConnectionsInterface {
  connections: SnippetConnectionFragment[];
  productId: string;
}

const CartProductConnections: React.FC<CartProductConnectionsInterface> = ({
  connections,
  productId,
}) => {
  return (
    <div className={classes.productConnections}>
      {connections.map(({ _id, attributeName, connectionProducts }) => {
        return (
          <div key={_id} className={classes.connectionsGroup}>
            <div className={classes.connectionsGroupLabel}>{`${attributeName}:`}</div>
            {connectionProducts.map(({ option, _id }) => {
              const isCurrent = _id === productId;
              if (isCurrent) {
                return <span key={option._id}>{option.name}</span>;
              }
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
};

interface CartProductInterface {
  cartProduct: CartProductFragment;
}

const CartShoplessProduct: React.FC<CartProductInterface> = ({ cartProduct }) => {
  const [isShopsVisible, setIsShopsVisible] = React.useState<boolean>(false);
  const { updateProductInCart } = useCartMutations();
  const { product, shopProduct, _id, amount } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData || !product) {
    return null;
  }

  const { cardPrices, connections } = product;

  return (
    <CartProductFrame product={productData} cartProductId={_id} isShopsVisible={isShopsVisible}>
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData product={productData} />
        </div>

        <div className={classes.productGridRight}>
          <ProductSnippetPrice value={cardPrices.min} />
          <CartProductConnections connections={connections} productId={product._id} />
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
  const { updateProductInCart } = useCartMutations();
  const { product, shopProduct, amount, _id } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData || !shopProduct) {
    return null;
  }

  const { formattedPrice, formattedOldPrice, discountedPercent, available, shop } = shopProduct;
  const { connections } = productData;
  const { address, name } = shop;

  return (
    <CartProductFrame product={productData} cartProductId={_id}>
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData product={productData} />
          <SpinnerInput
            name={'amount'}
            value={amount}
            min={1}
            max={available}
            testId={`${productData.slug}-amount`}
            plusTestId={`${productData.slug}-plus`}
            minusTestId={`${productData.slug}-minus`}
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
            formattedPrice={formattedPrice}
            formattedOldPrice={formattedOldPrice}
            discountedPercent={discountedPercent}
          />
          <div className={classes.productConnections}>
            <CartProductConnections connections={connections} productId={productData._id} />
            <div className={classes.connectionsGroup}>{`В наличии ${available} шт`}</div>
          </div>

          <div className={classes.shop}>
            <div>
              <span>винотека: </span>
              {name}
            </div>
            <div>{address.formattedAddress}</div>
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
  const { cart, loadingCart } = useCart();

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
                router.push(`/vino`).catch(() => {
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
              const { _id, isShopless } = cartProduct;

              if (isShopless) {
                return <CartShoplessProduct cartProduct={cartProduct} key={_id} />;
              }

              return <CartProduct cartProduct={cartProduct} key={_id} />;
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

interface CartInterface extends PagePropsInterface, SiteLayoutInterface {}

const Cart: NextPage<CartInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout title={'Корзина'} navRubrics={navRubrics}>
      <CartRoute />
    </SiteLayout>
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
