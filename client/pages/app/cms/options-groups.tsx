import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../../context/userContext';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import OptionsGroupsRoute from '../../../routes/OptionsGroups/OptionsGroupsRoute';

const OptionsGroups: NextPage<AppPageInterface> = ({ initialApolloState, lang }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData} lang={lang}>
      <AppLayout title={'Группы опций'}>
        <OptionsGroupsRoute />
      </AppLayout>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default OptionsGroups;
