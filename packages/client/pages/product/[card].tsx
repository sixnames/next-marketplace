import React from 'react';
import { GetServerSideProps } from 'next';
import { GetCatalogueCardQueryQuery } from '../../generated/apolloComponents';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import CardRoute from '../../routes/CardRoute/CardRoute';
import { CATALOGUE_CARD_QUERY } from '../../graphql/query/cardQueries';
import getSiteServerSideProps, { SitePagePropsType } from '../../utils/getSiteServerSideProps';

interface CardInterface {
  cardData: GetCatalogueCardQueryQuery;
}

const Card: React.FC<SitePagePropsType<CardInterface>> = ({ initialApolloState, cardData }) => {
  if (!cardData) {
    return (
      <SiteLayout initialApolloState={initialApolloState}>
        <Inner>
          <RequestError />
        </Inner>
      </SiteLayout>
    );
  }

  const { getProductCard } = cardData;
  const { cardNameString, descriptionString } = getProductCard;

  return (
    <SiteLayout
      title={cardNameString}
      description={descriptionString}
      initialApolloState={initialApolloState}
    >
      <CardRoute cardData={getProductCard} />
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps<CardInterface>({
    context,
    callback: async ({ initialProps, context, apolloClient }) => {
      const { query, req } = context;

      const cardData = await apolloClient.query({
        query: CATALOGUE_CARD_QUERY,
        context: {
          headers: req.headers,
        },
        variables: {
          slug: query.card,
        },
      });

      return {
        props: {
          ...initialProps,
          cardData: cardData.data,
        },
      };
    },
  });

export default Card;
