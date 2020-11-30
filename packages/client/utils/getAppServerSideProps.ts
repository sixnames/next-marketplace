import { GetServerSidePropsContext } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQueries';
import privateRouteHandler from './privateRouteHandler';
import { InitialQuery } from '../generated/apolloComponents';
import { parseCookies } from './parseCookies';
import { Theme } from '../types';

export interface AppPageInterface {
  initialApolloState: InitialQuery;
}

async function getAppServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { req, res } = context;
    const isMobileDevice = `${req ? req.headers['user-agent'] : navigator.userAgent}`.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    );

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
        initialTheme: `${theme}` as Theme,
        isMobileDevice,
      },
    };
  } catch (e) {
    console.log('====== getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default getAppServerSideProps;
