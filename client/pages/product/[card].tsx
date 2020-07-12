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
import CardRoute from '../../routes/CardRoute/CardRoute';
import { INITIAL_SITE_QUERY } from '../../graphql/query/initialQuery';
import { CATALOGUE_CARD_QUERY } from '../../graphql/query/cardQuery';
import cookie from 'cookie';
import { DEFAULT_LANG } from '../../config';

export type CardData = GetCatalogueCardQueryQueryResult['data'];

interface CardInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
  cardData: CardData;
  lang: string;
}

const Card: React.FC<CardInterface> = ({ initialApolloState, cardData, lang }) => {
  if (!initialApolloState || !cardData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  return (
    <SiteContextProvider initialApolloState={initialApolloState} lang={lang}>
      <SiteLayout>
        <CardRoute cardData={cardData} />
      </SiteLayout>
    </SiteContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  try {
    const apolloClient = initializeApollo();
    const { lang } = cookie.parse(req.headers.cookie || '');

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
        id: query.card,
      },
    });

    return {
      props: {
        initialApolloState: initialApolloState.data,
        lang: lang || DEFAULT_LANG,
        cardData: cardData.data,
      },
    };
  } catch (e) {
    console.log('====== catalogue getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
};

// noinspection JSUnusedGlobalSymbols
export default Card;
