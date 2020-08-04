import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import LanguagesRoute from '../../../routes/Languages/LanguagesRoute';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';

const Languages: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Языки сайта'} initialApolloState={initialApolloState}>
      <LanguagesRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Languages;
