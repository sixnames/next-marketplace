import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ROUTE_SIGN_IN } from 'config/common';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsResult } from 'next';
import { initializeApollo } from 'apollo/apolloClient';
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
  return initializeApollo(null, context);
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
  return initializeApollo(null, context);
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
          destination: `/${context.city}/${ROUTE_SIGN_IN}`,
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

export function castDbData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}
