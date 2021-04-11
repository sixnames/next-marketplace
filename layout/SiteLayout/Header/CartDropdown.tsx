import { useSiteContext } from 'context/siteContext';
import { CartModel } from 'db/dbModels';
import * as React from 'react';
import classes from './CartDropdown.module.css';
import Image from 'next/image';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import ProductSnippetPrice from 'components/Product/ProductSnippetPrice/ProductSnippetPrice';
import ButtonCross from 'components/Buttons/ButtonCross';
import ControlButton from 'components/Buttons/ControlButton';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Currency from 'components/Currency/Currency';
import Button from 'components/Buttons/Button';
import { useRouter } from 'next/router';
import { useNotificationsContext } from 'context/notificationsContext';
import { noNaN } from 'lib/numbers';

interface CartDropdownInterface {
  cart: CartModel;
}

const CartDropdown: React.FC<CartDropdownInterface> = ({ cart }) => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();
  const { deleteProductFromCart, updateProductInCart, clearCart } = useSiteContext();
  const { productsCount, cartProducts, formattedTotalPrice } = cart;

  return (
    <div className={classes.frame} data-cy={'cart-dropdown'}>
      <div className={classes.frameTop}>
        <div className={classes.title}>
          Корзина <span>({productsCount})</span>
        </div>
        <div className={classes.reset} data-cy={'clear-cart'} onClick={clearCart}>
          Очистить все
        </div>
      </div>
      <div className={classes.frameMiddle}>
        {cartProducts.map((cartProduct) => {
          const { product, shopProduct, _id, isShopless, amount } = cartProduct;
          const productData = product || shopProduct?.product;

          if (!productData) {
            return null;
          }

          const { mainImage, originalName, shopsCount, cardPrices } = productData;

          return (
            <div key={`${_id}`} className={classes.product} data-cy={`cart-dropdown-product`}>
              <div className={classes.productImage}>
                <div className={classes.productImageHolder}>
                  <Image
                    src={`${mainImage}`}
                    objectFit='contain'
                    alt={originalName}
                    title={originalName}
                    width={70}
                    height={185}
                  />
                </div>
              </div>
              <div className={classes.productContent}>
                <div className={classes.productName}>{originalName}</div>

                {isShopless && !shopProduct ? (
                  <React.Fragment>
                    <ProductSnippetPrice
                      shopsCount={shopsCount}
                      className={classes.productPrice}
                      value={cardPrices?.min}
                    />
                    <div className={classes.shopless}>Винотека не выбрана</div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <ProductShopPrices
                      className={classes.productPrice}
                      formattedPrice={`${shopProduct?.formattedPrice}`}
                      formattedOldPrice={shopProduct?.formattedOldPrice}
                      discountedPercent={shopProduct?.discountedPercent}
                    />
                    <div className={classes.shop}>
                      <span>винотека: </span>
                      {shopProduct?.shop?.name}
                    </div>
                  </React.Fragment>
                )}

                <div className={classes.controls}>
                  <SpinnerInput
                    name={'amount'}
                    value={amount}
                    min={1}
                    testId={`cart-dropdown-${productData.slug}-amount`}
                    plusTestId={`cart-dropdown-${productData.slug}-plus`}
                    minusTestId={`cart-dropdown-${productData.slug}-minus`}
                    size={'small'}
                    className={`${classes.amountInput}`}
                    onChange={(e) => {
                      updateProductInCart({
                        amount: noNaN(e.target.value),
                        cartProductId: _id,
                      });
                    }}
                  />

                  <div className={classes.productButns}>
                    <ButtonCross
                      testId={`cart-dropdown-${productData.slug}-remove-from-cart`}
                      iconSize={'smaller'}
                      size={'small'}
                      className={classes.productRemove}
                      onClick={() => {
                        deleteProductFromCart({
                          cartProductId: _id,
                        });
                      }}
                    />

                    <ControlButton iconSize={'small'} size={'small'} icon={'compare'} />
                    <ControlButton iconSize={'small'} size={'small'} icon={'heart'} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={classes.frameBottom}>
        <div className={classes.totals}>
          <div className={classes.totalsTitle}>Итого</div>
          <div className={classes.totalsPrice}>
            <Currency value={formattedTotalPrice} />
          </div>
        </div>
        <Button
          className={classes.totalsButton}
          onClick={() => {
            router.push(`/cart`).catch(() => {
              showErrorNotification();
            });
          }}
        >
          оформить заказ
        </Button>
      </div>
    </div>
  );
};

export default CartDropdown;
