import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import CompaniesRoute from 'routes/Companies/CompaniesRoute';

const Companies: NextPage = () => {
  return (
    <AppLayout>
      <CompaniesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Companies;
