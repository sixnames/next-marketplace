import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import AppLayout from '../../../layout/AppLayout/AppLayout';

const Config: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Настройки сайта'} initialApolloState={initialApolloState}>
      <div data-cy={'site-configs'} />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Config;
