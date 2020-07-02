import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { AppInterface } from '../index';
import { UserContextProvider } from '../../../context/userContext';
import { initializeApollo } from '../../../apollo/client';
import { INITIAL_QUERY } from '../../../graphql/query/initialQuery';
import privateRouteHandler from '../../../utils/privateRouteHandler';
import RubricVariantsRoute from '../../../routes/RubricVariants/RubricVariantsRoute';

type RubricVariantsInterface = AppInterface;

const RubricVariants: NextPage<RubricVariantsInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <AppLayout>
        <RubricVariantsRoute />
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

// noinspection JSUnusedGlobalSymbols
export default RubricVariants;
