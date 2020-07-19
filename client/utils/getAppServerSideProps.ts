import { GetServerSidePropsContext } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_QUERY } from '../graphql/query/initialQuery';
import privateRouteHandler from './privateRouteHandler';
import { InitialQuery } from '../generated/apolloComponents';

export interface AppPageInterface {
  initialApolloState: InitialQuery;
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

    // Redirect if user is not authorized
    if (!initialApolloState || !initialApolloState.data || !initialApolloState.data.me) {
      privateRouteHandler(res);
      return { props: { initialApolloState: {} } };
    }

    return {
      props: {
        initialApolloState: initialApolloState.data,
      },
    };
  } catch (e) {
    console.log('====== getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default getAppServerSideProps;
