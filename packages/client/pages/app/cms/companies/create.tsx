import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import CreateCompanyRoute from '../../../../routes/Company/CreateCompanyRoute';

const Companies: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Создание компании'} initialApolloState={initialApolloState}>
      <CreateCompanyRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Companies;
