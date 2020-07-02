import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { UserContextProvider } from '../context/userContext';
import Title from '../components/Title/Title';
import Inner from '../components/Inner/Inner';
import { InitialQueryResult } from '../generated/apolloComponents';

interface HomeInterface {
  initialApolloState: InitialQueryResult['data'];
}

const Home: NextPage<HomeInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <SiteLayout>
        <Inner>
          <Title>Main page</Title>
        </Inner>
      </SiteLayout>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo();

  const initialApolloState = await apolloClient.query({
    query: INITIAL_QUERY,
    context: {
      headers: req.headers,
    },
  });

  return {
    props: {
      initialApolloState: initialApolloState.data,
    },
  };
};

export default Home;
