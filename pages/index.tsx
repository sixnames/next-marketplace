import { useConfigContext } from 'context/configContext';
import dynamic from 'next/dynamic';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';

const SiteLayout = dynamic(() => import('layout/SiteLayout/SiteLayout'));
const CompanyDefaultLayout = dynamic(
  () => import('layout/CompanyDefaultLayout/CompanyDefaultLayout'),
);

interface HomePageInterface extends PagePropsInterface, SiteLayoutInterface {}

const Home: NextPage<HomePageInterface> = ({ navRubrics, company, ...props }) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');

  if (company) {
    return (
      <CompanyDefaultLayout navRubrics={navRubrics} {...props}>
        <Inner>
          <Title>{company.name}</Title>
        </Inner>
      </CompanyDefaultLayout>
    );
  }

  return (
    <SiteLayout navRubrics={navRubrics} {...props}>
      <Inner>
        <Title>{configTitle}</Title>
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
