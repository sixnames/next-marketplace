import { GetServerSidePropsContext } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_SITE_QUERY } from '../graphql/query/initialQueries';
import { InitialSiteQueryQueryResult } from '../generated/apolloComponents';
import privateRouteHandler from './privateRouteHandler';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Theme } from '../types';
import { THEME_LIGHT } from '../config';
import { parseCookies } from './parseCookies';

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
    const isMobileDevice = `${req ? req.headers['user-agent'] : navigator.userAgent}`.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    );

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
      return { props: { initialApolloState: {} } };
    }

    // Get theme settings
    const { theme } = parseCookies(req);

    return callback({
      initialProps: {
        initialApolloState: initialApolloState.data,
        initialTheme: (theme as Theme) || (THEME_LIGHT as Theme),
        isMobileDevice: Boolean(isMobileDevice),
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
