import React from 'react';
import AppLayout from '../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../context/userContext';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import getAppServerSideProps, { AppPageInterface } from '../../utils/getAppServerSideProps';

const App: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <AppLayout title={'Winepoint App'}>
        <Inner>
          <Title>Winepoint App</Title>
        </Inner>
      </AppLayout>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

export default App;
