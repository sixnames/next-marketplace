import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { CatalogueDataFragment } from '../generated/apolloComponents';
import { CATALOGUE_RUBRIC_QUERY } from '../graphql/query/catalogueQueries';
import CatalogueRoute from '../routes/CatalogueRoute/CatalogueRoute';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';

interface CatalogueInterface {
  rubricData?: CatalogueDataFragment | null;
}

const Catalogue: NextPage<SitePagePropsType<CatalogueInterface>> = ({
  initialApolloState,
  rubricData,
}) => {
  return (
    <SiteLayout
      title={rubricData ? rubricData.catalogueTitle : undefined}
      description={rubricData ? rubricData.catalogueTitle : undefined}
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
          rubricData: rubricData?.data?.getCatalogueData,
        },
      };
    },
  });

export default Catalogue;
