import React from 'react';
import { GetServerSideProps } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';

export default function Home(props: any) {
  console.log(props);

  return <div className='container'></div>;
}

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: INITIAL_QUERY,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract().ROOT_QUERY,
    },
  };
};
