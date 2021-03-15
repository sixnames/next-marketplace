import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import ShopRoute from 'routes/Shop/ShopRoute';

const Shop: NextPage = () => {
  return (
    <AppLayout>
      <ShopRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Shop;
