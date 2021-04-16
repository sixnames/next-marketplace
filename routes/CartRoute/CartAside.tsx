import { CartModel } from 'db/dbModels';
import { getNumWord } from 'lib/i18n';
import * as React from 'react';
import classes from './CartAside.module.css';
import Currency from '../../components/Currency/Currency';
import Button from '../../components/Buttons/Button';
import Link from '../../components/Link/Link';
import LayoutCard from 'layout/LayoutCard';
import { ButtonType } from 'types/clientTypes';

interface CartAsideInterface {
  cart: CartModel;
  buttonText: string;
  onConfirmHandler?: () => void;
  backLinkHref?: string;
  buttonType?: ButtonType;
}

const CartAside: React.FC<CartAsideInterface> = ({
  cart,
  backLinkHref,
  buttonText,
  onConfirmHandler,
  buttonType,
}) => {
  const { formattedTotalPrice, productsCount, isWithShopless } = cart;
  const productsCountPostfix = getNumWord(productsCount, ['товар', 'товара', 'товаров']);

  return (
    <LayoutCard className={classes.cartAside} testId={'cart-aside'}>
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
          type={buttonType}
          testId={'cart-aside-confirm'}
          disabled={isWithShopless}
          className={classes.totalsButton}
          onClick={onConfirmHandler}
        >
          {buttonText}
        </Button>

        {backLinkHref ? (
          <Link href={backLinkHref} className={classes.backLink} testId={`cart-aside-back-link`}>
            Редактировать заказ
          </Link>
        ) : null}

        {isWithShopless ? (
          <div className={classes.warning} data-cy={`cart-aside-warning`}>
            Для оформления заказа необходимо выбрать магазины у всех товаров в корзине.
          </div>
        ) : null}
      </div>
    </LayoutCard>
  );
};

export default CartAside;
