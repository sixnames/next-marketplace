import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import RoleRoute from 'routes/Role/RoleRoute';

const Role: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <RoleRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Role;
