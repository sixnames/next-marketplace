import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';
import CartRoute from '../routes/CartRoute/CartRoute';

const Home: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState} title={'Корзина'}>
      <CartRoute />
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

export default Home;
