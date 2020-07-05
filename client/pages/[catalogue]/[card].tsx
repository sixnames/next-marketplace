import React from 'react';
import { GetServerSideProps } from 'next';
import { initializeApollo } from '../../apollo/client';
// import { INITIAL_SITE_QUERY } from '../graphql/query/initialQuery';
// import { CATALOGUE_CARD_QUERY } from '../graphql/query/cardQuery';
import {
  GetCatalogueCardQueryQueryResult,
  InitialSiteQueryQueryResult,
} from '../../generated/apolloComponents';
import { SiteContextProvider } from '../../context/siteContext';
import SiteLayout from '../../layout/SiteLayout/SiteLayout';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import { UserContextProvider } from '../../context/userContext';
import CardRoute from '../../routes/CardRoute/CardRoute';
import { INITIAL_SITE_QUERY } from '../../graphql/query/initialQuery';
import { CATALOGUE_CARD_QUERY } from '../../graphql/query/cardQuery';

export type CardData = GetCatalogueCardQueryQueryResult['data'];

interface CardInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
  cardData: CardData;
}

const Card: React.FC<CardInterface> = ({ initialApolloState, cardData }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  if (!cardData) {
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
          <CardRoute cardData={cardData} />
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

  const cardData = await apolloClient.query({
    query: CATALOGUE_CARD_QUERY,
    context: {
      headers: req.headers,
    },
    variables: {
      id: query.id,
    },
  });

  return {
    props: {
      initialApolloState: initialApolloState.data,
      cardData: cardData.data,
    },
  };
};

export default Card;
