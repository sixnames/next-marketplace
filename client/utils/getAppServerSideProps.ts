import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';
import privateRouteHandler from './privateRouteHandler';
import { InitialQueryResult } from '../generated/apolloComponents';
import cookie from 'cookie';
import { DEFAULT_LANG, LANG_COOKIE_HEADER } from '../config';

export interface AppPageInterface {
  initialApolloState: InitialQueryResult['data'];
  lang: string;
}

async function getAppServerSideProps(context: GetServerSidePropsContext<ParsedUrlQuery>) {
  const { req, res } = context;
  const systemLang = (req.headers[LANG_COOKIE_HEADER] || '').slice(0, 2);
  const { lang: cookieLang } = cookie.parse(req.headers.cookie || '');
  const lang = cookieLang || systemLang || DEFAULT_LANG;

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
