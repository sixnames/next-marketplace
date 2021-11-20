import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/button/Button';
import ButtonCross from 'components/button/ButtonCross';
import ControlButton from 'components/button/ControlButton';
import CartAside from 'components/CartAside';
import CartShopsList from 'components/CartShopsList';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { MapModalInterface } from 'components/Modal/MapModal';
import Notification from 'components/Notification';
import ProductShopPrices from 'components/ProductShopPrices';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import WpImage from 'components/WpImage';
import { ROUTE_PROFILE } from 'config/common';
import { MAP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { MakeAnOrderInputInterface } from 'db/dao/order/makeAnOrder';
import {
  CartInterface,
  CartProductInterface,
  CompanyInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { Form, Formik, useFormikContext } from 'formik';
import { useShopMarker } from 'hooks/useShopMarker';
import LayoutCard from 'layout/LayoutCard';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';
import { noNaN } from 'lib/numbers';
import { phoneToRaw } from 'lib/phoneUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

interface CartProductFrameInterface {
  cartProductId: string;
  isShopsVisible?: boolean;
  mainImage: string;
  snippetTitle?: string | null;
  shopProducts?: ShopProductInterface[] | null;
  testId: number | string;
  slug: string;
}

const CartProductFrame: React.FC<CartProductFrameInterface> = ({
  cartProductId,
  children,
  isShopsVisible,
  mainImage,
  snippetTitle,
  shopProducts,
  testId,
  slug,
}) => {
  const { deleteProductFromCart, urlPrefix } = useSiteContext();

  return (
    <div className='space-y-4'>
      <LayoutCard
        className='grid px-6 py-8 gap-6 sm:grid-cols-8 relative min-h-[311px]'
        testId={'cart-product'}
      >
        {/*image*/}
        <div className='flex flex-col gap-4 items-center justify-center sm:col-span-2'>
          <div className='relative flex justify-center flex-shrink-0 w-full max-w-[180px]'>
            <div className='relative pb-[100%] w-full'>
              <WpImage
                url={mainImage}
                alt={`${snippetTitle}`}
                title={`${snippetTitle}`}
                width={240}
                className='absolute inset-0 w-full h-full object-contain'
              />
            </div>

            <Link
              target={'_blank'}
              className='block absolute z-10 inset-0 text-indent-full'
              href={`${urlPrefix}/${slug}`}
            >
              {snippetTitle}
            </Link>
          </div>
        </div>

        {/*main data*/}
        <div className='sm:col-span-6 flex flex-col'>{children}</div>

        {/*remove button*/}
        <ButtonCross
          testId={`cart-product-${testId}-remove-from-cart`}
          iconSize={'small'}
          className='absolute top-0 right-0 z-30'
          onClick={() => {
            deleteProductFromCart({
              cartProductId,
            });
          }}
        />
      </LayoutCard>

      {isShopsVisible ? (
        <CartShopsList shopProducts={shopProducts || []} cartProductId={cartProductId} />
      ) : null}
    </div>
  );
};

interface CartProductMainDataInterface {
  itemId: string;
  snippetTitle?: string | null;
  slug: string;
  name?: string | null;
}

const CartProductMainData: React.FC<CartProductMainDataInterface> = ({
  itemId,
  snippetTitle,
  slug,
  name,
}) => {
  const { urlPrefix } = useSiteContext();
  return (
    <React.Fragment>
      <div className='text-secondary-text mb-3'>{`Артикул: ${itemId}`}</div>
      <div className='mb-6'>
        <Link
          target={'_blank'}
          className='block text-primary-text hover:no-underline hover:text-primary-text font-medium text-lg lg:text-2xl'
          href={`${urlPrefix}/${slug}`}
        >
          {snippetTitle}
        </Link>
        {name ? <div className='text-secondary-text mt-1'>{name}</div> : null}
      </div>
    </React.Fragment>
  );
};

interface CartProductPropsInterface {
  cartProduct: CartProductInterface;
  testId: number | string;
}

const CartShoplessProduct: React.FC<CartProductPropsInterface> = ({ cartProduct, testId }) => {
  const [isShopsVisible, setIsShopsVisible] = React.useState<boolean>(false);
  const { product, _id } = cartProduct;
  if (!product) {
    return null;
  }

  const { itemId, snippetTitle, shopProducts, cardPrices, shopsCount, mainImage, slug } = product;

  return (
    <CartProductFrame
      slug={slug}
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={mainImage}
      snippetTitle={snippetTitle}
      shopProducts={shopProducts}
      isShopsVisible={isShopsVisible}
    >
      <CartProductMainData
        name={product.name}
        slug={slug}
        itemId={itemId}
        snippetTitle={snippetTitle}
      />

      <div className='flex flex-wrap gap-6 mb-4 items-center'>
        <div>
          <div className='text-secondary-text'>Цена за ед.</div>
          <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
        </div>

        <div className='flex justify-center items-center gap-4'>
          <ControlButton iconSize={'mid'} icon={'compare'} />
          <ControlButton iconSize={'mid'} icon={'heart'} />
        </div>
      </div>

      <Button
        onClick={() => {
          setIsShopsVisible(true);
        }}
        testId={`cart-product-${testId}-show-shops`}
      >
        Выбрать магазин
      </Button>
    </CartProductFrame>
  );
};

interface CartProductPropsWithAmountInterface extends CartProductPropsInterface {
  fieldName: string;
}

const CartProduct: React.FC<CartProductPropsWithAmountInterface> = ({
  cartProduct,
  fieldName,
  testId,
}) => {
  const { setFieldValue } = useFormikContext();
  const marker = useShopMarker(cartProduct.shopProduct?.shop);
  const { configs } = useConfigContext();
  const { showModal } = useAppContext();
  const { updateProductInCart } = useSiteContext();
  const { shopProduct, amount, _id } = cartProduct;
  const minAmount = 1;

  if (!shopProduct) {
    return null;
  }

  const { price, oldPrice, discountedPercent, available, shop, itemId, product } = shopProduct;

  if (!shop || !product) {
    return null;
  }

  return (
    <CartProductFrame
      slug={product.slug}
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={product.mainImage}
      snippetTitle={product.snippetTitle}
    >
      <CartProductMainData
        name={product.name}
        slug={product.slug}
        itemId={itemId}
        snippetTitle={product.snippetTitle}
      />

      <div className='flex flex-wrap gap-6 mt-auto'>
        {/*amount input*/}
        <div>
          <SpinnerInput
            name={'amount'}
            value={amount}
            min={minAmount}
            max={noNaN(available)}
            testId={`cart-product-${testId}-amount`}
            plusTestId={`cart-product-${testId}-plus`}
            minusTestId={`cart-product-${testId}-minus`}
            frameClassName='w-[var(--buttonMinWidth)]'
            onChange={(e) => {
              const amount = noNaN(e.target.value);
              if (amount >= minAmount && amount <= noNaN(available)) {
                setFieldValue(fieldName, amount);
                updateProductInCart({
                  amount,
                  cartProductId: _id,
                });
              }
            }}
          />
        </div>

        <div>
          {/*shop product price*/}
          <div className='text-secondary-text'>Цена за ед.</div>
          <ProductShopPrices
            price={price}
            oldPrice={oldPrice}
            discountedPercent={discountedPercent}
          />
          {/*available*/}
          <div className='text-secondary-text'>{`В наличии ${available} шт`}</div>
        </div>

        <div className='flex justify-center items-center gap-4'>
          <ControlButton iconSize={'mid'} icon={'compare'} />
          <ControlButton iconSize={'mid'} icon={'heart'} />
        </div>
      </div>

      {/*shop info*/}
      {configs.isOneShopCompany ? null : (
        <div className='mt-4'>
          <div className='mb-2'>
            Магазин: <span className='font-medium text-lg'>{shop.name}</span>
          </div>
          <div>{shop.address.formattedAddress}</div>
          <div
            className='text-theme cursor-pointer'
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
            Смотреть на карте
          </div>
        </div>
      )}
    </CartProductFrame>
  );
};

interface MakeOrderFormInterface
  extends CartInterface,
    Omit<MakeAnOrderInputInterface, 'allowDelivery' | 'cartProductsFieldName'> {}

interface CartPageConsumerInterface {
  domainCompany?: CompanyInterface | null;
}

const CartPageConsumer: React.FC<CartPageConsumerInterface> = ({ domainCompany }) => {
  const router = useRouter();
  const { cart, loadingCart, urlPrefix, makeAnOrder } = useSiteContext();
  const [rendered, setRendered] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const sessionUser = useSiteUserContext();
  const { configs } = useConfigContext();
  const disabled = !!sessionUser;

  React.useEffect(() => {
    if (cart && !rendered) {
      if (cart.cartDeliveryProducts.length > 0) {
        setTabIndex(0);
        setRendered(true);
        return;
      }
      setTabIndex(1);
      setRendered(true);
    }
  }, [cart, rendered]);

  if (loadingCart && !cart) {
    return (
      <div>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Spinner isNested isTransparent />
        </Inner>
      </div>
    );
  }

  if (!cart) {
    return (
      <div>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <RequestError message={'Загружаю корзину'} />
        </Inner>
      </div>
    );
  }

  const {
    cartBookingProducts,
    cartDeliveryProducts,
    isWithShoplessBooking,
    isWithShoplessDelivery,
  } = cart;

  if (cartBookingProducts.length < 1 && cartDeliveryProducts.length < 1) {
    return (
      <div>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Title>Корзина пуста</Title>
          <div className='flex gap-4 flex-wrap'>
            <Button
              frameClassName='w-auto'
              theme={'secondary'}
              onClick={() => {
                router.push(urlPrefix).catch(console.log);
              }}
            >
              Продолжить покупки
            </Button>
            <Button
              frameClassName='w-auto'
              theme={'secondary'}
              onClick={() => {
                router.push(`${urlPrefix}${ROUTE_PROFILE}`).catch(console.log);
              }}
            >
              Мои заказы
            </Button>
          </div>
        </Inner>
      </div>
    );
  }

  return (
    <div className='mb-12'>
      <Breadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        <Formik<MakeOrderFormInterface>
          enableReinitialize={true}
          initialValues={{
            ...cart,
            name: sessionUser ? sessionUser.me.name : '',
            lastName: sessionUser ? sessionUser.me.lastName : '',
            email: sessionUser ? sessionUser.me.email : '',
            phone: sessionUser ? sessionUser.me.phone : '',
            comment: '',
            reservationDate: null,
          }}
          onSubmit={(values) => {
            if (tabIndex === 0) {
              makeAnOrder({
                name: values.name,
                lastName: values.lastName,
                email: values.email,
                reservationDate: values.reservationDate,
                comment: values.comment,
                phone: phoneToRaw(values.phone),
                companySlug: domainCompany?.slug,
                allowDelivery: true,
                cartProductsFieldName: 'cartDeliveryProducts',
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
              companySlug: domainCompany?.slug,
              allowDelivery: false,
              cartProductsFieldName: 'cartBookingProducts',
            });
          }}
        >
          {({ values }) => {
            const {
              cartDeliveryProducts,
              cartBookingProducts,
              totalDeliveryPrice,
              totalBookingPrice,
            } = values;

            return (
              <Form>
                <div className='grid md:grid-cols-8 lg:grid-cols-16 gap-6'>
                  <div className='md:col-span-5 lg:col-span-11' data-cy={'cart-products'}>
                    <div className='mb-10'>
                      {/*tabs*/}
                      <div className='flex flex-wrap gap-6'>
                        {cartDeliveryProducts.length > 0 ? (
                          <div
                            className={`transition-all cursor-pointer ${
                              tabIndex === 0 ? 'text-theme' : 'text-secondary-text'
                            }`}
                            onClick={() => {
                              setTabIndex(0);
                            }}
                          >
                            <Title tag={'div'} size={'small'}>
                              Корзина {cartDeliveryProducts.length} шт.
                            </Title>
                          </div>
                        ) : null}

                        {cartBookingProducts.length > 0 ? (
                          <div
                            className={`transition-all cursor-pointer ${
                              tabIndex === 1 ? 'text-theme' : 'text-secondary-text'
                            }`}
                            onClick={() => {
                              setTabIndex(1);
                            }}
                          >
                            <Title tag={'div'} size={'small'}>
                              Бронирование {cartBookingProducts.length} шт.
                            </Title>
                          </div>
                        ) : null}
                      </div>

                      {/*cart products*/}
                      {cartDeliveryProducts.length > 0 && tabIndex === 0 ? (
                        <div className='grid gap-6'>
                          <div className='flex items-center gap-4 text-lg font-medium'>
                            <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                              1
                            </div>
                            <div>Товары</div>
                          </div>

                          {cartDeliveryProducts.map((cartProduct, index) => {
                            const { _id, shopProduct } = cartProduct;

                            if (!shopProduct) {
                              return (
                                <CartShoplessProduct
                                  testId={index}
                                  cartProduct={cartProduct}
                                  key={`${_id}`}
                                />
                              );
                            }

                            return (
                              <CartProduct
                                fieldName={`cartDeliveryProducts[${index}].amount`}
                                testId={index}
                                cartProduct={cartProduct}
                                key={`${_id}`}
                              />
                            );
                          })}
                        </div>
                      ) : null}

                      {/*booking products*/}
                      {cartBookingProducts.length > 0 && tabIndex === 1 ? (
                        <div className='grid gap-6'>
                          <div className='flex items-center gap-4 text-lg font-medium'>
                            <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                              1
                            </div>
                            <div>Товары</div>
                          </div>

                          {cartBookingProducts.map((cartProduct, index) => {
                            const { _id, shopProduct } = cartProduct;

                            if (!shopProduct) {
                              return (
                                <CartShoplessProduct
                                  testId={index}
                                  cartProduct={cartProduct}
                                  key={`${_id}`}
                                />
                              );
                            }

                            return (
                              <CartProduct
                                fieldName={`cartBookingProducts[${index}].amount`}
                                testId={index}
                                cartProduct={cartProduct}
                                key={`${_id}`}
                              />
                            );
                          })}

                          <Notification
                            variant={'success'}
                            message={'Текущая цена на сайте может отличаться от цены на кассе'}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className='relative z-20'>
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
                      </div>
                    </div>
                  </div>

                  {/*cart aside*/}
                  <div className='md:col-span-3 lg:col-span-5'>
                    {tabIndex === 0 ? (
                      <CartAside
                        buyButtonText={'Оформить заказ'}
                        productsCount={cartDeliveryProducts.length}
                        totalPrice={totalDeliveryPrice}
                        isWithShopless={isWithShoplessDelivery}
                      />
                    ) : (
                      <CartAside
                        isBooking
                        buyButtonText={configs.buyButtonText}
                        productsCount={cartBookingProducts.length}
                        totalPrice={totalBookingPrice}
                        isWithShopless={isWithShoplessBooking}
                      />
                    )}
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </div>
  );
};

interface CartPageInterface extends SiteLayoutProviderInterface, CartPageConsumerInterface {}

const CartPage: NextPage<CartPageInterface> = (props) => {
  return (
    <SiteLayout title={'Корзина'} {...props}>
      <CartPageConsumer domainCompany={props.domainCompany} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CartPageInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default CartPage;
