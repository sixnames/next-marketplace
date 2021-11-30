import { CartProduct, CartShoplessProduct } from 'components/cart/CartProduct';
import CartAside from 'components/CartAside';
import FakeInput from 'components/FormElements/Input/FakeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import { MapModalInterface } from 'components/Modal/MapModal';
import Notification from 'components/Notification';
import {
  DEFAULT_COMPANY_SLUG,
  ORDER_DELIVERY_VARIANT_PICKUP,
  ORDER_PAYMENT_VARIANT_RECEIPT,
} from 'config/common';
import { DELIVERY_VARIANT_OPTIONS, PAYMENT_VARIANT_OPTIONS } from 'config/constantSelects';
import { MAP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { MakeAnOrderShopConfigInterface } from 'db/dao/order/makeAnOrder';
import { CartInterface, CartProductInterface, ShopInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useShopMarker } from 'hooks/useShopMarker';
import LayoutCard from 'layout/LayoutCard';
import { phoneToRaw } from 'lib/phoneUtils';
import { CartTabIndexType, MakeOrderFormInterface } from 'pages/[companySlug]/[citySlug]/cart';
import * as React from 'react';

interface DefaultCartShopInterface
  extends MakeAnOrderShopConfigInterface,
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
  const marker = useShopMarker(shop);
  const { showModal } = useAppContext();

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
          {shop.address.formattedAddress}
          <div className='text-theme'>Показать на карте</div>
        </div>

        {allowDelivery ? (
          <div className='lg:grid grid-cols-2 gap-x-6 mt-6'>
            <FormikSelect
              low
              label={'Способ получения'}
              name={'shopConfigs[0].deliveryVariant'}
              options={DELIVERY_VARIANT_OPTIONS}
              isRequired
            />

            <FormikSelect
              low
              label={'Оплата'}
              name={'shopConfigs[0].paymentVariant'}
              options={PAYMENT_VARIANT_OPTIONS}
              isRequired
            />
          </div>
        ) : (
          <div className='lg:grid grid-cols-2 gap-x-6 mt-6'>
            <FormikSelect
              low
              label={'Способ получения'}
              name={'shopConfigs[0].deliveryVariant'}
              options={DELIVERY_VARIANT_OPTIONS}
              disabled
            />

            <FakeInput low label={'Оплата'} value={'Оплата при получении'} />
          </div>
        )}

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
        cartProducts: [cartProduct],
        deliveryVariant: ORDER_DELIVERY_VARIANT_PICKUP,
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
              allowDelivery: true,
              cartProductsFieldName: 'cartDeliveryProducts',
            });
          }}
        >
          {({ values }) => {
            const { cartDeliveryProducts, totalDeliveryPrice, shopConfigs } = values;

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
                    <CartAside
                      buyButtonText={'Оформить заказ'}
                      productsCount={cart.cartDeliveryProducts.length}
                      totalPrice={totalDeliveryPrice}
                      isWithShopless={cart.isWithShoplessDelivery}
                    />
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
                    <CartAside
                      isBooking
                      buyButtonText={configs.buyButtonText}
                      productsCount={cart.cartBookingProducts.length}
                      totalPrice={totalBookingPrice}
                      isWithShopless={cart.isWithShoplessBooking}
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

export default DefaultCart;
