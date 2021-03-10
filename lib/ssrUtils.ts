import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ROUTE_SIGN_IN } from 'config/common';
import { IncomingMessage, ServerResponse } from 'http';
import { getPageInitialData } from 'lib/catalogueUtils';
import { GetServerSidePropsResult } from 'next';
import { getSession } from 'next-auth/client';
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils';
import { PagePropsInterface } from 'pages/_app';
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

export interface GetSiteInitialDataPayloadInterface {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export async function getAppInitialData(
  context: SsrContext,
): Promise<GetServerSidePropsResult<PagePropsInterface>> {
  const { locale, query } = context;

  // Check if user authenticated
  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: `/${query?.city}${ROUTE_SIGN_IN}`,
      },
    };
  }

  const rawInitialData = await getPageInitialData({ locale: `${locale}`, city: `${query?.city}` });
  const initialData = castDbData(rawInitialData);

  return {
    props: {
      initialData,
    },
  };
}

export function castDbData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}
