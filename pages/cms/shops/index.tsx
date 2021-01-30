import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import ShopsRoute from 'routes/Shops/ShopsRoute';

const Shops: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <ShopsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Shops;
