import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import Title from '../components/Title/Title';
import Inner from '../components/Inner/Inner';
import { SiteContextProvider } from '../context/siteContext';
import RequestError from '../components/RequestError/RequestError';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';

const Home: NextPage<SitePagePropsType> = ({ initialApolloState, lang }) => {
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
export const getServerSideProps: GetServerSideProps = async (context) =>
  getSiteServerSideProps({
    context,
    callback: async ({ initialProps }) => {
      return {
        props: initialProps,
      };
    },
  });

export default Home;
