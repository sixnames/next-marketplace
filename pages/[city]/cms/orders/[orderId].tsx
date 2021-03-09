import AppLayout from 'layout/AppLayout/AppLayout';
import * as React from 'react';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import CmsOrderRoute from 'routes/CmsOrderRoute/CmsOrderRoute';

const Order: NextPage = () => {
  return (
    <AppLayout>
      <CmsOrderRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Order;
