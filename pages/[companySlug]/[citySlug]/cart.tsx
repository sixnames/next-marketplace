import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/button/Button';
import CartAside from 'components/CartAside';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import { ROUTE_PROFILE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { Form, Formik } from 'formik';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

const CartPageConsumer: React.FC = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const { cart, loadingCart, urlPrefix } = useSiteContext();
  const { configs } = useConfigContext();

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

  const {
    cartBookingProducts,
    cartDeliveryProducts,
    totalBookingPrice,
    totalDeliveryPrice,
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
        <Formik
          initialValues={cart}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {() => {
            return (
              <Form>
                <div className='grid md:grid-cols-8 lg:grid-cols-16 gap-6'>
                  <div
                    className='md:col-span-5 lg:col-span-11 grid gap-6'
                    data-cy={'cart-products'}
                  >
                    <div>
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
                        <div>Товары корзины</div>
                      ) : null}

                      {/*booking products*/}
                      {cartBookingProducts.length > 0 && tabIndex === 1 ? (
                        <div>Товары бронирования</div>
                      ) : null}
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

type CartPageInterface = SiteLayoutProviderInterface;

const CartPage: NextPage<CartPageInterface> = (props) => {
  return (
    <SiteLayout title={'Корзина'} {...props}>
      <CartPageConsumer />
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
