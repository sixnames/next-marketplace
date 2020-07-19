import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../../context/userContext';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import ProductsRoute from '../../../routes/Products/ProductsRoute';

const Products: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <UserContextProvider
      me={initialApolloState.me}
      lang={initialApolloState.getClientLanguage}
      languagesList={initialApolloState.getAllLanguages || []}
    >
      <AppLayout title={'Товары'}>
        <ProductsRoute />
      </AppLayout>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Products;
