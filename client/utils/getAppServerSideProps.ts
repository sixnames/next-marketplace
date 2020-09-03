import { GetServerSidePropsContext } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/initialQuery';
import privateRouteHandler from './privateRouteHandler';
import { InitialQuery } from '../generated/apolloComponents';
import { parseCookies } from './parseCookies';
import { Theme } from '../types';
import { THEME_LIGHT } from '../config';

export interface AppPageInterface {
  initialApolloState: InitialQuery;
  initialTheme: Theme;
}

async function getAppServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { req, res } = context;
    const apolloClient = initializeApollo();

    const initialApolloState = await apolloClient.query({
      query: INITIAL_QUERY,
      context: {
        headers: req.headers,
      },
    });

    // Redirect to sign in page if user is not authorized
    if (!initialApolloState || !initialApolloState.data || !initialApolloState.data.me) {
      privateRouteHandler(res);
      return { props: { initialApolloState: {} } };
    }

    // Get theme settings
    const { theme } = parseCookies(req);

    return {
      props: {
        initialApolloState: initialApolloState.data,
        initialTheme: (theme as Theme) || (THEME_LIGHT as Theme),
      },
    };
  } catch (e) {
    console.log('====== getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default getAppServerSideProps;
