import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_SITE_QUERY } from '../graphql/query/initialQuery';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { UserContextProvider } from '../context/userContext';
import Title from '../components/Title/Title';
import Inner from '../components/Inner/Inner';
import { InitialSiteQueryQueryResult } from '../generated/apolloComponents';
import { SiteContextProvider } from '../context/siteContext';

interface HomeInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
}

const Home: NextPage<HomeInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <SiteContextProvider value={initialApolloState}>
        <SiteLayout>
          <Inner>
            <Title>Main page</Title>
          </Inner>
        </SiteLayout>
      </SiteContextProvider>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo();

  const initialApolloState = await apolloClient.query({
    query: INITIAL_SITE_QUERY,
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
