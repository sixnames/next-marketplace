import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import ShopsRoute from '../../../../routes/Shops/ShopsRoute';

const Shops: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Магазины'} initialApolloState={initialApolloState}>
      <ShopsRoute />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default Shops;
