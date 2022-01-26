import { Form, Formik, useFormikContext } from 'formik';
import * as React from 'react';
import { get } from 'lodash';
import {
  DEFAULT_COMPANY_SLUG,
  ORDER_DELIVERY_VARIANT_COURIER,
  ORDER_PAYMENT_VARIANT_RECEIPT,
} from '../../config/common';
import { DELIVERY_VARIANT_OPTIONS, PAYMENT_VARIANT_OPTIONS } from '../../config/constantSelects';
import { MAP_MODAL, ORDER_DELIVERY_ADDRESS_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useConfigContext } from '../../context/configContext';
import { useSiteContext } from '../../context/siteContext';
import { useSiteUserContext } from '../../context/siteUserContext';
import { MakeAnOrderShopConfigInterface } from '../../db/dao/orders/makeAnOrder';
import { OrderDeliveryInfoModel } from '../../db/dbModels';
import { CartInterface, CartProductInterface, ShopInterface } from '../../db/uiInterfaces';
import { useShopMarker } from '../../hooks/useShopMarker';
import useValidationSchema from '../../hooks/useValidationSchema';
import LayoutCard from '../../layout/LayoutCard';
import { noNaN } from '../../lib/numbers';
import { phoneToRaw } from '../../lib/phoneUtils';
import { CartTabIndexType, MakeOrderFormInterface } from '../../pages/cart';
import { makeAnOrderSchema } from '../../validation/orderSchema';
import WpButton from '../button/WpButton';
import CartAside, { UseCartAsideDiscountsValuesInterface } from '../CartAside';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikInput from '../FormElements/Input/FormikInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikSelect from '../FormElements/Select/FormikSelect';
import FormikTextarea from '../FormElements/Textarea/FormikTextarea';
import { MapModalInterface } from '../Modal/MapModal';
import { OrderDeliveryAddressModalInterface } from '../Modal/OrderDeliveryAddressModal';
import OrderDeliveryInfo from '../order/OrderDeliveryInfo';
import WpNotification from '../WpNotification';
import { CartProduct, CartShoplessProduct } from './CartProduct';

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
      <div className='mt-6 grid gap-6 lg:grid-cols-2' id={`delivery-fields-${index}`}>
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
          <WpNotification
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

          <WpButton
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
          </WpButton>
        </div>
      ) : null}
    </div>
  );
};

export interface DefaultCartShopInterface
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
  cartId: string;
}
const DefaultCartShop: React.FC<DefaultCartShopUIInterface> = ({
  shop,
  showPriceWarning,
  index,
  allowDelivery,
  cartId,
}) => {
  const marker = useShopMarker(shop);
  const { showModal } = useAppContext();
  const { values, setFieldValue } = useFormikContext();
  const { checkGiftCertificate, checkPromoCode } = useSiteContext();
  const promoCodeFieldName = `shopConfigs[${index}].promoCode.code`;
  const giftCertificateFieldName = `shopConfigs[${index}].giftCertificateCode`;
  const giftCertificateValueFieldName = `shopConfigs[${index}].giftCertificateDiscount`;
  const giftCertificateCode = get(values, giftCertificateFieldName);
  const promoCodeCode = get(values, promoCodeFieldName);

  return (
    <LayoutCard key={`${shop._id}`}>
      {/*shop info*/}
      <div className='border-b border-border-200 py-8 px-6'>
        <div className='mb-2'>
          Магазин: <span className='text-lg font-medium'>{shop.name}</span>
        </div>
        <div
          className='cursor-pointer transition-all hover:text-theme'
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

        <div className='mt-6 grid gap-4 lg:grid-cols-2'>
          <div>
            <InputLine
              low
              labelTag={'div'}
              label={'Подарочный сертификат'}
              lineContentClass='flex flex-col sm:flex-row gap-4 sm:items-center'
            >
              <div className='flex-grow'>
                <FormikInput
                  size={'small'}
                  testId={`gift-certificate-input-${shop.slug}`}
                  name={giftCertificateFieldName}
                  low
                />
              </div>
              <WpButton
                size={'small'}
                frameClassName='w-auto'
                theme={'secondary'}
                testId={`gift-certificate-confirm-${shop.slug}`}
                onClick={() => {
                  checkGiftCertificate({
                    code: giftCertificateCode,
                    companyId: `${shop.companyId}`,
                    cartId,
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
          </div>

          <div>
            <InputLine low labelTag={'div'} label={'Промокод'}>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                <div className='flex-grow'>
                  <FormikInput
                    testId={`promo-code-input-${shop.slug}`}
                    readOnly={Boolean(shop.promoCode?._id)}
                    size={'small'}
                    name={promoCodeFieldName}
                    low
                  />
                </div>
                <WpButton
                  testId={`promo-code-submit-${shop.slug}`}
                  disabled={Boolean(shop.promoCode?._id)}
                  size={'small'}
                  frameClassName='w-auto'
                  theme={'secondary'}
                  onClick={() => {
                    checkPromoCode({
                      code: promoCodeCode,
                      companyId: `${shop.companyId}`,
                      cartId,
                      shopProductIds: shop.cartProducts.reduce(
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
                <div className='mt-4 text-secondary-text'>{shop.promoCode.description}</div>
              ) : null}
            </InputLine>
          </div>
        </div>

        {allowDelivery ? <CartDeliveryFields inShop index={index} /> : null}

        {showPriceWarning && shop.priceWarning ? (
          <div className='mt-6'>
            <WpNotification
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

      const giftCertificate = (cart.giftCertificates || []).find(({ companyId }) => {
        return companyId === shop.companyId;
      });

      const promoCode = (cart.promoCodes || []).find((promoCodeItem) => {
        return promoCodeItem.companyId === shop.companyId;
      });

      // add new shop config
      const newShopConfig: DefaultCartShopInterface = {
        ...shop,
        _id: `${shop._id}`,
        giftCertificateDiscount: giftCertificate?.value || 0,
        giftCertificateCode: giftCertificate?.code || '',
        cartProducts: [cartProduct],
        deliveryVariant: ORDER_DELIVERY_VARIANT_COURIER,
        paymentVariant: ORDER_PAYMENT_VARIANT_RECEIPT,
        promoCode,
      };
      shopConfigs.push(newShopConfig);
    });

    return {
      ...cart,
      name: sessionUser ? sessionUser.me.name : '',
      lastName: sessionUser ? sessionUser.me.lastName : '',
      secondName: sessionUser ? sessionUser.me.secondName : '',
      email: sessionUser ? sessionUser.me.email : '',
      phone: sessionUser ? sessionUser.me.phone : '',
      comment: '',
      reservationDate: null,
      privacy: false,
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
              secondName: values.secondName,
              email: values.email,
              reservationDate: values.reservationDate,
              comment: values.comment,
              phone: phoneToRaw(values.phone),
              privacy: values.privacy,
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
                return acc + noNaN(giftCertificateDiscount);
              },
              0,
            );

            return (
              <Form>
                <div className='mb-6 flex items-center gap-4 text-lg font-medium'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-secondary'>
                    1
                  </div>
                  <div>Товары</div>
                </div>

                <div className='grid gap-6 md:grid-cols-8 lg:grid-cols-16'>
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
                              cartId={`${cart._id}`}
                              allowDelivery
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className='relative z-20 mb-12' id={'cart-inputs'}>
                      <div className='mb-8 flex items-center gap-4 text-lg font-medium'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-secondary'>
                          2
                        </div>
                        <div>Личные данные</div>
                      </div>

                      <div className='grid-cols-2 gap-x-6 lg:grid'>
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
                          disabled={disabled}
                          name={'secondName'}
                          label={'Отчество'}
                          testId={'secondName'}
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

                        <FormikCheckboxLine
                          lineClassName='self-end'
                          testId={'order-form-privacy'}
                          label={'Даю согласие на обработку личных данных'}
                          name={'privacy'}
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
                    <div className='lef-0 sticky top-16'>
                      <CartAside
                        buyButtonText={'Оформить заказ'}
                        productsCount={cart.cartDeliveryProducts.length}
                        totalPrice={totalDeliveryPrice}
                        isWithShopless={cart.isWithShoplessDelivery}
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
              secondName: values.secondName,
              email: values.email,
              reservationDate: values.reservationDate,
              comment: values.comment,
              phone: phoneToRaw(values.phone),
              companySlug: domainCompany?.slug || DEFAULT_COMPANY_SLUG,
              shopConfigs: values.shopConfigs,
              privacy: values.privacy,
              allowDelivery: false,
              cartProductsFieldName: 'cartBookingProducts',
            });
          }}
        >
          {({ values, errors }) => {
            console.log(errors);
            const { cartBookingProducts, totalBookingPrice, shopConfigs } = values;
            const giftCertificateDiscount = shopConfigs.reduce(
              (acc: number, { giftCertificateDiscount }) => {
                return acc + noNaN(giftCertificateDiscount);
              },
              0,
            );

            return (
              <Form>
                <div className='mb-6 flex items-center gap-4 text-lg font-medium'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-secondary'>
                    1
                  </div>
                  <div>Товары</div>
                </div>

                <div className='grid gap-6 md:grid-cols-8 lg:grid-cols-16'>
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
                              cartId={`${cart._id}`}
                              showPriceWarning
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className='relative z-20 mb-12' id={'cart-inputs'}>
                      <div className='mb-8 flex items-center gap-4 text-lg font-medium'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-secondary'>
                          2
                        </div>
                        <div>Личные данные</div>
                      </div>

                      <div className='grid-cols-2 gap-x-6 lg:grid'>
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
                          disabled={disabled}
                          name={'secondName'}
                          label={'Отчество'}
                          testId={'secondName'}
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

                        <FormikCheckboxLine
                          lineClassName='self-end'
                          testId={'order-form-privacy'}
                          label={'Даю согласие на обработку личных данных'}
                          name={'privacy'}
                        />

                        <FormikTextarea
                          testId={'order-form-comment'}
                          name={'comment'}
                          label={'Комментарий к заказу'}
                        />
                      </div>

                      <WpNotification
                        variant={'success'}
                        message={
                          'Для полученя забронированного товара необходим документ подтверждающий личность.'
                        }
                      />
                    </div>
                  </div>

                  {/*cart aside*/}
                  <div className='md:col-span-3 lg:col-span-5'>
                    <div className='lef-0 sticky top-16'>
                      <CartAside
                        isBooking
                        buyButtonText={configs.buyButtonText}
                        productsCount={cart.cartBookingProducts.length}
                        totalPrice={totalBookingPrice}
                        isWithShopless={cart.isWithShoplessBooking}
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
