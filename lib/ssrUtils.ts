import { DEFAULT_CITY, DEFAULT_LOCALE, ROUTE_SIGN_IN } from 'config/common';
import { IncomingMessage, ServerResponse } from 'http';
import { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getCatalogueNavRubrics, getPageInitialData } from 'lib/catalogueUtils';
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

export async function getAppInitialData(
  context: SsrContext,
): Promise<GetServerSidePropsResult<PagePropsInterface>> {
  const { locale, query } = context;
  const { city } = query || {};
  const sessionCity = city ? `${city}` : DEFAULT_CITY;
  const sessionLocale = locale || DEFAULT_LOCALE;

  const initialDataProps = {
    locale: `${sessionLocale}`,
    city: sessionCity,
  };

  const rawInitialData = await getPageInitialData(initialDataProps);
  const initialData = castDbData(rawInitialData);

  const currentCity = rawInitialData.cities.find(({ slug }) => {
    return slug === city;
  });
  if (!currentCity) {
    return {
      props: {
        initialData,
        sessionCity,
      },
      redirect: {
        destination: `/404`,
        permanent: true,
      },
    };
  }

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

  return {
    props: {
      initialData,
      sessionCity,
    },
  };
}

export function castDbData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

export interface GetSiteInitialDataInterface {
  params?: ParsedUrlQuery;
  locale?: string;
}

export interface SiteInitialDataPropsInterface
  extends PagePropsInterface,
    Omit<SiteLayoutInterface, 'description' | 'title'> {}

export interface SiteInitialDataPayloadInterface {
  props: SiteInitialDataPropsInterface;
  cityNotFound: boolean;
  revalidate: number;
  redirectPayload: {
    props: Record<string, any>;
    redirect: {
      destination: string;
      permanent: boolean;
    };
  };
}

export async function getSiteInitialData({
  params,
  locale,
}: GetSiteInitialDataInterface): Promise<SiteInitialDataPayloadInterface> {
  const { city } = params || {};
  const sessionCity = city ? `${city}` : DEFAULT_CITY;
  const sessionLocale = locale || DEFAULT_LOCALE;

  const initialDataProps = {
    locale: sessionLocale,
    city: sessionCity,
  };

  // initial data
  const rawInitialData = await getPageInitialData(initialDataProps);
  const rawNavRubrics = await getCatalogueNavRubrics(initialDataProps);
  const initialData = castDbData(rawInitialData);
  const navRubrics = castDbData(rawNavRubrics);

  const currentCity = rawInitialData.cities.find(({ slug }) => {
    return slug === city;
  });
  const cityNotFound = !currentCity;

  return {
    cityNotFound,
    props: {
      initialData,
      navRubrics,
      sessionCity: cityNotFound ? DEFAULT_CITY : sessionCity,
    },
    revalidate: 5,
    redirectPayload: {
      props: {},
      redirect: {
        destination: `/404`,
        permanent: true,
      },
    },
  };
}
