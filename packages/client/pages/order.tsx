import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';
import OrderRoute from '../routes/OrderRoute/OrderRoute';

const Order: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState} title={'Корзина'}>
      <OrderRoute />
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps({
    context,
    callback: async ({ initialProps }) => {
      return {
        props: initialProps,
      };
    },
  });

export default Order;
