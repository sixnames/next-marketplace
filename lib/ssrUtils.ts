import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ROUTE_SIGN_IN } from 'config/common';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsResult } from 'next';
import { initializeApollo } from 'apollo/apolloClient';
import { INITIAL_APP_QUERY, INITIAL_SITE_QUERY } from 'graphql/query/initialQueries';
import { getSession } from 'next-auth/client';
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils';
import { ParsedUrlQuery } from 'querystring';

export interface SsrContext {
  req?: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
  res?: ServerResponse;
  params?: any;
  query?: ParsedUrlQuery;
  preview?: boolean;
  previewData?: any;
  resolvedUrl?: string;
  locale?: string;
  locales?: string[];
  defaultLocale?: string;
  city?: string | null;
}

export async function getInitialApolloState(
  context: SsrContext,
): Promise<ApolloClient<NormalizedCacheObject>> {
  const apolloClient = initializeApollo(null, context);
  await apolloClient.query({
    query: INITIAL_SITE_QUERY,
    context,
  });
  return apolloClient;
}

export interface GetSiteInitialDataPayloadInterface {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export async function getSiteInitialData(
  context: SsrContext,
): Promise<GetSiteInitialDataPayloadInterface> {
  const apolloClient = await getInitialApolloState(context);

  return {
    apolloClient,
  };
}

export async function getAppInitialApolloState(
  context: SsrContext,
): Promise<ApolloClient<NormalizedCacheObject>> {
  const apolloClient = initializeApollo(null, context);
  await apolloClient.query({
    query: INITIAL_APP_QUERY,
    context,
  });
  return apolloClient;
}

export interface GetAppInitialDataPayloadInterface {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export async function getAppInitialData(
  context: SsrContext,
): Promise<GetAppInitialDataPayloadInterface> {
  const apolloClient = await getAppInitialApolloState(context);

  return {
    apolloClient,
  };
}

export async function getCmsSsrProps(context: SsrContext): Promise<GetServerSidePropsResult<any>> {
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

    const { apolloClient } = await getAppInitialData(context);

    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}
