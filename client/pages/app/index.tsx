import React from 'react';
import AppLayout from '../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../context/userContext';
import { initializeApollo } from '../../apollo/client';
import { INITIAL_QUERY } from '../../graphql/query/initialQuery';
import { InitialQueryResult } from '../../generated/apolloComponents';
import privateRouteHandler from '../../utils/privateRouteHandler';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';

export interface AppInterface {
  initialApolloState: InitialQueryResult['data'];
}

const App: NextPage<AppInterface> = ({ initialApolloState }) => {
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
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const apolloClient = initializeApollo();

  const initialApolloState = await apolloClient.query({
    query: INITIAL_QUERY,
    context: {
      headers: req.headers,
    },
  });

  if (!initialApolloState.data || !initialApolloState.data.me) {
    privateRouteHandler(res);
    return { props: {} };
  }

  return {
    props: {
      initialApolloState: initialApolloState.data,
    },
  };
};

export default App;
