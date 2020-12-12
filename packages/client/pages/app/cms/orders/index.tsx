import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import CmsOrdersRoute from '../../../../routes/CmsOrdersRoute/CmsOrdersRoute';

const CmsOrders: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Заказы'} initialApolloState={initialApolloState}>
      <CmsOrdersRoute />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default CmsOrders;
