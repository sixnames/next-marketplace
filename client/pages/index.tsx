import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { initializeApollo } from '../apollo/client';
import { INITIAL_SITE_QUERY } from '../graphql/query/initialQuery';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import Title from '../components/Title/Title';
import Inner from '../components/Inner/Inner';
import { InitialSiteQueryQueryResult } from '../generated/apolloComponents';
import { SiteContextProvider } from '../context/siteContext';
import cookie from 'cookie';
import { DEFAULT_LANG } from '../config';
import RequestError from '../components/RequestError/RequestError';

interface HomeInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
  lang: string;
}

const Home: NextPage<HomeInterface> = ({ initialApolloState, lang }) => {
  if (!initialApolloState) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  return (
    <SiteContextProvider initialApolloState={initialApolloState} lang={lang}>
      <SiteLayout>
        <Inner>
          <Title>Main page</Title>
        </Inner>
      </SiteLayout>
    </SiteContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const apolloClient = initializeApollo();
    const { lang } = cookie.parse(req.headers.cookie || '');

    const initialApolloState = await apolloClient.query({
      query: INITIAL_SITE_QUERY,
      context: {
        headers: req.headers,
      },
    });

    return {
      props: {
        initialApolloState: initialApolloState.data,
        lang: lang || DEFAULT_LANG,
      },
    };
  } catch (e) {
    console.log('====== catalogue getServerSideProps error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
};

export default Home;
