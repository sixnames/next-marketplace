import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import ProductRoute from 'routes/Product/ProductRoute';

const Product: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <ProductRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Product;
