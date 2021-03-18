import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
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

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<HomePageInterface>> {
  const { locale, query } = context;

  const { cityNotFound, props, redirectPayload } = await getSiteInitialData({
    params: query,
    locale,
  });

  if (cityNotFound) {
    return redirectPayload;
  }

  return {
    props,
  };
}

export default Home;
