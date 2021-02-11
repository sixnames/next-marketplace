import ErrorBoundaryFallback from 'components/ErrorBoundary/ErrorBoundaryFallback';
import { CATALOGUE_RUBRIC_QUERY } from 'graphql/query/catalogueQueries';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import {
  CatalogueDataFragment,
  GetCatalogueRubricQuery,
  GetCatalogueRubricQueryVariables,
} from 'generated/apolloComponents';
import { PagePropsInterface } from 'pages/_app';
import CatalogueRoute from 'routes/CatalogueRoute/CatalogueRoute';

interface CatalogueInterface extends PagePropsInterface {
  rubricData?: CatalogueDataFragment | null;
}

const Catalogue: NextPage<CatalogueInterface> = ({ rubricData, initialTheme }) => {
  if (!rubricData) {
    return (
      <SiteLayout initialTheme={initialTheme}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout initialTheme={initialTheme}>
      <CatalogueRoute rubricData={rubricData} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { initialTheme, isMobileDevice, apolloClient } = await getSiteInitialData(context);

    // Get catalogue data
    const { query } = context;
    const { catalogue } = query;

    const { data } = await apolloClient.query<
      GetCatalogueRubricQuery,
      GetCatalogueRubricQueryVariables
    >({
      query: CATALOGUE_RUBRIC_QUERY,
      variables: {
        catalogueFilter: alwaysArray(catalogue),
        productsInput: {},
      },
    });

    return {
      props: {
        initialTheme,
        isMobileDevice,
        initialApolloState: apolloClient.cache.extract(),
        rubricData: data?.getCatalogueData,
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(e);
    return { props: {} };
  }
}

export default Catalogue;
