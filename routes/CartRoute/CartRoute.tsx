import * as React from 'react';
import Inner from '../../components/Inner/Inner';
import { useSiteContext } from 'context/siteContext';
import Title from '../../components/Title/Title';
import classes from './CartRoute.module.css';
import {
  CardConnectionFragment,
  CartProductFragment,
  ProductSnippetFragment,
} from 'generated/apolloComponents';
import Image from 'next/image';
import ButtonCross from '../../components/Buttons/ButtonCross';
import ControlButton from '../../components/Buttons/ControlButton';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';
import ProductSnippetPrice from '../../components/Product/ProductSnippetPrice/ProductSnippetPrice';
import Button from '../../components/Buttons/Button';
import CartShopsList from './CartShopsList';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import CartAside from './CartAside';
import { useNotificationsContext } from 'context/notificationsContext';
import { useRouter } from 'next/router';
import LayoutCard from '../../layout/LayoutCard/LayoutCard';
import { noNaN } from 'lib/numbers';

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
  const { deleteProductFromCart } = useSiteContext();
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
              testId={`${_id}-remove-from-cart`}
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
  const { itemId, name, snippetFeatures } = product;
  const { listFeaturesString } = snippetFeatures;
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
  connections: CardConnectionFragment[];
}

const CartProductConnections: React.FC<CartProductConnectionsInterface> = ({ connections }) => {
  return (
    <div className={classes.productConnections}>
      {connections.map(({ _id, name, connectionProducts }) => {
        return (
          <div key={_id} className={classes.connectionsGroup}>
            <div className={classes.connectionsGroupLabel}>{`${name}:`}</div>
            {connectionProducts.map(({ value, _id, isCurrent }) => {
              if (isCurrent) {
                return <span key={_id}>{value}</span>;
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
  const { updateProductInCart } = useSiteContext();
  const { product, shopProduct, _id, amount } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData || !product) {
    return null;
  }

  const { cardPrices, cardConnections } = product;

  return (
    <CartProductFrame product={productData} cartProductId={_id} isShopsVisible={isShopsVisible}>
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData product={productData} />
        </div>

        <div className={classes.productGridRight}>
          <ProductSnippetPrice value={cardPrices.min} />
          <CartProductConnections connections={cardConnections} />
        </div>
      </div>

      <div className={`${classes.shoplessFrom}`}>
        <SpinnerInput
          name={'amount'}
          value={amount}
          min={1}
          testId={`${product._id}-amount`}
          plusTestId={`${product._id}-plus`}
          minusTestId={`${product._id}-minus`}
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
          testId={`${product._id}-show-shops`}
        >
          Выбрать винотеку
        </Button>
      </div>
    </CartProductFrame>
  );
};

const CartProduct: React.FC<CartProductInterface> = ({ cartProduct }) => {
  const { updateProductInCart } = useSiteContext();
  const { product, shopProduct, amount, _id } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData || !shopProduct) {
    return null;
  }

  const { formattedPrice, formattedOldPrice, discountedPercent, available, shop } = shopProduct;
  const { cardConnections } = productData;
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
            testId={`${productData._id}-amount`}
            plusTestId={`${productData._id}-plus`}
            minusTestId={`${productData._id}-minus`}
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
            <CartProductConnections connections={cardConnections} />
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
  const { cart } = useSiteContext();
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
                router.push('/').catch(() => {
                  showErrorNotification();
                });
              }}
            >
              на главную
            </Button>
            <Button className={classes.emptyBtnsItem} theme={'secondary'}>
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
              const { _id, isShopless, product, shopProduct } = cartProduct;

              if (isShopless && product) {
                return <CartShoplessProduct cartProduct={cartProduct} key={_id} />;
              }

              if (!isShopless && shopProduct) {
                return <CartProduct cartProduct={cartProduct} key={_id} />;
              }

              return null;
            })}
          </div>

          <div className={classes.aside}>
            <CartAside
              cart={cart}
              buttonText={'Купить'}
              onConfirmHandler={() => {
                router.push('/make-an-order').catch(() => {
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

export default CartRoute;