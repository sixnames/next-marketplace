import { GetServerSidePropsContext } from 'next';
import { INITIAL_APP_QUERY } from 'graphql/query/initialQueries';
import { parseCookies } from './parseCookies';
import { ROUTE_SIGN_IN } from 'config/common';
import { Theme } from 'types/clientTypes';
import { initializeApollo } from 'apollo/apolloClient';
import { InitialAppQuery } from 'generated/apolloComponents';

export interface AppPageInterface {
  initialApolloState: InitialAppQuery;
}

async function getAppServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { req } = context;
    const isMobileDevice = `${req ? req.headers['user-agent'] : navigator.userAgent}`.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    );

    const apolloClient = initializeApollo(null, context);

    const initialApolloState = await apolloClient.query({
      query: INITIAL_APP_QUERY,
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
