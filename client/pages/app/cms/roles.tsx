import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import RolesRoute from '../../../routes/Roles/RolesRoute';

const Roles: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Роли'} initialApolloState={initialApolloState}>
      <RolesRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Roles;
