import { GetServerSidePropsContext } from 'next';
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

async function getAppServerSideProps(context: GetServerSidePropsContext) {
  try {
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

    // Redirect if user is not authorized
    if (!initialApolloState || !initialApolloState.data || !initialApolloState.data.me) {
      privateRouteHandler(res);
      return { props: {} };
    }

    return {
      props: {
        initialApolloState: initialApolloState.data,
        lang,
      },
    };
  } catch (e) {
    console.log('====== getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default getAppServerSideProps;
