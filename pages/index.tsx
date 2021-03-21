import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';

interface HomePageInterface extends PagePropsInterface, SiteLayoutInterface {}

const Home: NextPage<HomePageInterface> = ({ navRubrics, domain, company }) => {
  if (company) {
    return (
      <SiteLayout navRubrics={navRubrics}>
        <Inner>
          <Title>{company.name}</Title>
          {domain}
          <pre>{JSON.stringify(company, null, 2)}</pre>
        </Inner>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout navRubrics={navRubrics}>
      <Inner>
        <Title>Main page</Title>
        {domain}
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
