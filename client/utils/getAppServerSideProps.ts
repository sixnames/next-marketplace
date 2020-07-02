import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';
import privateRouteHandler from './privateRouteHandler';
import { InitialQueryResult } from '../generated/apolloComponents';

export interface AppPageInterface {
  initialApolloState: InitialQueryResult['data'];
}

async function getAppServerSideProps(context: GetServerSidePropsContext<ParsedUrlQuery>) {
  const { req, res } = context;
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
}

export default getAppServerSideProps;
