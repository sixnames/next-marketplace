import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import SiteLayout from '../layout/SiteLayout/SiteLayout';
import Title from '../components/Title/Title';
import Inner from '../components/Inner/Inner';
import getSiteServerSideProps, { SitePagePropsType } from '../utils/getSiteServerSideProps';

const Home: NextPage<SitePagePropsType> = ({ initialApolloState }) => {
  return (
    <SiteLayout initialApolloState={initialApolloState}>
      <Inner>
        <Title>Main page</Title>
      </Inner>
    </SiteLayout>
  );
};

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
