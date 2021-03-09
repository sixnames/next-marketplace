import ErrorBoundaryFallback from 'components/ErrorBoundary/ErrorBoundaryFallback';
import { GetCatalogueCardQuery, GetCatalogueCardQueryVariables } from 'generated/apolloComponents';
import { CATALOGUE_CARD_QUERY } from 'graphql/query/cardQueries';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import CardRoute from 'routes/CardRoute/CardRoute';

interface CardInterface {
  cardData?: GetCatalogueCardQuery['getProductCard'] | null;
}

const Card: NextPage<CardInterface> = ({ cardData }) => {
  if (!cardData) {
    return (
      <SiteLayout>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <CardRoute cardData={cardData} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { apolloClient } = await getSiteInitialData(context);

    // Get product card data
    const { query } = context;
    const { card } = query;

    const { data } = await apolloClient.query<
      GetCatalogueCardQuery,
      GetCatalogueCardQueryVariables
    >({
      query: CATALOGUE_CARD_QUERY,
      variables: {
        slug: alwaysArray(card),
      },
    });

    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
        cardData: data?.getProductCard,
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default Card;
