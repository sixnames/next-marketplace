import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import DefaultCart from '../components/cart/DefaultCart';
import EmptyCart from '../components/cart/EmptyCart';
import OneShopCompanyCart from '../components/cart/OneShopCompanyCart';
import Inner from '../components/Inner';
import RequestError from '../components/RequestError';
import Spinner from '../components/Spinner';
import WpBreadcrumbs from '../components/WpBreadcrumbs';
import WpTitle from '../components/WpTitle';
import { useConfigContext } from '../context/configContext';
import { useSiteContext } from '../context/siteContext';
import { MakeAnOrderInputInterface } from '../db/dao/orders/makeAnOrder';
import { CartInterface } from '../db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from '../layout/SiteLayout';
import { noNaN } from '../lib/numbers';
import { getSiteInitialData } from '../lib/ssrUtils';

export function scrollToCartErrors(input: MakeAnOrderInputInterface): boolean {
  const distElement = document.getElementById('cart-inputs');
  const noName = !input.name;
  const noEmail = !input.email;
  const noPhone = !input.phone;
  const noPrivacy = !input.privacy;

  if (distElement && (noName || noEmail || noPhone || noPrivacy)) {
    window.scrollTo({
      top: noNaN(distElement.getBoundingClientRect().top),
      left: 0,
      behavior: 'smooth',
    });
    return true;
  }
  return false;
}

export type CartTabIndexType = 0 | 1;

export interface MakeOrderFormInterface
  extends CartInterface,
    Omit<MakeAnOrderInputInterface, 'allowDelivery' | 'cartProductsFieldName'> {}

const CartPageConsumer: React.FC = () => {
  const { cart, loadingCart } = useSiteContext();
  const [rendered, setRendered] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<CartTabIndexType>(0);
  const { configs, domainCompany } = useConfigContext();

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
        <WpBreadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <Spinner isNested isTransparent />
        </Inner>
      </div>
    );
  }

  if (!cart) {
    return (
      <div>
        <WpBreadcrumbs currentPageName={'Корзина'} />

        <Inner lowTop testId={'cart'}>
          <RequestError message={'Загружаю корзину'} />
        </Inner>
      </div>
    );
  }

  const { cartBookingProducts, cartDeliveryProducts } = cart;

  if (cartBookingProducts.length < 1 && cartDeliveryProducts.length < 1) {
    return <EmptyCart />;
  }

  return (
    <div className='mb-12'>
      <WpBreadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        {/*tabs*/}
        <div className='mb-8 flex flex-wrap gap-x-6 gap-y-4'>
          {cartDeliveryProducts.length > 0 ? (
            <div
              data-cy={'cart-products-tab-trigger-0'}
              className={`cursor-pointer transition-all ${
                tabIndex === 0 ? 'text-theme' : 'text-secondary-text'
              }`}
              onClick={() => {
                setTabIndex(0);
              }}
            >
              <WpTitle tag={'div'} size={'small'} low>
                Корзина {cartDeliveryProducts.length} шт.
              </WpTitle>
            </div>
          ) : null}

          {cartBookingProducts.length > 0 ? (
            <div
              data-cy={'cart-products-tab-trigger-1'}
              className={`cursor-pointer transition-all ${
                tabIndex === 1 ? 'text-theme' : 'text-secondary-text'
              }`}
              onClick={() => {
                setTabIndex(1);
              }}
            >
              <WpTitle tag={'div'} size={'small'} low>
                Бронирование {cartBookingProducts.length} шт.
              </WpTitle>
            </div>
          ) : null}
        </div>

        {configs.isOneShopCompany && domainCompany?.mainShop ? (
          <OneShopCompanyCart cart={cart} tabIndex={tabIndex} domainCompany={domainCompany} />
        ) : (
          <DefaultCart cart={cart} tabIndex={tabIndex} />
        )}
      </Inner>
    </div>
  );
};

interface CartPageInterface extends SiteLayoutProviderInterface {}

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
    props: {
      ...props,
      showForIndex: false,
    },
  };
}

export default CartPage;
