import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

interface OrderRouteInterface {
  [key: string]: any;
}

const OrderRoute: React.FC<OrderRouteInterface> = () => {
  const router = useRouter();

  return (
    <AppContentWrapper>
      <Head>
        <title>{`Заказ ${router.query.orderId}`}</title>
      </Head>
      <Inner>
        <Title>Заказ {router.query.orderId}</Title>
      </Inner>
    </AppContentWrapper>
  );
};

interface OrdersInterface extends PagePropsInterface, OrderRouteInterface {}

const Order: NextPage<OrdersInterface> = ({ pageUrls }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <OrderRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
    },
  };
};

export default Order;
