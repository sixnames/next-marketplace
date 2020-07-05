import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { initializeApollo } from '../../apollo/client';
import { INITIAL_SITE_QUERY } from '../../graphql/query/initialQuery';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';
import { UserContextProvider } from '../../context/userContext';
import Inner from '../../components/Inner/Inner';
import {
  GetCatalogueRubricQueryResult,
  InitialSiteQueryQueryResult,
} from '../../generated/apolloComponents';
import { SiteContextProvider } from '../../context/siteContext';
import { CATALOGUE_RUBRIC_QUERY } from '../../graphql/query/catalogueQuery';
import RequestError from '../../components/RequestError/RequestError';
import CatalogueRoute from '../../routes/CatalogueRoute/CatalogueRoute';

export type CatalogueData = GetCatalogueRubricQueryResult['data'];

interface CatalogueInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
  rubricData: CatalogueData;
}

const Catalogue: NextPage<CatalogueInterface> = ({ initialApolloState, rubricData }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  if (!rubricData) {
    return (
      <SiteContextProvider value={initialApolloState}>
        <SiteLayout>
          <Inner>
            <RequestError />
          </Inner>
        </SiteLayout>
      </SiteContextProvider>
    );
  }

  return (
    <UserContextProvider me={myData}>
      <SiteContextProvider value={initialApolloState}>
        <SiteLayout>
          <CatalogueRoute rubricData={rubricData} />
        </SiteLayout>
      </SiteContextProvider>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const apolloClient = initializeApollo();
  const initialApolloState = await apolloClient.query({
    query: INITIAL_SITE_QUERY,
    context: {
      headers: req.headers,
    },
  });

  const rubricData = await apolloClient.query({
    query: CATALOGUE_RUBRIC_QUERY,
    context: {
      headers: req.headers,
    },
    variables: {
      id: query.id,
      productsInput: {
        active: true,
      },
    },
  });

  return {
    props: {
      initialApolloState: initialApolloState.data,
      rubricData: rubricData.data,
    },
  };
};

// noinspection JSUnusedGlobalSymbols
export default Catalogue;
