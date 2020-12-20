import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { CatalogueDataFragment } from '../generated/apolloComponents';
import { CATALOGUE_RUBRIC_QUERY } from '../graphql/query/catalogueQueries';
import CatalogueRoute from '../routes/CatalogueRoute/CatalogueRoute';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';
import ErrorBoundaryFallback from '../components/ErrorBoundary/ErrorBoundaryFallback';
import { noNaN } from '@yagu/shared';

interface CatalogueInterface {
  rubricData?: CatalogueDataFragment | null;
}

const Catalogue: NextPage<SitePagePropsType<CatalogueInterface>> = ({
  initialApolloState,
  rubricData,
}) => {
  if (!rubricData || !initialApolloState) {
    return <ErrorBoundaryFallback />;
  }

  return (
    <SiteLayout
      title={rubricData.catalogueTitle}
      description={rubricData.catalogueTitle}
      initialApolloState={initialApolloState}
    >
      <CatalogueRoute rubricData={rubricData} />
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps<CatalogueInterface>({
    context,
    callback: async ({ initialProps, context, apolloClient }) => {
      const { query, req } = context;
      const { catalogue, sortDir, sortBy, minPrice, maxPrice } = query;

      const rubricData = await apolloClient.query({
        query: CATALOGUE_RUBRIC_QUERY,
        context: {
          headers: req.headers,
        },
        variables: {
          catalogueFilter: catalogue,
          productsInput: {
            sortDir,
            sortBy,
            minPrice: minPrice ? noNaN(minPrice) : null,
            maxPrice: maxPrice ? noNaN(maxPrice) : null,
          },
        },
      });

      return {
        props: {
          ...initialProps,
          rubricData: rubricData?.data?.getCatalogueData,
        },
      };
    },
  });

export default Catalogue;
