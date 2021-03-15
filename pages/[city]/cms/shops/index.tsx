import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import ShopsRoute from 'routes/Shops/ShopsRoute';

const Shops: NextPage = () => {
  return (
    <AppLayout>
      <ShopsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Shops;
