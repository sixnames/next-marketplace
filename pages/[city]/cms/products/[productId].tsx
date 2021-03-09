import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import ProductRoute from 'routes/Product/ProductRoute';

const Product: NextPage = () => {
  return (
    <AppLayout>
      <ProductRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Product;
