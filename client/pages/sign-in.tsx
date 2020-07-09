import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SignInRoute from '../routes/SignInRoute/SignInRoute';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { initializeApollo } from '../apollo/client';
import { INITIAL_SITE_QUERY } from '../graphql/query/initialQuery';
import { UserContextProvider } from '../context/userContext';
import { InitialSiteQueryQueryResult } from '../generated/apolloComponents';
import { SiteContextProvider } from '../context/siteContext';

interface SignInInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
}

const SignIn: NextPage<SignInInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <SiteContextProvider value={initialApolloState}>
        <SiteLayout>
          <SignInRoute />
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

export default SignIn;
