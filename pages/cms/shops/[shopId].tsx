import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import ShopRoute from 'routes/Shop/ShopRoute';

const Shop: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <ShopRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Shop;
