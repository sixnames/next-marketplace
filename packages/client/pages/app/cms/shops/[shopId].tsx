import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import ShopRoute from '../../../../routes/Shop/ShopRoute';

const Shop: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Магазин'} initialApolloState={initialApolloState}>
      <ShopRoute />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default Shop;
