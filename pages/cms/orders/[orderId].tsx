import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import CmsOrderRoute from 'routes/CmsOrderRoute/CmsOrderRoute';

const Order: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <CmsOrderRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Order;
