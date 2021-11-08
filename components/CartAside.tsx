import { CartInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Currency from 'components/Currency';
import Button from 'components/button/Button';
import Link from 'components/Link/Link';
import LayoutCard from 'layout/LayoutCard';
import { ButtonType } from 'types/clientTypes';

interface CartAsideInterface {
  cart: CartInterface;
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

  return (
    <LayoutCard className='sticky top-16 lef-0 mb-4 overflow-hidden' testId={'cart-aside'}>
      <div className='p-6 grid gap-5'>
        <div className='font-bold text-2xl'>Ваш заказ</div>

        <div className='grid gap-4'>
          <div className='flex items-baseline justify-between gap-2'>
            <div className='text-secondary-text'>Товары</div>
            <div className='font-medium text-lg'>{`${productsCount} шт.`}</div>
          </div>

          <div className='flex items-baseline justify-between gap-2'>
            <div className='text-secondary-text'>Сумма</div>
            <div className='font-medium text-lg'>
              <Currency testId={'cart-aside-total'} value={formattedTotalPrice} />
            </div>
          </div>
        </div>
        {/*discount code will be here*/}
      </div>

      <div className='p-6 bg-border-100'>
        <div className='flex justify-between items-baseline mb-5'>
          <div className='text-lg text-secondary-text'>Итого</div>
          <div className='text-2xl font-bold'>
            <Currency testId={'cart-aside-total'} value={formattedTotalPrice} />
          </div>
        </div>
        <Button
          type={buttonType}
          testId={'cart-aside-confirm'}
          disabled={isWithShopless}
          className='w-full'
          onClick={onConfirmHandler}
        >
          {buttonText}
        </Button>

        {backLinkHref ? (
          <Link
            href={backLinkHref}
            className='block text-center mt-5'
            testId={`cart-aside-back-link`}
          >
            Редактировать заказ
          </Link>
        ) : null}

        {isWithShopless ? (
          <div className='mt-5 text-red-500 font-medium' data-cy={`cart-aside-warning`}>
            Для оформления заказа необходимо выбрать магазины у всех товаров в корзине.
          </div>
        ) : null}
      </div>
    </LayoutCard>
  );
};

export default CartAside;
