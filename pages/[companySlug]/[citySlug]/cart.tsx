import Breadcrumbs from 'components/Breadcrumbs';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { useSiteContext } from 'context/siteContext';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

const CartPageConsumer: React.FC = () => {
  const { cart, loadingCart } = useSiteContext();

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

  const { productsCount, cartBookingProducts, cartDeliveryProducts } = cart;

  console.log({ productsCount, cartBookingProducts, cartDeliveryProducts });

  return <div>cart</div>;
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
