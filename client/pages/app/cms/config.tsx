import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import ConfigsRoute from '../../../routes/ConfigsRoute/ConfigsRoute';

const Config: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Настройки сайта'} initialApolloState={initialApolloState}>
      <ConfigsRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Config;
