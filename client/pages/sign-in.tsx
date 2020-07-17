import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SignInRoute from '../routes/SignInRoute/SignInRoute';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import { SiteContextProvider } from '../context/siteContext';
import Inner from '../components/Inner/Inner';
import RequestError from '../components/RequestError/RequestError';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';

const SignIn: NextPage<SitePagePropsType> = ({ initialApolloState, lang }) => {
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
export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps({
    context,
    callback: async ({ initialProps }) => {
      return {
        props: initialProps,
      };
    },
  });

export default SignIn;
