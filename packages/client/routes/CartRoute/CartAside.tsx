import React from 'react';
import classes from './CartAside.module.css';
import { CartFragment } from '../../generated/apolloComponents';
import Currency from '../../components/Currency/Currency';
import Button from '../../components/Buttons/Button';

interface CartAsideInterface {
  cart: CartFragment;
}

const CartAside: React.FC<CartAsideInterface> = ({ cart }) => {
  const { formattedTotalPrice, productsCount, isWithShopless } = cart;

  let productsCountPostfix = productsCount > 1 ? 'товара' : 'товар';
  if (productsCount > 4) {
    productsCountPostfix = 'товаров';
  }

  return (
    <div className={classes.frame} data-cy={'cart-aside'}>
      <div className={classes.frameTop}>
        <div className={classes.title}>Ваш заказ</div>

        <div className={classes.infoList}>
          <div className={classes.info}>
            <div>Товары</div>
            <div className={classes.infoValue}>{`${productsCount} ${productsCountPostfix}`}</div>
          </div>

          <div className={classes.info}>
            <div>Сумма</div>
            <div className={classes.infoValue}>
              <Currency
                testId={'cart-aside-total'}
                className={classes.price}
                valueClassName={classes.priceValue}
                value={formattedTotalPrice}
              />
            </div>
          </div>
        </div>
        {/*discount code will be here*/}
      </div>
      <div className={classes.frameBottom}>
        <div className={classes.totals}>
          <div className={classes.totalsTitle}>Итого</div>
          <div className={classes.totalsPrice}>
            <Currency testId={'cart-aside-total'} value={formattedTotalPrice} />
          </div>
        </div>
        <Button
          testId={'cart-aside-confirm'}
          disabled={isWithShopless}
          className={classes.totalsButton}
        >
          Купить
        </Button>
        {isWithShopless ? (
          <div className={classes.warning} data-cy={`cart-aside-warning`}>
            Для оформления заказа необходимо выбрать магазины у всех товаров в корзине.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CartAside;
