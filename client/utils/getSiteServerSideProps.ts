import { GetServerSidePropsContext } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_SITE_QUERY } from '../graphql/query/initialQuery';
import { InitialSiteQueryQueryResult } from '../generated/apolloComponents';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import privateRouteHandler from './privateRouteHandler';

export type SitePagePropsType<T = undefined> = {
  initialApolloState: InitialSiteQueryQueryResult['data'];
} & (T extends undefined ? Record<string, unknown> : T);

interface GetSiteServerSidePropsResult<T> {
  props: SitePagePropsType<T>;
}

interface GetSiteServerSidePropsCallbackArg {
  initialProps: SitePagePropsType;
  context: GetServerSidePropsContext;
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

interface GetSitePageServerSidePropsArg<T> {
  context: GetServerSidePropsContext;
  callback: (arg: GetSiteServerSidePropsCallbackArg) => Promise<GetSiteServerSidePropsResult<T>>;
  isProtected?: boolean;
}

async function getSiteServerSideProps<T>({
  context,
  callback,
  isProtected,
}: GetSitePageServerSidePropsArg<T>) {
  try {
    const { req, res } = context;
    const apolloClient = initializeApollo();

    const initialApolloState = await apolloClient.query({
      query: INITIAL_SITE_QUERY,
      context: {
        headers: req.headers,
      },
    });

    // Redirect if route is protected
    if (
      (!initialApolloState || !initialApolloState.data || !initialApolloState.data.me) &&
      isProtected
    ) {
      privateRouteHandler(res);
      return { props: {} };
    }

    return callback({
      initialProps: {
        initialApolloState: initialApolloState.data,
      },
      context,
      apolloClient,
    });
  } catch (e) {
    console.log('====== getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default getSiteServerSideProps;
