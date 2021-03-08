import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import ShopsRoute from 'routes/Shops/ShopsRoute';

const Shops: NextPage = () => {
  return (
    <AppLayout>
      <ShopsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Shops;
