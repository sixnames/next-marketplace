import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import Inner from '../components/Inner/Inner';
import { GetCatalogueRubricQueryResult } from '../generated/apolloComponents';
import { SiteContextProvider } from '../context/siteContext';
import { CATALOGUE_RUBRIC_QUERY } from '../graphql/query/catalogueQuery';
import RequestError from '../components/RequestError/RequestError';
import CatalogueRoute from '../routes/CatalogueRoute/CatalogueRoute';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';

export type CatalogueData = GetCatalogueRubricQueryResult['data'];

interface CatalogueInterface {
  rubricData: CatalogueData;
}

const Catalogue: NextPage<SitePagePropsType<CatalogueInterface>> = ({
  initialApolloState,
  rubricData,
}) => {
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
    <SiteContextProvider initialApolloState={initialApolloState}>
      <SiteLayout title={catalogueTitle} description={catalogueTitle}>
        <CatalogueRoute rubricData={rubricData} />
      </SiteLayout>
    </SiteContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps<CatalogueInterface>({
    context,
    callback: async ({ initialProps, context, apolloClient }) => {
      const { query, req } = context;
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
          ...initialProps,
          rubricData: rubricData.data,
        },
      };
    },
  });

// noinspection JSUnusedGlobalSymbols
export default Catalogue;
