import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import CreateCompanyRoute from 'routes/Company/CreateCompanyRoute';

const CompaniesCreate: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <CreateCompanyRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default CompaniesCreate;
