import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import CompanyRoute from 'routes/Company/CompanyRoute';

const Company: NextPage = () => {
  return (
    <AppLayout>
      <CompanyRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Company;
