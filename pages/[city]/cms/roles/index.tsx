import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import RolesRoute from 'routes/Roles/RolesRoute';

const Roles: NextPage = () => {
  return (
    <AppLayout>
      <RolesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Roles;
