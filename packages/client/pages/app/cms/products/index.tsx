import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import ProductsRoute from '../../../../routes/Products/ProductsRoute';

const Products: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Товары'} initialApolloState={initialApolloState}>
      <ProductsRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Products;
