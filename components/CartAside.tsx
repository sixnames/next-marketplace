import { useFormikContext } from 'formik';
import * as React from 'react';
import { DEFAULT_COMPANY_SLUG } from '../config/common';
import { useConfigContext } from '../context/configContext';
import { MakeAnOrderInputInterface } from '../db/dao/orders/makeAnOrder';
import LayoutCard from '../layout/LayoutCard';
import { noNaN } from '../lib/numbers';
import { MakeOrderFormInterface, scrollToCartErrors } from '../pages/cart';
import WpButton from './button/WpButton';
import Currency from './Currency';

export interface UseCartAsideDiscountsValuesInterface {
  giftCertificateDiscount?: number | null;
}

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
  ...props
}) => {
  const discount = noNaN(giftCertificateDiscount);
  const discountedPrice = noNaN(props.totalPrice) - discount;
  const totalPrice = discountedPrice < 0 ? 0 : discountedPrice;
  const { values } = useFormikContext<MakeOrderFormInterface>();

  const { configs } = useConfigContext();
  return (
    <LayoutCard className='mb-4 overflow-hidden' testId={'cart-aside'}>
      <div className='grid gap-5 p-6'>
        <div className='text-2xl font-bold'>Ваш заказ</div>

        <div className='flex items-baseline justify-between gap-2'>
          <div className='text-secondary-text'>Товары</div>
          <div className='text-lg font-medium'>
            {`${productsCount} шт. - `}
            <Currency testId={'cart-aside-total'} value={props.totalPrice} />
          </div>
        </div>

        {noNaN(giftCertificateDiscount) > 0 ? (
          <div className='flex items-baseline justify-between gap-2'>
            <div className='text-secondary-text'>Подарочный сертификат</div>
            <Currency testId={'cart-aside-total'} value={giftCertificateDiscount} />
          </div>
        ) : null}

        <div className='flex items-baseline justify-between'>
          <div className='text-lg text-secondary-text'>Итого</div>
          <div className='text-2xl font-bold'>
            <Currency testId={'cart-aside-total'} value={totalPrice} />
          </div>
        </div>

        <WpButton
          type={'submit'}
          testId={'cart-aside-confirm'}
          disabled={isWithShopless}
          className='w-full'
          onClick={(e) => {
            const input: MakeAnOrderInputInterface = {
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              reservationDate: values.reservationDate,
              comment: values.comment,
              phone: values.phone,
              companySlug: DEFAULT_COMPANY_SLUG,
              shopConfigs: values.shopConfigs,
              allowDelivery: true,
              cartProductsFieldName: 'cartDeliveryProducts',
            };
            const noValid = scrollToCartErrors(input);
            if (noValid) {
              e.preventDefault();
            }
          }}
        >
          {buyButtonText}
        </WpButton>

        {isWithShopless ? (
          <div className='font-medium text-red-500' data-cy={`cart-aside-warning`}>
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
