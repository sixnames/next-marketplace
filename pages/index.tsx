import { DEFAULT_CITY } from 'config/common';
import * as React from 'react';
import { GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout from 'layout/SiteLayout/SiteLayout';

const Home: NextPage = () => {
  return <SiteLayout />;
};

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<any>> => {
  return {
    props: {},
    redirect: {
      destination: `/${DEFAULT_CITY}/`,
      permanent: true,
    },
  };
};

export default Home;
