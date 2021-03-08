import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import RoleRoute from 'routes/Role/RoleRoute';

const Role: NextPage = () => {
  return (
    <AppLayout>
      <RoleRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Role;
