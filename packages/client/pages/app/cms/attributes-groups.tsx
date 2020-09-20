import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import AttributesGroupsRoute from '../../../routes/AttributesGroups/AttributesGroupsRoute';

const AttributesGroups: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Группы атрибутов'} initialApolloState={initialApolloState}>
      <AttributesGroupsRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default AttributesGroups;
