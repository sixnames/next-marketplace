import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import Inner from '../components/Inner/Inner';
import { GetCatalogueRubricQuery } from '../generated/apolloComponents';
import { CATALOGUE_RUBRIC_QUERY } from '../graphql/query/catalogueQuery';
import RequestError from '../components/RequestError/RequestError';
import CatalogueRoute from '../routes/CatalogueRoute/CatalogueRoute';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';

interface CatalogueInterface {
  rubricData: GetCatalogueRubricQuery;
}

const Catalogue: NextPage<SitePagePropsType<CatalogueInterface>> = ({
  initialApolloState,
  rubricData,
}) => {
  if (!rubricData || !rubricData.getCatalogueData) {
    return (
      <SiteLayout initialApolloState={initialApolloState}>
        <Inner>
          <RequestError />
        </Inner>
      </SiteLayout>
    );
  }

  const { getCatalogueData } = rubricData;
  const { catalogueTitle } = getCatalogueData;

  return (
    <SiteLayout
      title={catalogueTitle}
      description={catalogueTitle}
      initialApolloState={initialApolloState}
    >
      <CatalogueRoute rubricData={rubricData} />
    </SiteLayout>
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
