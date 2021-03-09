import AppLayout from 'layout/AppLayout/AppLayout';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import CmsOrdersRoute from 'routes/CmsOrdersRoute/CmsOrdersRoute';

const Orders: NextPage = () => {
  return (
    <AppLayout>
      <CmsOrdersRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Orders;
