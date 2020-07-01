import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SignInRoute from '../routes/SignInRoute/SignInRoute';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';

const SignIn: NextPage = (props) => {
  console.log(props);
  return (
    <SiteLayout>
      <SignInRoute />
    </SiteLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: INITIAL_QUERY,
    context: {
      headers: {
        cookie: req.headers.cookie,
      },
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default SignIn;
