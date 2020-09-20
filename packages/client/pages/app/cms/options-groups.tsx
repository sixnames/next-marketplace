import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import OptionsGroupsRoute from '../../../routes/OptionsGroups/OptionsGroupsRoute';

const OptionsGroups: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Группы опций'} initialApolloState={initialApolloState}>
      <OptionsGroupsRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default OptionsGroups;
