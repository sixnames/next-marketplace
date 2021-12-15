import { useConfigContext } from 'context/configContext';
import * as React from 'react';
import Currency from 'components/Currency';
import Button from 'components/button/Button';
import LayoutCard from 'layout/LayoutCard';
import { noNaN } from 'lib/numbers';

export interface UseCartAsideDiscountsMethodsInterface {
  setGiftCertificateDiscount: (value: ((prevState: number) => number) | number) => void;
  setPromoCodeDiscount: (value: ((prevState: number) => number) | number) => void;
}

export interface UseCartAsideDiscountsValuesInterface {
  giftCertificateDiscount: number;
  promoCodeDiscount: number;
}

export interface UseCartAsideDiscountsPayloadInterface
  extends UseCartAsideDiscountsMethodsInterface,
    UseCartAsideDiscountsValuesInterface {}

export const useCartAsideDiscounts = (): UseCartAsideDiscountsPayloadInterface => {
  const [giftCertificateDiscount, setGiftCertificateDiscount] = React.useState<number>(0);
  const [promoCodeDiscount, setPromoCodeDiscount] = React.useState<number>(0);

  return {
    giftCertificateDiscount,
    setGiftCertificateDiscount,
    promoCodeDiscount,
    setPromoCodeDiscount,
  };
};

interface CartAsideInterface extends UseCartAsideDiscountsValuesInterface {
  productsCount: number;
  isWithShopless?: boolean;
  totalPrice?: number;
  buyButtonText: string;
  isBooking?: boolean;
}

const CartAside: React.FC<CartAsideInterface> = ({
  buyButtonText,
  isWithShopless,
  productsCount,
  isBooking,
  giftCertificateDiscount,
  promoCodeDiscount,
  ...props
}) => {
  const discount = giftCertificateDiscount + promoCodeDiscount;
  const isDiscounted = discount > 0;
  const discountedPrice = noNaN(props.totalPrice) - discount;
  const totalPrice = discountedPrice < 0 ? 0 : discountedPrice;

  const { configs } = useConfigContext();
  return (
    <LayoutCard className='mb-4 overflow-hidden' testId={'cart-aside'}>
      <div className='p-6 grid gap-5'>
        <div className='font-bold text-2xl'>Ваш заказ</div>

        <div className='flex items-baseline justify-between gap-2'>
          <div className='text-secondary-text'>Товары</div>
          <div className='font-medium text-lg'>{`${productsCount} шт.`}</div>
        </div>

        {giftCertificateDiscount > 0 ? (
          <div className='flex items-baseline justify-between gap-2'>
            <div className='text-secondary-text'>Подарочный сертификат</div>
            <Currency testId={'cart-aside-total'} value={giftCertificateDiscount} />
          </div>
        ) : null}

        <div className='flex justify-between items-baseline'>
          <div className='text-lg text-secondary-text'>Итого</div>
          <div className={isDiscounted ? 'text-xl font-medium' : 'text-2xl font-bold'}>
            <Currency testId={'cart-aside-total'} value={props.totalPrice} />
          </div>
        </div>

        {isDiscounted ? (
          <div className='flex justify-between items-baseline'>
            <div className='text-lg text-secondary-text'>Со скидкой</div>
            <div className='text-2xl font-bold'>
              <Currency testId={'cart-aside-total'} value={totalPrice} />
            </div>
          </div>
        ) : null}

        <Button
          type={'submit'}
          testId={'cart-aside-confirm'}
          disabled={isWithShopless}
          className='w-full'
        >
          {buyButtonText}
        </Button>

        {isWithShopless ? (
          <div className='text-red-500 font-medium' data-cy={`cart-aside-warning`}>
            Для оформления заказа необходимо выбрать магазины у всех товаров.
          </div>
        ) : null}

        {isBooking && configs.cartBookingButtonDescription ? (
          <div className='font-medium' data-cy={`cart-aside-warning`}>
            {configs.cartBookingButtonDescription}
          </div>
        ) : null}
      </div>
    </LayoutCard>
  );
};

export default CartAside;
