import { CartProduct } from 'components/cart/CartProduct';
import CartAside from 'components/CartAside';
import FakeInput from 'components/FormElements/Input/FakeInput';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import Notification from 'components/Notification';
import { ORDER_DELIVERY_VARIANT_PICKUP, ORDER_PAYMENT_VARIANT_RECEIPT } from 'config/common';
import { DELIVERY_VARIANT_OPTIONS, PAYMENT_VARIANT_OPTIONS } from 'config/constantSelects';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { CartInterface, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { phoneToRaw } from 'lib/phoneUtils';
import { MakeOrderFormInterface } from 'pages/[companySlug]/[citySlug]/cart';
import * as React from 'react';

interface OneShopCompanyCartInterface {
  cart: CartInterface;
  tabIndex: number;
  domainCompany: CompanyInterface;
}

const OneShopCompanyCart: React.FC<OneShopCompanyCartInterface> = ({
  cart,
  domainCompany,
  tabIndex,
}) => {
  const { makeAnOrder } = useSiteContext();
  const { configs } = useConfigContext();
  const sessionUser = useSiteUserContext();
  const disabled = !!sessionUser;

  const {
    cartBookingProducts,
    cartDeliveryProducts,
    isWithShoplessBooking,
    isWithShoplessDelivery,
  } = cart;

  const initialValues: MakeOrderFormInterface = {
    ...cart,
    name: sessionUser ? sessionUser.me.name : '',
    lastName: sessionUser ? sessionUser.me.lastName : '',
    email: sessionUser ? sessionUser.me.email : '',
    phone: sessionUser ? sessionUser.me.phone : '',
    comment: '',
    reservationDate: null,
    deliveryVariant: ORDER_DELIVERY_VARIANT_PICKUP,
    paymentVariant: ORDER_PAYMENT_VARIANT_RECEIPT,
  };

  return (
    <div>
      {/* delivery form */}
      {cartDeliveryProducts.length > 0 && tabIndex === 0 ? (
        <Formik<MakeOrderFormInterface>
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => {
            makeAnOrder({
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              reservationDate: values.reservationDate,
              comment: values.comment,
              phone: phoneToRaw(values.phone),
              companySlug: domainCompany.slug,
              deliveryVariant: values.deliveryVariant,
              paymentVariant: values.paymentVariant,
              allowDelivery: true,
              cartProductsFieldName: 'cartDeliveryProducts',
            });
          }}
        >
          {({ values }) => {
            const { cartDeliveryProducts, totalDeliveryPrice } = values;

            return (
              <Form>
                <div className='flex items-center gap-4 text-lg font-medium mb-6'>
                  <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                    1
                  </div>
                  <div>Товары</div>
                </div>

                <div className='grid md:grid-cols-8 lg:grid-cols-16 gap-6'>
                  <div className='md:col-span-5 lg:col-span-11' data-cy={'cart-products'}>
                    <div className='mb-20'>
                      {/*cart products*/}
                      <div className='grid gap-6' data-cy={'delivery-products'}>
                        {cartDeliveryProducts.map((cartProduct, index) => {
                          return (
                            <CartProduct
                              fieldName={`cartDeliveryProducts[${index}].amount`}
                              testId={index}
                              cartProduct={cartProduct}
                              key={`${cartProduct._id}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className='relative z-20 mb-12'>
                      <div className='flex items-center gap-4 mb-8 text-lg font-medium'>
                        <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                          2
                        </div>
                        <div>Личные данные</div>
                      </div>

                      <div className='lg:grid grid-cols-2 gap-x-6'>
                        <FormikInput
                          testId={'order-form-name'}
                          name={'name'}
                          label={'Имя'}
                          disabled={disabled}
                          isRequired
                        />

                        <FormikInput
                          disabled={disabled}
                          name={'lastName'}
                          label={'Фамилия'}
                          testId={'lastName'}
                        />

                        <FormikInput
                          testId={'order-form-phone'}
                          name={'phone'}
                          type={'tel'}
                          label={'Телефон'}
                          disabled={disabled}
                          isRequired
                        />

                        <FormikInput
                          testId={'order-form-email'}
                          name={'email'}
                          type={'email'}
                          label={'E-mail'}
                          disabled={disabled}
                          isRequired
                        />

                        <FormikTextarea
                          testId={'order-form-comment'}
                          name={'comment'}
                          label={'Комментарий к заказу'}
                        />
                      </div>
                    </div>

                    {/* delivery and payment */}
                    <div className='relative z-20 mb-12'>
                      <div className='flex items-center gap-4 mb-8 text-lg font-medium'>
                        <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                          3
                        </div>
                        <div>Способ получения и оплата</div>
                      </div>

                      <div className='lg:grid grid-cols-2 gap-x-6'>
                        <FormikSelect
                          label={'Способ получения'}
                          name={'deliveryVariant'}
                          options={DELIVERY_VARIANT_OPTIONS}
                          isRequired
                        />

                        <FormikSelect
                          label={'Оплата'}
                          name={'paymentVariant'}
                          options={PAYMENT_VARIANT_OPTIONS}
                          isRequired
                        />
                      </div>
                    </div>
                  </div>

                  {/*cart aside*/}
                  <div className='md:col-span-3 lg:col-span-5'>
                    <CartAside
                      buyButtonText={'Оформить заказ'}
                      productsCount={cartDeliveryProducts.length}
                      totalPrice={totalDeliveryPrice}
                      isWithShopless={isWithShoplessDelivery}
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      ) : null}

      {/* booking form */}
      {cartBookingProducts.length > 0 && tabIndex === 1 ? (
        <Formik<MakeOrderFormInterface>
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => {
            makeAnOrder({
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              reservationDate: values.reservationDate,
              comment: values.comment,
              phone: phoneToRaw(values.phone),
              companySlug: domainCompany.slug,
              deliveryVariant: ORDER_DELIVERY_VARIANT_PICKUP,
              paymentVariant: ORDER_PAYMENT_VARIANT_RECEIPT,
              allowDelivery: false,
              cartProductsFieldName: 'cartBookingProducts',
            });
          }}
        >
          {({ values }) => {
            const { cartBookingProducts, totalBookingPrice } = values;

            return (
              <Form>
                <div className='flex items-center gap-4 text-lg font-medium mb-6'>
                  <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                    1
                  </div>
                  <div>Товары</div>
                </div>

                <div className='grid md:grid-cols-8 lg:grid-cols-16 gap-6'>
                  <div className='md:col-span-5 lg:col-span-11' data-cy={'cart-products'}>
                    <div className='mb-20'>
                      {/*cart products*/}
                      <div className='grid gap-6' data-cy={'booking-products'}>
                        {cartBookingProducts.map((cartProduct, index) => {
                          return (
                            <CartProduct
                              showPriceWarning
                              fieldName={`cartBookingProducts[${index}].amount`}
                              testId={index}
                              cartProduct={cartProduct}
                              key={`${cartProduct._id}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className='relative z-20 mb-12'>
                      <div className='flex items-center gap-4 mb-8 text-lg font-medium'>
                        <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                          2
                        </div>
                        <div>Личные данные</div>
                      </div>

                      <div className='lg:grid grid-cols-2 gap-x-6'>
                        <FormikInput
                          testId={'order-form-name'}
                          name={'name'}
                          label={'Имя'}
                          disabled={disabled}
                          isRequired
                        />

                        <FormikInput
                          disabled={disabled}
                          name={'lastName'}
                          label={'Фамилия'}
                          testId={'lastName'}
                        />

                        <FormikInput
                          testId={'order-form-phone'}
                          name={'phone'}
                          type={'tel'}
                          label={'Телефон'}
                          disabled={disabled}
                          isRequired
                        />

                        <FormikInput
                          testId={'order-form-email'}
                          name={'email'}
                          type={'email'}
                          label={'E-mail'}
                          disabled={disabled}
                          isRequired
                        />

                        {configs.showReservationDate ? (
                          <FormikDatePicker
                            isRequired
                            label={'Дата брони'}
                            name={'reservationDate'}
                            testId={'reservationDate'}
                          />
                        ) : null}

                        <FormikTextarea
                          testId={'order-form-comment'}
                          name={'comment'}
                          label={'Комментарий к заказу'}
                        />
                      </div>
                    </div>

                    {/* delivery and payment */}
                    <div className='relative z-20 mb-12'>
                      <div className='flex items-center gap-4 mb-8 text-lg font-medium'>
                        <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                          3
                        </div>
                        <div>Способ получения и оплата</div>
                      </div>

                      <div className='lg:grid grid-cols-2 gap-x-6'>
                        <div>
                          <FormikSelect
                            label={'Способ получения'}
                            name={'deliveryVariant'}
                            options={DELIVERY_VARIANT_OPTIONS}
                            disabled
                          />
                          <Notification
                            variant={'success'}
                            message={
                              'Для полученя забронированного товара необходим документ подтверждающий личность.'
                            }
                          />
                        </div>

                        <FakeInput label={'Оплата'} value={'Оплата при получении'} />
                      </div>
                    </div>
                  </div>

                  {/*cart aside*/}
                  <div className='md:col-span-3 lg:col-span-5'>
                    <CartAside
                      isBooking
                      buyButtonText={configs.buyButtonText}
                      productsCount={cartBookingProducts.length}
                      totalPrice={totalBookingPrice}
                      isWithShopless={isWithShoplessBooking}
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      ) : null}
    </div>
  );
};

export default OneShopCompanyCart;
