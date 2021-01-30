import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import ProductsRoute from 'routes/Products/ProductsRoute';

const Products: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <ProductsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Products;
