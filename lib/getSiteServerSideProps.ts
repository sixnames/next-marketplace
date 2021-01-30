import { GetServerSidePropsContext } from 'next';
import { INITIAL_SITE_QUERY } from 'graphql/query/initialQueries';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { parseCookies } from './parseCookies';
import { InitialSiteQuery, InitialSiteQueryResult } from 'generated/apolloComponents';
import { initializeApollo } from 'apollo/apolloClient';
// import { ROUTE_SIGN_IN } from 'config/common';
import { Theme } from 'types/clientTypes';

export type SitePagePropsType<T = undefined> = {
  initialApolloState: InitialSiteQueryResult['data'];
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
}: // isProtected,
GetSitePageServerSidePropsArg<T>) {
  try {
    const { req } = context;
    const isMobileDevice = `${req ? req.headers['user-agent'] : navigator.userAgent}`.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    );

    const apolloClient = initializeApollo(null, context);

    const initialApolloState = await apolloClient.query<InitialSiteQuery>({
      query: INITIAL_SITE_QUERY,
      context: {
        headers: req.headers,
      },
    });

    // Redirect if route is protected
    /*if (!initialApolloState.loading && !initialApolloState.data?.me && isProtected) {
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_SIGN_IN,
        },
      };
    }*/

    // Get theme settings
    const { theme } = parseCookies(req);

    return callback({
      initialProps: {
        initialApolloState: initialApolloState.data,
        initialTheme: `${theme}` as Theme,
        isMobileDevice: Boolean(isMobileDevice),
      },
      context,
      apolloClient,
    });
  } catch (e) {
    console.log('====== getSiteServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default getSiteServerSideProps;
