import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';
import CompanyRoute from '../../../../routes/Company/CompanyRoute';

const Company: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Компания'} initialApolloState={initialApolloState}>
      <CompanyRoute />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default Company;
