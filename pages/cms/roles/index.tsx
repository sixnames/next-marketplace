import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import RolesRoute from 'routes/Roles/RolesRoute';

const Roles: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <RolesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Roles;
