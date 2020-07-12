import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SignInRoute from '../routes/SignInRoute/SignInRoute';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { initializeApollo } from '../apollo/client';
import { INITIAL_SITE_QUERY } from '../graphql/query/initialQuery';
import { InitialSiteQueryQueryResult } from '../generated/apolloComponents';
import { SiteContextProvider } from '../context/siteContext';
import Inner from '../components/Inner/Inner';
import RequestError from '../components/RequestError/RequestError';
import cookie from 'cookie';
import { DEFAULT_LANG } from '../config';

interface SignInInterface {
  initialApolloState: InitialSiteQueryQueryResult['data'];
  lang: string;
}

const SignIn: NextPage<SignInInterface> = ({ initialApolloState, lang }) => {
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
        <SignInRoute />
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

export default SignIn;
