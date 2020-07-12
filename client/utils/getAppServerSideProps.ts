import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';
import privateRouteHandler from './privateRouteHandler';
import { InitialQueryResult } from '../generated/apolloComponents';
import cookie from 'cookie';
import { DEFAULT_LANG } from '../config';

export interface AppPageInterface {
  initialApolloState: InitialQueryResult['data'];
  lang: string;
}

async function getAppServerSideProps(context: GetServerSidePropsContext<ParsedUrlQuery>) {
  const { req, res } = context;
  const { lang } = cookie.parse(req.headers.cookie || '');

  const apolloClient = initializeApollo();

  const initialApolloState = await apolloClient.query({
    query: INITIAL_QUERY,
    context: {
      headers: req.headers,
    },
  });

  if (!initialApolloState || !initialApolloState.data || !initialApolloState.data.me) {
    privateRouteHandler(res);
    return { props: {} };
  }

  return {
    props: {
      initialApolloState: initialApolloState.data,
      lang: lang || DEFAULT_LANG,
    },
  };
}

export default getAppServerSideProps;
