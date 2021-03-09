import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import CreateCompanyRoute from 'routes/Company/CreateCompanyRoute';

const CompaniesCreate: NextPage<PagePropsInterface> = () => {
  return (
    <AppLayout>
      <CreateCompanyRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default CompaniesCreate;
