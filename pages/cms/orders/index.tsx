import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import CmsOrdersRoute from 'routes/CmsOrdersRoute/CmsOrdersRoute';

const Orders: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <CmsOrdersRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Orders;
