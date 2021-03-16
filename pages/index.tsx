import { DEFAULT_CITY } from 'config/common';
import * as React from 'react';
import { GetServerSidePropsResult, NextPage } from 'next';

const Home: NextPage = () => {
  return <div />;
};

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<any>> => {
  return {
    props: {},
    redirect: {
      destination: `/${DEFAULT_CITY}`,
      permanent: true,
    },
  };
};

export default Home;
