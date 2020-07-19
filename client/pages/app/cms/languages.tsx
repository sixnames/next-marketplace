import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../../context/userContext';
import LanguagesRoute from '../../../routes/Languages/LanguagesRoute';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';

const Languages: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <UserContextProvider
      me={initialApolloState.me}
      lang={initialApolloState.getClientLanguage}
      languagesList={initialApolloState.getAllLanguages || []}
    >
      <AppLayout title={'Языки сайта'}>
        <LanguagesRoute />
      </AppLayout>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Languages;
