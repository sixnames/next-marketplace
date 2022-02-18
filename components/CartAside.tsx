import { useAppContext } from 'components/context/appContext';
import { useLocaleContext } from 'components/context/localeContext';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import { InfoModalInterface } from 'components/Modal/InfoModal';
import { useFormikContext } from 'formik';
import useValidationSchema from 'hooks/useValidationSchema';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { INFO_MODAL } from 'lib/config/modalVariants';
import { noNaN } from 'lib/numbers';
import { MakeOrderFormInterface } from 'pages/cart';
import * as React from 'react';
import { makeAnOrderSchema } from 'validation/orderSchema';
import { ValidationError } from 'yup';
import WpButton from './button/WpButton';
import { useConfigContext } from './context/configContext';
import Currency from './Currency';
import LayoutCard from './layout/LayoutCard';

function scrollToCartErrors(): boolean {
  const distElement = document.getElementById('cart-inputs');
  if (distElement) {
    window.scrollTo({
      top: noNaN(distElement.getBoundingClientRect().top),
      left: 0,
      behavior: 'smooth',
    });
    return true;
  }
  return false;
}

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
  const { locale } = useLocaleContext();
  const { showModal } = useAppContext();
  const discount = noNaN(giftCertificateDiscount);
  const discountedPrice = noNaN(props.totalPrice) - discount;
  const totalPrice = discountedPrice < 0 ? 0 : discountedPrice;
  const { values } = useFormikContext<MakeOrderFormInterface>();
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });

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

        <FormikCheckboxLine
          low
          testId={'order-form-privacy'}
          label={'Даю согласие на обработку личных данных'}
          name={'privacy'}
        />

        <WpButton
          type={'submit'}
          testId={'cart-aside-confirm'}
          disabled={isWithShopless}
          className='w-full'
          onClick={() => {
            validationSchema
              .validate(values, {
                abortEarly: false,
              })
              .catch((e) => {
                if (e) {
                  const error = JSON.parse(
                    JSON.stringify(e, null, 2),
                  ) as unknown as ValidationError;
                  const errorFields = new Set<string>();
                  error.inner.forEach(({ path }) => {
                    if (path) {
                      errorFields.add(path);
                    }
                  });
                  const errorFieldsList = Array.from(errorFields);
                  const validationMessages: string[] = [];

                  errorFieldsList.forEach((path) => {
                    const message = getConstantTranslation(`validation.${path}.${locale}`);
                    validationMessages.push(message);
                  });

                  if (validationMessages.length > 0) {
                    // event.preventDefault();
                    scrollToCartErrors();
                    showModal<InfoModalInterface>({
                      variant: INFO_MODAL,
                      props: {
                        testId: 'cart-validation-modal',
                        title: 'Для оформелния заказа заполните следующие поля',
                        message: (
                          <div>
                            {validationMessages.map((message) => {
                              return <p key={message}>{message}</p>;
                            })}
                          </div>
                        ),
                      },
                    });
                  }
                }
              });
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
