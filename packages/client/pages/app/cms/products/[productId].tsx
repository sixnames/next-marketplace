import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import ProductRoute from '../../../../routes/Product/ProductRoute';

const Product: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Товар'} initialApolloState={initialApolloState}>
      <ProductRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Product;
