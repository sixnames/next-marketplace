import React from 'react';
import CmsOrderRoute from '../../../../routes/CmsOrderRoute/CmsOrderRoute';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import AppLayout from '../../../../layout/AppLayout/AppLayout';

const CmsOrder: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Заказа'} initialApolloState={initialApolloState}>
      <CmsOrderRoute />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default CmsOrder;
