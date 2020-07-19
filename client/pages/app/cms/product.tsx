import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../../context/userContext';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import ProductRoute from '../../../routes/Product/ProductRoute';

const Product: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <UserContextProvider
      me={initialApolloState.me}
      lang={initialApolloState.getClientLanguage}
      languagesList={initialApolloState.getAllLanguages || []}
    >
      <ProductRoute />
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Product;
