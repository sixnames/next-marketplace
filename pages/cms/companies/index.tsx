import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import CompaniesRoute from 'routes/Companies/CompaniesRoute';

const Companies: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <CompaniesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Companies;
