import React, { Fragment } from 'react';
import Inner from '../../components/Inner/Inner';
import { useSiteContext } from '../../context/siteContext';
import Title from '../../components/Title/Title';
import classes from './CartRoute.module.css';
import { CartProductFragment, ProductCardFragment } from '../../generated/apolloComponents';
import Image from '../../components/Image/Image';
import ButtonCross from '../../components/Buttons/ButtonCross';
import ControlButton from '../../components/Buttons/ControlButton';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import { noNaN } from '@yagu/shared';

interface CartProductFrameInterface {
  product: ProductCardFragment;
  cartProductId: string;
}

const CartProductFrame: React.FC<CartProductFrameInterface> = ({
  product,
  cartProductId,
  children,
}) => {
  const { deleteProductFromCart } = useSiteContext();
  const { mainImage, nameString } = product;
  const imageWidth = 45;

  return (
    <div data-cy={'cart-product'} className={classes.product}>
      <div className={classes.productImage}>
        <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
      </div>
      <div className={classes.productContent}>
        {children}
        <ButtonCross
          className={classes.productRemove}
          onClick={() => {
            deleteProductFromCart({
              cartProductId,
            });
          }}
        />
        <div className={classes.productButns}>
          <ControlButton icon={'compare'} />
          <ControlButton icon={'heart'} />
        </div>
      </div>
    </div>
  );
};

interface CartProductMainDataInterface {
  product: ProductCardFragment;
}

const CartProductMainData: React.FC<CartProductMainDataInterface> = ({ product }) => {
  const { itemId, nameString } = product;

  return (
    <Fragment>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>
      </div>
      <div className={classes.productName}>{nameString}</div>
      <div className={classes.productMeta}>Новая Зеландия, белое, полусухое </div>
    </Fragment>
  );
};

interface CartProductInterface {
  cartProduct: CartProductFragment;
}

const CartShoplessProduct: React.FC<CartProductInterface> = ({ cartProduct }) => {
  const { product, shopProduct, id } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData) {
    return null;
  }

  return (
    <CartProductFrame product={productData} cartProductId={id}>
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData product={productData} />
        </div>
      </div>
    </CartProductFrame>
  );
};

const CartProduct: React.FC<CartProductInterface> = ({ cartProduct }) => {
  const { updateProductInCart } = useSiteContext();
  const { product, shopProduct, amount, id } = cartProduct;
  const productData = product || shopProduct?.product;
  if (!productData) {
    return null;
  }

  return (
    <CartProductFrame product={productData} cartProductId={id}>
      <div className={classes.productGrid}>
        <div>
          <CartProductMainData product={productData} />
          <SpinnerInput
            name={'amount'}
            value={amount}
            min={1}
            className={classes.amountInput}
            onChange={(e) => {
              updateProductInCart({
                amount: noNaN(e.target.value),
                shopProductId: `${shopProduct?.id}`,
              });
            }}
          />
        </div>

        <div></div>
      </div>
    </CartProductFrame>
  );
};

const CartRoute: React.FC = () => {
  const { cart } = useSiteContext();
  const { productsCount, products } = cart;

  return (
    <Inner testId={'cart'} className={classes.cart}>
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

        <div>Aside</div>
      </div>
    </Inner>
  );
};

export default CartRoute;
