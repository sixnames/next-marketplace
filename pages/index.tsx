import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';

interface HomePageInterface extends PagePropsInterface, SiteLayoutInterface {}

const Home: NextPage<HomePageInterface> = ({ navRubrics, company, pageUrls }) => {
  if (company) {
    return (
      <SiteLayout navRubrics={navRubrics} pageUrls={pageUrls}>
        <Inner>
          <Title>{company.name}</Title>
        </Inner>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout navRubrics={navRubrics} pageUrls={pageUrls}>
      <Inner>
        <Title>Winepoint</Title>
      </Inner>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<HomePageInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default Home;
