import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import CompanyRoute from 'routes/Company/CompanyRoute';

const Company: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <CompanyRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Company;
