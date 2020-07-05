import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../../context/userContext';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import RubricsRoute from '../../../routes/Rubrics/RubricsRoute';

const Rubrics: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <AppLayout title={'Рубрикатор'}>
        <RubricsRoute />
      </AppLayout>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Rubrics;
