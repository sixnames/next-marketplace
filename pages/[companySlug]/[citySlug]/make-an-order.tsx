import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/button/Button';
import ControlButton from 'components/button/ControlButton';
import Currency from 'components/Currency';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { MapModalInterface } from 'components/Modal/MapModal';
import ProductShopPrices from 'components/ProductShopPrices';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import WpImage from 'components/WpImage';
import { MAP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { useThemeContext } from 'context/themeContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { CartProductInterface, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import useValidationSchema from 'hooks/useValidationSchema';
import LayoutCard from 'layout/LayoutCard';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { phoneToRaw } from 'lib/phoneUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';
import CartAside from 'components/CartAside';
import { makeAnOrderSchema } from 'validation/orderSchema';

interface OrderRouteProductInterface {
  cartProduct: CartProductInterface;
}

const OrderRouteProduct: React.FC<OrderRouteProductInterface> = ({ cartProduct }) => {
  const { urlPrefix } = useSiteContext();
  const { showModal } = useAppContext();
  const { isDark } = useThemeContext();
  const { shopProduct, amount, totalPrice } = cartProduct;
  if (!shopProduct) {
    return null;
  }

  const { shop, oldPrice, discountedPercent, price, product, itemId } = shopProduct;

  if (!product || !shop) {
    return null;
  }
  const { mainImage, snippetTitle, slug, name } = product;
  const lightThemeMarker = shop.mapMarker?.lightTheme;
  const darkThemeMarker = shop.mapMarker?.darkTheme;
  const marker = (isDark ? darkThemeMarker : lightThemeMarker) || '/marker.svg';

  return (
    <LayoutCard className='grid px-6 py-8 gap-6 sm:grid-cols-8 relative' testId='order-product'>
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

        <div className='flex justify-center items-center gap-4 mt-auto'>
          <ControlButton iconSize={'mid'} icon={'compare'} />
          <ControlButton iconSize={'mid'} icon={'heart'} />
        </div>
      </div>

      {/*main data*/}
      <div className='sm:col-span-6'>
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

        {/*price*/}
        <div className='mb-6'>
          <div className='flex items-baseline gap-2 md:gap-3 mb-3'>
            <ProductShopPrices
              className=''
              price={price}
              oldPrice={oldPrice}
              discountedPercent={discountedPercent}
              size={'small'}
            />
            <Icon name={'cross'} className='w-2 h-2 md:w-3 md:h-3' />
            <div className='md:text-lg font-medium'>{amount}</div>
          </div>
          <div className='text-2xl'>
            Итого <Currency value={totalPrice} />
          </div>
        </div>

        {/*shop info*/}
        <div className=''>
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
      </div>
    </LayoutCard>
  );
};

interface MakeAnOrderRouteInterface {
  company?: CompanyInterface | null;
}

const MakeAnOrderRoute: React.FC<MakeAnOrderRouteInterface> = ({ company }) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const { loadingCart, cart, makeAnOrder, urlPrefix } = useSiteContext();
  const sessionUser = useSiteUserContext();
  const validationSchema = useValidationSchema({
    schema: makeAnOrderSchema,
  });
  const disabled = !!sessionUser;

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
          <RequestError />
        </Inner>
      </div>
    );
  }

  const { productsCount, cartProducts } = cart;

  if (cartProducts.length < 1) {
    return (
      <div>
        <Breadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Title>Корзина пуста</Title>
          <div className='flex gap-4 flex-wrap'>
            <Button
              theme={'secondary'}
              onClick={() => {
                router.push(urlPrefix).catch(console.log);
              }}
            >
              В каталог
            </Button>
          </div>
        </Inner>
      </div>
    );
  }

  return (
    <div className='mb-12' data-cy={'order-form'}>
      <Breadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        <Title>В корзине товаров {productsCount} шт.</Title>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{
            name: sessionUser ? sessionUser.me.name : '',
            lastName: sessionUser ? sessionUser.me.lastName : '',
            email: sessionUser ? sessionUser.me.email : '',
            phone: sessionUser ? sessionUser.me.phone : '',
            comment: '',
            reservationDate: null,
          }}
          onSubmit={(values) => {
            makeAnOrder({
              ...values,
              phone: phoneToRaw(values.phone),
              companySlug: company?.slug,
            });
          }}
        >
          {() => {
            return (
              <Form>
                <div className='grid md:grid-cols-8 lg:grid-cols-16 gap-6'>
                  <div
                    className='md:col-span-5 lg:col-span-11 grid gap-8'
                    data-cy={'order-products'}
                  >
                    <div>
                      {/*form*/}
                      <div className='relative z-20'>
                        <div className='flex items-center gap-4 mb-8 text-lg font-medium'>
                          <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                            1
                          </div>
                          <div>Личные данные</div>
                        </div>

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

                      {/*products*/}
                      <div className='relative z-10'>
                        <div className='flex items-center gap-4 mb-8 text-lg font-medium'>
                          <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center'>
                            2
                          </div>
                          <div>Подтверждение заказа</div>
                        </div>

                        <div className='grid gap-4 mb-8' data-cy={'order-products'}>
                          {cartProducts.map((cartProduct) => {
                            return (
                              <OrderRouteProduct
                                cartProduct={cartProduct}
                                key={`${cartProduct._id}`}
                              />
                            );
                          })}
                        </div>

                        <FormikTextarea
                          label={'Ваш комментарий к заказу'}
                          testId={'order-form-comment'}
                          name={'comment'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='md:col-span-3 lg:col-span-5'>
                    <CartAside
                      cart={cart}
                      buttonText={configs.buyButtonText}
                      backLinkHref={`/cart`}
                      buttonType={'submit'}
                    />
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

type MakeAnOrderInterface = SiteLayoutProviderInterface;

const MakeAnOrder: NextPage<MakeAnOrderInterface> = (props) => {
  return (
    <SiteLayout title={'Корзина'} {...props}>
      <MakeAnOrderRoute company={props.domainCompany} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<MakeAnOrderInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default MakeAnOrder;
