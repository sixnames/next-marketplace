import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ROUTE_SIGN_IN } from 'config/common';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { initializeApollo } from 'apollo/apolloClient';
import { INITIAL_APP_QUERY, INITIAL_SITE_QUERY } from 'graphql/query/initialQueries';
import { getSession } from 'next-auth/client';

export interface GetSSRSessionDataPayloadInterface {
  isMobileDevice: boolean;
}

export function getUserDeviceInfo(
  context: GetServerSidePropsContext,
): GetSSRSessionDataPayloadInterface {
  const { req } = context;

  // Detect session device
  const isMobileDevice = `${req ? req.headers['user-agent'] : navigator.userAgent}`.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
  );

  return {
    isMobileDevice: Boolean(isMobileDevice),
  };
}

export async function getInitialApolloState(
  context: GetServerSidePropsContext,
): Promise<ApolloClient<NormalizedCacheObject>> {
  const apolloClient = initializeApollo(null, context);
  await apolloClient.query({
    query: INITIAL_SITE_QUERY,
    context,
  });
  return apolloClient;
}

export interface GetSiteInitialDataPayloadInterface extends GetSSRSessionDataPayloadInterface {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export async function getSiteInitialData(
  context: GetServerSidePropsContext,
): Promise<GetSiteInitialDataPayloadInterface> {
  const apolloClient = await getInitialApolloState(context);
  const userDeviceInfo = getUserDeviceInfo(context);

  return {
    ...userDeviceInfo,
    apolloClient,
  };
}

export async function getAppInitialApolloState(
  context: GetServerSidePropsContext,
): Promise<ApolloClient<NormalizedCacheObject>> {
  const apolloClient = initializeApollo(null, context);
  await apolloClient.query({
    query: INITIAL_APP_QUERY,
    context,
  });
  return apolloClient;
}

export interface GetAppInitialDataPayloadInterface extends GetSSRSessionDataPayloadInterface {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export async function getAppInitialData(
  context: GetServerSidePropsContext,
): Promise<GetAppInitialDataPayloadInterface> {
  const apolloClient = await getAppInitialApolloState(context);
  const userDeviceInfo = getUserDeviceInfo(context);

  return {
    ...userDeviceInfo,
    apolloClient,
  };
}

export async function getCmsSsrProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    // Check if user authenticated
    const session = await getSession(context);
    if (!session?.user) {
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_SIGN_IN,
        },
      };
    }

    const { isMobileDevice, apolloClient } = await getAppInitialData(context);

    return {
      props: {
        isMobileDevice,
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}
