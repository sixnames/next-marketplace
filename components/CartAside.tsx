import { useConfigContext } from 'context/configContext';
import * as React from 'react';
import Currency from 'components/Currency';
import Button from 'components/button/Button';
import LayoutCard from 'layout/LayoutCard';

interface CartAsideInterface {
  productsCount: number;
  isWithShopless?: boolean;
  totalPrice?: number;
  buyButtonText: string;
  isBooking?: boolean;
}

const CartAside: React.FC<CartAsideInterface> = ({
  totalPrice,
  buyButtonText,
  isWithShopless,
  productsCount,
  isBooking,
}) => {
  const { configs } = useConfigContext();
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
              <Currency testId={'cart-aside-total'} value={totalPrice} />
            </div>
          </div>
        </div>
        {/*discount code will be here*/}
      </div>

      <div className='p-6 bg-border-100'>
        <div className='flex justify-between items-baseline mb-5'>
          <div className='text-lg text-secondary-text'>Итого</div>
          <div className='text-2xl font-bold'>
            <Currency testId={'cart-aside-total'} value={totalPrice} />
          </div>
        </div>
        <Button
          type={'submit'}
          testId={'cart-aside-confirm'}
          disabled={isWithShopless}
          className='w-full'
        >
          {buyButtonText}
        </Button>

        {isWithShopless ? (
          <div className='mt-5 text-red-500 font-medium' data-cy={`cart-aside-warning`}>
            Для оформления заказа необходимо выбрать магазины у всех товаров.
          </div>
        ) : null}

        {isBooking ? (
          <div className='mt-5 font-medium' data-cy={`cart-aside-warning`}>
            {configs.siteName} не продаёт и не доставляет алкогольную продукцию. Вы можете
            забронировать инетересующий товар и забрать его в магазинах партнёров.
          </div>
        ) : null}
      </div>
    </LayoutCard>
  );
};

export default CartAside;
