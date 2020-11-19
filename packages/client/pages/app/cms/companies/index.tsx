import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import CompaniesRoute from '../../../../routes/Companies/CompaniesRoute';

const Companies: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Компании'} initialApolloState={initialApolloState}>
      <CompaniesRoute />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default Companies;
