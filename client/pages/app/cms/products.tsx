import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import ProductsRoute from '../../../routes/Products/ProductsRoute';
import { useRouter } from 'next/router';
import ProductRoute from '../../../routes/Product/ProductRoute';

const Products: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  const { query } = useRouter();

  if (query.productId) {
    return (
      <AppLayout title={'Товар'} initialApolloState={initialApolloState}>
        <ProductRoute />
      </AppLayout>
    );
  }

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
