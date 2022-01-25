import { Form, Formik } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import {
  ORDER_DELIVERY_VARIANT_COURIER,
  ORDER_DELIVERY_VARIANT_PICKUP,
  ORDER_PAYMENT_VARIANT_RECEIPT,
} from '../../config/common';
import { useConfigContext } from '../../context/configContext';
import { useSiteContext } from '../../context/siteContext';
import { useSiteUserContext } from '../../context/siteUserContext';
import { CartInterface, CompanyInterface } from '../../db/uiInterfaces';
import useValidationSchema from '../../hooks/useValidationSchema';
import LayoutCard from '../../layout/LayoutCard';
import { noNaN } from '../../lib/numbers';
import { phoneToRaw } from '../../lib/phoneUtils';
import { CartTabIndexType, MakeOrderFormInterface } from '../../pages/cart';
import { makeAnOrderSchema } from '../../validation/orderSchema';
import WpButton from '../button/WpButton';
import CartAside from '../CartAside';
import FormikDatePicker from '../FormElements/Input/FormikDatePicker';
import FormikInput from '../FormElements/Input/FormikInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikTextarea from '../FormElements/Textarea/FormikTextarea';
import RequestError from '../RequestError';
import WpNotification from '../WpNotification';
import { CartProduct } from './CartProduct';
import { CartDeliveryFields, DefaultCartShopInterface } from './DefaultCart';

interface OneShopCompanyCartFormInterface {
  cart: CartInterface;
  domainCompany: CompanyInterface;
}

const OneShopCompanyDeliveryCart: React.FC<OneShopCompanyCartFormInterface> = ({
  domainCompany,
  cart,
}) => {
  const { makeAnOrder, checkGiftCertificate, checkPromoCode } = useSiteContext();
  const sessionUser = useSiteUserContext();
  const disabled = !!sessionUser;
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });

  if (!domainCompany.mainShop) {
    return <RequestError message={'Ошибака загрузки данных магазина'} />;
  }

  const giftCertificate = (cart.giftCertificates || []).find(({ companyId }) => {
    return `${companyId}` === `${domainCompany.mainShop?.companyId}`;
  });

  const promoCode = (cart.promoCodes || []).find((promoCodeItem) => {
    return promoCodeItem.companyId === domainCompany.mainShop?.companyId;
  });

  const initialValues: MakeOrderFormInterface = {
    ...cart,
    name: sessionUser ? sessionUser.me.name : '',
    lastName: sessionUser ? sessionUser.me.lastName : '',
    email: sessionUser ? sessionUser.me.email : '',
    phone: sessionUser ? sessionUser.me.phone : '',
    comment: '',
    reservationDate: null,
    shopConfigs: [
      {
        _id: `${domainCompany.mainShop._id}`,
        giftCertificateDiscount: giftCertificate?.value || 0,
        giftCertificateCode: giftCertificate?.code || '',
        deliveryVariant: ORDER_DELIVERY_VARIANT_COURIER,
        paymentVariant: ORDER_PAYMENT_VARIANT_RECEIPT,
        promoCode,
      },
    ],
  };

  return (
    <Formik<MakeOrderFormInterface>
      validationSchema={validationSchema}
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(values, { setFieldError }) => {
        const noAddressShopConfigs = values.shopConfigs.reduce(
          (acc: number[], shopConfig, index) => {
            if (shopConfig.deliveryVariant !== ORDER_DELIVERY_VARIANT_COURIER) {
              return acc;
            }
            if (!shopConfig.deliveryInfo || !shopConfig.deliveryInfo.address) {
              return [...acc, index];
            }
            return acc;
          },
          [],
        );
        if (noAddressShopConfigs.length > 0) {
          setFieldError(`shopConfigs[0]`, 'Укажите адрес доставки');
          const distElement = document.querySelector(`#delivery-fields-0`);
          if (distElement) {
            window.scrollTo({
              top: noNaN(distElement.getBoundingClientRect().top),
              left: 0,
              behavior: 'smooth',
            });
          }
          return;
        }

        makeAnOrder({
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          reservationDate: values.reservationDate,
          comment: values.comment,
          phone: phoneToRaw(values.phone),
          companySlug: domainCompany.slug,
          shopConfigs: values.shopConfigs,
          allowDelivery: true,
          cartProductsFieldName: 'cartDeliveryProducts',
        });
      }}
    >
      {({ values, setFieldValue }) => {
        const promoCodeFieldName = `shopConfigs[0].promoCode.code`;
        const giftCertificateFieldName = `shopConfigs[0].giftCertificateCode`;
        const giftCertificateValueFieldName = `shopConfigs[0].giftCertificateDiscount`;
        const { cartDeliveryProducts, totalDeliveryPrice, isWithShoplessDelivery, shopConfigs } =
          values;
        const giftCertificateCode = get(values, giftCertificateFieldName);
        const promoCodeCode = get(values, promoCodeFieldName);
        const shop = get(values, 'shopConfigs[0]') as DefaultCartShopInterface;
        const giftCertificateDiscount = shopConfigs.reduce(
          (acc: number, { giftCertificateDiscount }) => {
            return acc + noNaN(giftCertificateDiscount);
          },
          0,
        );

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
                          shopIndex={0}
                          fieldName={`cartDeliveryProducts[${index}].amount`}
                          testId={index}
                          cartProduct={cartProduct}
                          key={`${cartProduct._id}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className='relative z-20 mb-12' id={'cart-inputs'}>
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
                      showInlineError
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
                      showInlineError
                    />

                    <FormikInput
                      testId={'order-form-email'}
                      name={'email'}
                      type={'email'}
                      label={'E-mail'}
                      disabled={disabled}
                      isRequired
                      showInlineError
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

                  <CartDeliveryFields index={0} />
                </div>
              </div>

              {/*cart aside*/}
              <div className='md:col-span-3 lg:col-span-5'>
                <div className='sticky top-16 lef-0'>
                  <CartAside
                    buyButtonText={'Оформить заказ'}
                    productsCount={cartDeliveryProducts.length}
                    totalPrice={totalDeliveryPrice}
                    isWithShopless={isWithShoplessDelivery}
                    giftCertificateDiscount={giftCertificateDiscount}
                  />

                  {/*discount inputs*/}
                  <LayoutCard className='mb-4 overflow-hidden' testId={'cart-aside'}>
                    <div className='p-6 grid gap-5'>
                      <InputLine
                        low
                        labelTag={'div'}
                        label={'Подарочный сертификат'}
                        lineContentClass='flex flex-col sm:flex-row gap-4 sm:items-center'
                      >
                        <div className='flex-grow'>
                          <FormikInput
                            size={'small'}
                            name={giftCertificateFieldName}
                            testId={`gift-certificate-input-${domainCompany.mainShop?.slug}`}
                            low
                          />
                        </div>
                        <WpButton
                          short
                          size={'small'}
                          frameClassName='w-auto'
                          theme={'secondary'}
                          testId={`gift-certificate-confirm-${domainCompany.mainShop?.slug}`}
                          onClick={() => {
                            checkGiftCertificate({
                              code: giftCertificateCode,
                              companyId: `${domainCompany._id}`,
                              cartId: `${cart._id}`,
                              onError: () => setFieldValue(giftCertificateFieldName, ''),
                              onSuccess: (giftCertificate) => {
                                setFieldValue(giftCertificateValueFieldName, giftCertificate.value);
                              },
                            });
                          }}
                        >
                          Применить
                        </WpButton>
                      </InputLine>

                      <InputLine low labelTag={'div'} label={'Промокод'}>
                        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
                          <div className='flex-grow'>
                            <FormikInput
                              readOnly={Boolean(shop.promoCode?._id)}
                              size={'small'}
                              name={promoCodeFieldName}
                              low
                            />
                          </div>
                          <WpButton
                            short
                            disabled={Boolean(shop.promoCode?._id)}
                            size={'small'}
                            frameClassName='w-auto'
                            theme={'secondary'}
                            onClick={() => {
                              checkPromoCode({
                                code: promoCodeCode,
                                companyId: `${domainCompany._id}`,
                                cartId: `${cart._id}`,
                                shopProductIds: cartDeliveryProducts.reduce(
                                  (acc: string[], { shopProductId }) => {
                                    if (shopProductId) {
                                      return [...acc, `${shopProductId}`];
                                    }
                                    return acc;
                                  },
                                  [],
                                ),
                                onError: () => setFieldValue(giftCertificateFieldName, ''),
                                onSuccess: (promoCode) => {
                                  console.log(promoCode);
                                },
                              });
                            }}
                          >
                            Применить
                          </WpButton>
                        </div>
                        {shop.promoCode && shop.promoCode.description ? (
                          <div className='mt-4 text-secondary-text'>
                            {shop.promoCode.description}
                          </div>
                        ) : null}
                      </InputLine>
                    </div>
                  </LayoutCard>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const OneShopCompanyBookingCart: React.FC<OneShopCompanyCartFormInterface> = ({
  domainCompany,
  cart,
}) => {
  const { makeAnOrder, checkGiftCertificate, checkPromoCode } = useSiteContext();
  const sessionUser = useSiteUserContext();
  const { configs } = useConfigContext();
  const disabled = !!sessionUser;
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });

  if (!domainCompany.mainShop) {
    return <RequestError message={'Ошибака загрузки данных магазина'} />;
  }

  const giftCertificate = (cart.giftCertificates || []).find(({ companyId }) => {
    return `${companyId}` === `${domainCompany.mainShop?.companyId}`;
  });

  const promoCode = (cart.promoCodes || []).find((promoCodeItem) => {
    return promoCodeItem.companyId === domainCompany.mainShop?.companyId;
  });

  const initialValues: MakeOrderFormInterface = {
    ...cart,
    name: sessionUser ? sessionUser.me.name : '',
    lastName: sessionUser ? sessionUser.me.lastName : '',
    email: sessionUser ? sessionUser.me.email : '',
    phone: sessionUser ? sessionUser.me.phone : '',
    comment: '',
    reservationDate: null,
    shopConfigs: [
      {
        _id: `${domainCompany.mainShop._id}`,
        giftCertificateDiscount: giftCertificate?.value || 0,
        giftCertificateCode: giftCertificate?.code || '',
        deliveryVariant: ORDER_DELIVERY_VARIANT_PICKUP,
        paymentVariant: ORDER_PAYMENT_VARIANT_RECEIPT,
        promoCode,
      },
    ],
  };

  return (
    <Formik<MakeOrderFormInterface>
      validationSchema={validationSchema}
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
          shopConfigs: values.shopConfigs,
          allowDelivery: false,
          cartProductsFieldName: 'cartBookingProducts',
        });
      }}
    >
      {({ values, setFieldValue }) => {
        const { cartBookingProducts, totalBookingPrice, isWithShoplessBooking, shopConfigs } =
          values;
        const promoCodeFieldName = `shopConfigs[0].promoCode.code`;
        const giftCertificateFieldName = `shopConfigs[0].giftCertificateCode`;
        const giftCertificateValueFieldName = `shopConfigs[0].giftCertificateDiscount`;
        const giftCertificateCode = get(values, giftCertificateFieldName);
        const promoCodeCode = get(values, promoCodeFieldName);
        const shop = get(values, 'shopConfigs[0]') as DefaultCartShopInterface;
        const giftCertificateDiscount = shopConfigs.reduce(
          (acc: number, { giftCertificateDiscount }) => {
            return acc + noNaN(giftCertificateDiscount);
          },
          0,
        );

        return (
          <Form>
            {domainCompany.mainShop?.priceWarning ? (
              <div className='mt-4'>
                <WpNotification
                  className='dark:bg-primary'
                  variant={'success'}
                  message={domainCompany.mainShop.priceWarning}
                />
              </div>
            ) : null}

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
                          shopIndex={0}
                          fieldName={`cartBookingProducts[${index}].amount`}
                          testId={index}
                          cartProduct={cartProduct}
                          key={`${cartProduct._id}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className='relative z-20 mb-12' id={'cart-inputs'}>
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
                      showInlineError
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
                      showInlineError
                    />

                    <FormikInput
                      testId={'order-form-email'}
                      name={'email'}
                      type={'email'}
                      label={'E-mail'}
                      disabled={disabled}
                      isRequired
                      showInlineError
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
              </div>

              {/*cart aside*/}
              <div className='md:col-span-3 lg:col-span-5'>
                <div className='sticky top-16 lef-0'>
                  <CartAside
                    isBooking
                    buyButtonText={configs.buyButtonText}
                    productsCount={cartBookingProducts.length}
                    totalPrice={totalBookingPrice}
                    isWithShopless={isWithShoplessBooking}
                    giftCertificateDiscount={giftCertificateDiscount}
                  />

                  {/*discount inputs*/}
                  <LayoutCard className='mb-4 overflow-hidden' testId={'cart-aside'}>
                    <div className='p-6 grid gap-5'>
                      <InputLine
                        low
                        labelTag={'div'}
                        label={'Подарочный сертификат'}
                        lineContentClass='flex flex-col sm:flex-row gap-4 sm:items-center'
                      >
                        <div className='flex-grow'>
                          <FormikInput
                            size={'small'}
                            name={giftCertificateFieldName}
                            testId={`gift-certificate-input-${domainCompany.mainShop?.slug}`}
                            low
                          />
                        </div>
                        <WpButton
                          short
                          size={'small'}
                          frameClassName='w-auto'
                          theme={'secondary'}
                          testId={`gift-certificate-confirm-${domainCompany.mainShop?.slug}`}
                          onClick={() => {
                            checkGiftCertificate({
                              code: giftCertificateCode,
                              companyId: `${domainCompany._id}`,
                              cartId: `${cart._id}`,
                              onError: () => setFieldValue(giftCertificateFieldName, ''),
                              onSuccess: (giftCertificate) => {
                                setFieldValue(giftCertificateValueFieldName, giftCertificate.value);
                              },
                            });
                          }}
                        >
                          Применить
                        </WpButton>
                      </InputLine>

                      <InputLine low labelTag={'div'} label={'Промокод'}>
                        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
                          <div className='flex-grow'>
                            <FormikInput
                              testId={`promo-code-input-${domainCompany.mainShop?.slug}`}
                              readOnly={Boolean(shop.promoCode?._id)}
                              size={'small'}
                              name={promoCodeFieldName}
                              low
                            />
                          </div>
                          <WpButton
                            short
                            testId={`promo-code-submit-${domainCompany.mainShop?.slug}`}
                            disabled={Boolean(shop.promoCode?._id)}
                            size={'small'}
                            frameClassName='w-auto'
                            theme={'secondary'}
                            onClick={() => {
                              checkPromoCode({
                                code: promoCodeCode,
                                companyId: `${domainCompany._id}`,
                                cartId: `${cart._id}`,
                                shopProductIds: cartBookingProducts.reduce(
                                  (acc: string[], { shopProductId }) => {
                                    if (shopProductId) {
                                      return [...acc, `${shopProductId}`];
                                    }
                                    return acc;
                                  },
                                  [],
                                ),
                                onError: () => setFieldValue(giftCertificateFieldName, ''),
                                onSuccess: (promoCode) => {
                                  console.log(promoCode);
                                },
                              });
                            }}
                          >
                            Применить
                          </WpButton>
                        </div>
                        {shop.promoCode && shop.promoCode.description ? (
                          <div className='mt-4 text-secondary-text'>
                            {shop.promoCode.description}
                          </div>
                        ) : null}
                      </InputLine>
                    </div>
                  </LayoutCard>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

interface OneShopCompanyCartInterface extends OneShopCompanyCartFormInterface {
  cart: CartInterface;
  tabIndex: CartTabIndexType;
  domainCompany: CompanyInterface;
}

const OneShopCompanyCart: React.FC<OneShopCompanyCartInterface> = ({
  cart,
  domainCompany,
  tabIndex,
}) => {
  if (!domainCompany.mainShop) {
    return <RequestError message={'Ошибака загрузки данных магазина'} />;
  }

  const { cartBookingProducts, cartDeliveryProducts } = cart;

  return (
    <div>
      {/* delivery form */}
      {cartDeliveryProducts.length > 0 && tabIndex === 0 ? (
        <OneShopCompanyDeliveryCart cart={cart} domainCompany={domainCompany} />
      ) : null}

      {/* booking form */}
      {cartBookingProducts.length > 0 && tabIndex === 1 ? (
        <OneShopCompanyBookingCart cart={cart} domainCompany={domainCompany} />
      ) : null}
    </div>
  );
};

export default OneShopCompanyCart;
