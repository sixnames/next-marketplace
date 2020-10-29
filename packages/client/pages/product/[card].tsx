import React from 'react';
import { GetServerSideProps } from 'next';
import { GetCatalogueCardQueryQueryResult } from '../../generated/apolloComponents';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import CardRoute from '../../routes/CardRoute/CardRoute';
import { CATALOGUE_CARD_QUERY } from '../../graphql/query/cardQuery';
import getSiteServerSideProps, { SitePagePropsType } from '../../utils/getSiteServerSideProps';

export type CardData = GetCatalogueCardQueryQueryResult['data'];

interface CardInterface {
  cardData: CardData;
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

  return (
    <SiteLayout initialApolloState={initialApolloState}>
      <CardRoute cardData={cardData} />
    </SiteLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
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

// noinspection JSUnusedGlobalSymbols
export default Card;