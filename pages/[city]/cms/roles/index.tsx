import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import RolesRoute from 'routes/Roles/RolesRoute';

const Roles: NextPage = () => {
  return (
    <AppLayout>
      <RolesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Roles;
