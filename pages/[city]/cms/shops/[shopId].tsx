import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import ShopRoute from 'routes/Shop/ShopRoute';

const Shop: NextPage = () => {
  return (
    <AppLayout>
      <ShopRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Shop;
