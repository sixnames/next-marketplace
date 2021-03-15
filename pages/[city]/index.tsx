import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';

interface HomePageInterface extends PagePropsInterface, SiteLayoutInterface {}

const Home: NextPage<HomePageInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout navRubrics={navRubrics}>
      <Inner>
        <Title>Main page</Title>
      </Inner>
    </SiteLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { cityNotFound, props, revalidate, redirectPayload } = await getSiteInitialData({
    params,
    locale,
  });

  if (cityNotFound) {
    return redirectPayload;
  }

  return {
    props,
    revalidate,
  };
};

export default Home;
