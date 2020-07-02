import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SignInRoute from '../routes/SignInRoute/SignInRoute';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';
import { UserContextProvider } from '../context/userContext';
import { InitialQueryResult } from '../generated/apolloComponents';

interface SignInInterface {
  initialApolloState: InitialQueryResult['data'];
}

const SignIn: NextPage<SignInInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <SiteLayout>
        <SignInRoute />
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

export default SignIn;
