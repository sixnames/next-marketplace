import React, { Fragment, useState } from 'react';
import Inner from '../../components/Inner/Inner';
import { useSiteContext } from '../../context/siteContext';
import Title from '../../components/Title/Title';
import classes from './CartRoute.module.css';
import {
  CardConnectionFragment,
  CartProductFragment,
  ProductCardFragment,
} from '../../generated/apolloComponents';
import Image from '../../components/Image/Image';
import ButtonCross from '../../components/Buttons/ButtonCross';
import ControlButton from '../../components/Buttons/ControlButton';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import { noNaN } from '@yagu/shared';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';
import ProductSnippetPrice from '../../components/Product/ProductSnippetPrice/ProductSnippetPrice';
import Button from '../../components/Buttons/Button';
import CartShopsList from './CartShopsList';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import CartAside from './CartAside';
import { useNotificationsContext } from '../../context/notificationsContext';
import { useRouter } from 'next/router';
import LayoutCard from '../../layout/LayoutCard/LayoutCard';

interface CartProductFrameInterface {
  product: ProductCardFragment;
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
  const { mainImage, nameString, id, slug } = product;
  const imageWidth = 45;

  return (
    <div className={classes.productHolder}>
      <LayoutCard className={classes.product} testId={'cart-product'}>
        <div className={classes.productMainGrid}>
          <div className={classes.productImage}>
            <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
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

      {isShopsVisible ? <CartShopsList productId={id} cartProductId={cartProductId} /> : null}
    </div>
  );
};

interface CartProductMainDataInterface {
  product: ProductCardFragment;
}

const CartProductMainData: React.FC<CartProductMainDataInterface> = ({ product }) => {
  const { itemId, nameString, cardFeatures } = product;
  const { listFeaturesString } = cardFeatures;
  return (
    <Fragment>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
      </div>
      <div className={classes.productName}>{nameString}</div>
      <div className={classes.productMeta}>{listFeaturesString}</div>
    </Fragment>
  );
};

interface CartProductConnectionsInterface {
  connections: CardConnectionFragment[];
}

const CartProductConnections: React.FC<CartProductConnectionsInterface> = ({ connections }) => {
  return (
    <div className={classes.productConnections}>
      {connections.map(({ id, nameString, products }) => {
        return (
          <div key={id} className={classes.connectionsGroup}>
            <div className={classes.connectionsGroupLabel}>{`${nameString}:`}</div>
            {products.map(({ value, id, isCurrent }) => {
              if (isCurrent) {
                return <span key={id}>{value}</span>;
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
  const [isShopsVisible, setIsShopsVisible] = useState<boolean>(false);
  const { updateProductInCart } = useSiteContext();
  const { product, shopProduct, id, amount } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData || !product) {
    return null;
  }

  const { cardPrices, slug, cardConnections } = product;

  return (
    <CartProductFrame product={productData} cartProductId={id} isShopsVisible={isShopsVisible}>
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
          testId={`${slug}-amount`}
          plusTestId={`${slug}-plus`}
          minusTestId={`${slug}-minus`}
          frameClassName={`${classes.shoplessFromInput}`}
          className={`${classes.amountInput}`}
          onChange={(e) => {
            updateProductInCart({
              amount: noNaN(e.target.value),
              cartProductId: id,
            });
          }}
        />
        <Button
          onClick={() => {
            setIsShopsVisible(true);
          }}
          testId={`${slug}-show-shops`}
        >
          Выбрать винотеку
        </Button>
      </div>
    </CartProductFrame>
  );
};

const CartProduct: React.FC<CartProductInterface> = ({ cartProduct }) => {
  const { updateProductInCart } = useSiteContext();
  const { product, shopProduct, amount, id } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData || !shopProduct) {
    return null;
  }

  const { formattedPrice, formattedOldPrice, discountedPercent, available, shop } = shopProduct;
  const { slug, cardConnections } = productData;
  const { address, nameString } = shop;

  return (
    <CartProductFrame product={productData} cartProductId={id}>
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData product={productData} />
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
                cartProductId: id,
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
              {nameString}
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
  const { productsCount, products } = cart;

  if (products.length < 1) {
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
            {products.map((cartProduct) => {
              const { id, isShopless, product, shopProduct } = cartProduct;

              if (isShopless && product) {
                return <CartShoplessProduct cartProduct={cartProduct} key={id} />;
              }

              if (!isShopless && shopProduct) {
                return <CartProduct cartProduct={cartProduct} key={id} />;
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
