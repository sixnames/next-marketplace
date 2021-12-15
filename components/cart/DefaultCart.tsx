import Button from 'components/button/Button';
import { CartProduct, CartShoplessProduct } from 'components/cart/CartProduct';
import CartAside, { UseCartAsideDiscountsValuesInterface } from 'components/CartAside';
import FormikInput from 'components/FormElements/Input/FormikInput';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import { MapModalInterface } from 'components/Modal/MapModal';
import { OrderDeliveryAddressModalInterface } from 'components/Modal/OrderDeliveryAddressModal';
import Notification from 'components/Notification';
import OrderDeliveryInfo from 'components/order/OrderDeliveryInfo';
import {
  DEFAULT_COMPANY_SLUG,
  ORDER_DELIVERY_VARIANT_COURIER,
  ORDER_PAYMENT_VARIANT_RECEIPT,
} from 'config/common';
import { DELIVERY_VARIANT_OPTIONS, PAYMENT_VARIANT_OPTIONS } from 'config/constantSelects';
import { MAP_MODAL, ORDER_DELIVERY_ADDRESS_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/siteUserContext';
import { MakeAnOrderShopConfigInterface } from 'db/dao/order/makeAnOrder';
import { OrderDeliveryInfoModel } from 'db/dbModels';
import { CartInterface, CartProductInterface, ShopInterface } from 'db/uiInterfaces';
import { Form, Formik, useFormikContext } from 'formik';
import { useCheckGiftCertificateMutation } from 'hooks/mutations/useGiftCertificateMutations';
import { useShopMarker } from 'hooks/useShopMarker';
import useValidationSchema from 'hooks/useValidationSchema';
import LayoutCard from 'layout/LayoutCard';
import { phoneToRaw } from 'lib/phoneUtils';
import { CartTabIndexType, MakeOrderFormInterface } from 'pages/[companySlug]/[citySlug]/cart';
import * as React from 'react';
import { get } from 'lodash';
import { makeAnOrderSchema } from 'validation/orderSchema';

interface CartDeliveryFieldsInterface {
  index: number;
  inShop?: boolean;
}

export const CartDeliveryFields: React.FC<CartDeliveryFieldsInterface> = ({ index, inShop }) => {
  const { showModal, hideModal } = useAppContext();
  const { values, setFieldValue, setFieldError, errors } = useFormikContext();
  const deliveryVariantFieldName = `shopConfigs[${index}].deliveryVariant`;
  const deliveryVariant = get(values, deliveryVariantFieldName);
  const deliveryInfo = get(
    values,
    `shopConfigs[${index}].deliveryInfo`,
  ) as OrderDeliveryInfoModel | null;
  const shopAddressError = get(errors, `shopConfigs[${index}]`);

  return (
    <div>
      <div className='grid lg:grid-cols-2 gap-6 mt-6'>
        <FormikSelect
          low
          label={'Способ получения'}
          name={`shopConfigs[${index}].deliveryVariant`}
          options={DELIVERY_VARIANT_OPTIONS}
          isRequired
          showInlineError
        />

        <FormikSelect
          low
          label={'Оплата'}
          name={`shopConfigs[${index}].paymentVariant`}
          options={PAYMENT_VARIANT_OPTIONS}
          isRequired
        />
      </div>

      {shopAddressError ? (
        <div className='mt-6'>
          <Notification
            className={inShop ? 'dark:bg-primary' : ''}
            variant={'error'}
            message={shopAddressError}
          />
        </div>
      ) : null}

      {deliveryVariant === ORDER_DELIVERY_VARIANT_COURIER ? (
        <div className='mt-4'>
          <OrderDeliveryInfo
            itemClassName={'flex gap-4'}
            deliveryInfo={deliveryInfo}
            className={'mb-4'}
          />

          <Button
            size={'small'}
            theme={deliveryInfo ? 'gray' : 'primary'}
            onClick={() => {
              showModal<OrderDeliveryAddressModalInterface>({
                variant: ORDER_DELIVERY_ADDRESS_MODAL,
                props: {
                  deliveryInfo,
                  confirm: (values) => {
                    setFieldValue(`shopConfigs[${index}].deliveryInfo`, values);
                    setFieldError(`shopConfigs[${index}]`, undefined);
                    hideModal();
                  },
                },
              });
            }}
          >
            {deliveryInfo ? 'Изменить адрес' : 'Указать адрес'}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

interface DefaultCartShopInterface
  extends MakeAnOrderShopConfigInterface,
    UseCartAsideDiscountsValuesInterface,
    Omit<ShopInterface, '_id'> {
  cartProducts: CartProductInterface[];
}

interface DefaultCartInitialValuesInterface extends MakeOrderFormInterface {
  shopConfigs: DefaultCartShopInterface[];
}

interface DefaultCartShopUIInterface {
  shop: DefaultCartShopInterface;
  index: number;
  showPriceWarning?: boolean;
  allowDelivery: boolean;
}
const DefaultCartShop: React.FC<DefaultCartShopUIInterface> = ({
  shop,
  showPriceWarning,
  index,
  allowDelivery,
}) => {
  const sessionUser = useSiteUserContext();
  const marker = useShopMarker(shop);
  const { showModal } = useAppContext();
  const { values, setFieldValue } = useFormikContext();
  const giftCertificateFieldName = `shopConfigs[${index}].giftCertificate`;
  const giftCertificateValueFieldName = `shopConfigs[${index}].giftCertificateDiscount`;
  const giftCertificateCode = get(values, giftCertificateFieldName);

  const [checkGiftCertificateMutation] = useCheckGiftCertificateMutation();

  return (
    <LayoutCard key={`${shop._id}`}>
      {/*shop info*/}
      <div className='py-8 px-6 border-b border-border-200'>
        <div className='mb-2'>
          Магазин: <span className='font-medium text-lg'>{shop.name}</span>
        </div>
        <div
          className='cursor-pointer hover:text-theme transition-all'
          onClick={() => {
            showModal<MapModalInterface>({
              variant: MAP_MODAL,
              props: {
                title: shop.name,
                testId: `shop-map-modal`,
                markers: [
                  {
                    _id: shop._id,
                    icon: marker,
                    name: shop.name,
                    address: shop.address,
                  },
                ],
              },
            });
          }}
        >
          {shop.address.readableAddress}
          <div className='text-theme'>Показать на карте</div>
        </div>

        <div className='grid lg:grid-cols-2 gap-4 mt-6'>
          <div>
            <InputLine
              low
              labelTag={'div'}
              label={'Подарочный сертификат'}
              lineContentClass='flex flex-col sm:flex-row gap-4 sm:items-end'
            >
              <div className='flex-grow'>
                <FormikInput name={giftCertificateFieldName} low />
              </div>
              <Button
                frameClassName='w-auto'
                theme={'secondary'}
                onClick={() => {
                  checkGiftCertificateMutation({
                    userId: sessionUser ? `${sessionUser.me._id}` : null,
                    code: giftCertificateCode,
                    companyId: `${shop.companyId}`,
                  })
                    .then((response) => {
                      if (!response || !response.success || !response.payload) {
                        setFieldValue(giftCertificateFieldName, '');
                        return;
                      }
                      setFieldValue(giftCertificateValueFieldName, response.payload.value);
                    })
                    .catch(console.log);
                }}
              >
                Применить
              </Button>
            </InputLine>
          </div>

          <div>
            <InputLine
              low
              labelTag={'div'}
              label={'Промокод'}
              lineContentClass='flex flex-col sm:flex-row gap-4 sm:items-end'
            >
              <div className='flex-grow'>
                <FormikInput name={`shopConfigs[${index}].promoCode`} low />
              </div>
              <Button
                frameClassName='w-auto'
                theme={'secondary'}
                onClick={() => {
                  console.log('Применить');
                }}
              >
                Применить
              </Button>
            </InputLine>
          </div>
        </div>

        {allowDelivery ? <CartDeliveryFields inShop index={index} /> : null}

        {showPriceWarning && shop.priceWarning ? (
          <div className='mt-6'>
            <Notification
              className='dark:bg-primary'
              variant={'success'}
              message={shop.priceWarning}
            />
          </div>
        ) : null}
      </div>

      {/*shop cart products*/}
      <div className='divide-y divide-border-200'>
        {shop.cartProducts.map((cartProduct, cartProductIndex) => {
          return (
            <CartProduct
              defaultView
              shopIndex={index}
              fieldName={`shopConfigs[${index}].cartProducts[${cartProductIndex}].amount`}
              cartProduct={cartProduct}
              testId={`${index}${cartProductIndex}`}
              key={`${cartProduct._id}`}
            />
          );
        })}
      </div>
    </LayoutCard>
  );
};

interface DefaultCartInterface {
  cart: CartInterface;
  tabIndex: CartTabIndexType;
}

const DefaultCart: React.FC<DefaultCartInterface> = ({ cart, tabIndex }) => {
  const { makeAnOrder } = useSiteContext();
  const { configs, domainCompany } = useConfigContext();
  const sessionUser = useSiteUserContext();
  const disabled = !!sessionUser;
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });

  const initialValues = React.useMemo<DefaultCartInitialValuesInterface>(() => {
    const cartProductsFieldName = tabIndex === 0 ? 'cartDeliveryProducts' : 'cartBookingProducts';
    const initialCartProducts = cart[cartProductsFieldName];

    let shopConfigs: DefaultCartShopInterface[] = [];
    const shoplessCartProducts: CartProductInterface[] = [];

    initialCartProducts.forEach((cartProduct) => {
      // get shopless products
      if (!cartProduct.shopProduct) {
        shoplessCartProducts.push(cartProduct);
        return;
      }

      if (!cartProduct.shopProduct.shop) {
        return;
      }

      // group shop products by shop
      const shop = cartProduct.shopProduct.shop;

      // update existing shop config
      const existingShopConfigIndex = shopConfigs.findIndex(({ _id }) => {
        return _id === `${shop._id}`;
      });
      if (existingShopConfigIndex > -1) {
        const existingShopConfig = shopConfigs[existingShopConfigIndex];
        existingShopConfig.cartProducts.push(cartProduct);
        shopConfigs[existingShopConfigIndex] = existingShopConfig;
        return;
      }

      // add new shop config
      const newShopConfig: DefaultCartShopInterface = {
        ...shop,
        _id: `${shop._id}`,
        giftCertificateDiscount: 0,
        promoCodeDiscount: 0,
        cartProducts: [cartProduct],
        deliveryVariant: ORDER_DELIVERY_VARIANT_COURIER,
        paymentVariant: ORDER_PAYMENT_VARIANT_RECEIPT,
      };
      shopConfigs.push(newShopConfig);
    });

    return {
      ...cart,
      name: sessionUser ? sessionUser.me.name : '',
      lastName: sessionUser ? sessionUser.me.lastName : '',
      email: sessionUser ? sessionUser.me.email : '',
      phone: sessionUser ? sessionUser.me.phone : '',
      comment: '',
      reservationDate: null,
      shopConfigs,
      [cartProductsFieldName]: shoplessCartProducts,
    };
  }, [cart, tabIndex, sessionUser]);

  return (
    <div>
      {/* delivery form */}
      {cart.cartDeliveryProducts.length > 0 && tabIndex === 0 ? (
        <Formik<DefaultCartInitialValuesInterface>
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
              noAddressShopConfigs.forEach((index) => {
                setFieldError(`shopConfigs[${index}]`, 'Укажите адрес доставки');
              });
              return;
            }

            makeAnOrder({
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              reservationDate: values.reservationDate,
              comment: values.comment,
              phone: phoneToRaw(values.phone),
              companySlug: domainCompany?.slug || DEFAULT_COMPANY_SLUG,
              shopConfigs: values.shopConfigs,
              allowDelivery: true,
              cartProductsFieldName: 'cartDeliveryProducts',
            });
          }}
        >
          {({ values }) => {
            const { cartDeliveryProducts, totalDeliveryPrice, shopConfigs } = values;
            const giftCertificateDiscount = shopConfigs.reduce(
              (acc: number, { giftCertificateDiscount }) => {
                return acc + giftCertificateDiscount;
              },
              0,
            );
            const promoCodeDiscount = shopConfigs.reduce((acc: number, { promoCodeDiscount }) => {
              return acc + promoCodeDiscount;
            }, 0);

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
                      {/*shopless products*/}
                      <div className='grid gap-6' data-cy={'delivery-products'}>
                        {cartDeliveryProducts.map((cartProduct, index) => {
                          return (
                            <CartShoplessProduct
                              testId={index}
                              cartProduct={cartProduct}
                              key={`${cartProduct._id}`}
                            />
                          );
                        })}

                        {shopConfigs.map((shop, index) => {
                          return (
                            <DefaultCartShop
                              shop={shop}
                              index={index}
                              key={`${shop._id}`}
                              allowDelivery
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
                  </div>

                  {/*cart aside*/}
                  <div className='md:col-span-3 lg:col-span-5'>
                    <div className='sticky top-16 lef-0'>
                      <CartAside
                        buyButtonText={'Оформить заказ'}
                        productsCount={cart.cartDeliveryProducts.length}
                        totalPrice={totalDeliveryPrice}
                        isWithShopless={cart.isWithShoplessDelivery}
                        giftCertificateDiscount={giftCertificateDiscount}
                        promoCodeDiscount={promoCodeDiscount}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      ) : null}

      {/* booking form */}
      {cart.cartBookingProducts.length > 0 && tabIndex === 1 ? (
        <Formik<DefaultCartInitialValuesInterface>
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
              companySlug: domainCompany?.slug || DEFAULT_COMPANY_SLUG,
              shopConfigs: values.shopConfigs,
              allowDelivery: false,
              cartProductsFieldName: 'cartBookingProducts',
            });
          }}
        >
          {({ values }) => {
            const { cartBookingProducts, totalBookingPrice, shopConfigs } = values;
            const giftCertificateDiscount = shopConfigs.reduce(
              (acc: number, { giftCertificateDiscount }) => {
                return acc + giftCertificateDiscount;
              },
              0,
            );
            const promoCodeDiscount = shopConfigs.reduce((acc: number, { promoCodeDiscount }) => {
              return acc + promoCodeDiscount;
            }, 0);

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
                      {/*shopless products*/}
                      <div className='grid gap-6' data-cy={'delivery-products'}>
                        {cartBookingProducts.map((cartProduct, index) => {
                          return (
                            <CartShoplessProduct
                              testId={index}
                              cartProduct={cartProduct}
                              key={`${cartProduct._id}`}
                            />
                          );
                        })}

                        {shopConfigs.map((shop, index) => {
                          return (
                            <DefaultCartShop
                              shop={shop}
                              index={index}
                              key={`${shop._id}`}
                              allowDelivery={false}
                              showPriceWarning
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

                      <Notification
                        variant={'success'}
                        message={
                          'Для полученя забронированного товара необходим документ подтверждающий личность.'
                        }
                      />
                    </div>
                  </div>

                  {/*cart aside*/}
                  <div className='md:col-span-3 lg:col-span-5'>
                    <div className='sticky top-16 lef-0'>
                      <CartAside
                        isBooking
                        buyButtonText={configs.buyButtonText}
                        productsCount={cart.cartBookingProducts.length}
                        totalPrice={totalBookingPrice}
                        isWithShopless={cart.isWithShoplessBooking}
                        promoCodeDiscount={promoCodeDiscount}
                        giftCertificateDiscount={giftCertificateDiscount}
                      />
                    </div>
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

export default DefaultCart;
