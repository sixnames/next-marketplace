import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_SITE_QUERY } from '../graphql/query/initialQuery';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import Inner from '../components/Inner/Inner';
import {
  GetCatalogueRubricQueryResult,
  InitialSiteQueryQueryResult,
} from '../generated/apolloComponents';
import { SiteContextProvider } from '../context/siteContext';
import { CATALOGUE_RUBRIC_QUERY } from '../graphql/query/catalogueQuery';
import RequestError from '../components/RequestError/RequestError';
import CatalogueRoute from '../routes/CatalogueRoute/CatalogueRoute';
import cookie from 'cookie';
import { DEFAULT_LANG, LANG_COOKIE_HEADER } from '../config';

export type CatalogueData = GetCatalogueRubricQueryResult['data'];

interface CatalogueInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
  rubricData: CatalogueData;
  lang: string;
}

const Catalogue: NextPage<CatalogueInterface> = ({ initialApolloState, rubricData, lang }) => {
  if (!initialApolloState || !rubricData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  const { getCatalogueData } = rubricData;

  if (!getCatalogueData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  const { catalogueTitle } = getCatalogueData;

  return (
    <SiteContextProvider initialApolloState={initialApolloState} lang={lang}>
      <SiteLayout title={catalogueTitle} description={catalogueTitle}>
        <CatalogueRoute rubricData={rubricData} />
      </SiteLayout>
    </SiteContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  try {
    const apolloClient = initializeApollo();
    const systemLang = (req.headers[LANG_COOKIE_HEADER] || '').slice(0, 2);
    const { lang: cookieLang } = cookie.parse(req.headers.cookie || '');
    const lang = cookieLang || systemLang || DEFAULT_LANG;

    const initialApolloState = await apolloClient.query({
      query: INITIAL_SITE_QUERY,
      context: {
        headers: req.headers,
      },
    });
    const { catalogue } = query;

    const rubricData = await apolloClient.query({
      query: CATALOGUE_RUBRIC_QUERY,
      context: {
        headers: req.headers,
      },
      variables: {
        catalogueFilter: catalogue,
      },
    });

    return {
      props: {
        initialApolloState: initialApolloState.data,
        rubricData: rubricData.data,
        lang: lang || DEFAULT_LANG,
      },
    };
  } catch (e) {
    console.log('====== catalogue getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
};

// noinspection JSUnusedGlobalSymbols
export default Catalogue;
