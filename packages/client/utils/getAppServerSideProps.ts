import { GetServerSidePropsContext } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQueries';
import { InitialQuery } from '../generated/apolloComponents';
import { parseCookies } from './parseCookies';
import { Theme } from '../types';
import { ROUTE_SIGN_IN } from '../config';

export interface AppPageInterface {
  initialApolloState: InitialQuery;
}

async function getAppServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { req } = context;
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
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_SIGN_IN,
        },
      };
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
    console.log('====== getAppServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }
}

export default getAppServerSideProps;
