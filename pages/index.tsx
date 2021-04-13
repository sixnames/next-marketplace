import { useConfigContext } from 'context/configContext';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import { getSiteInitialData } from 'lib/ssrUtils';

const Home: NextPage<SiteLayoutProviderInterface> = (props) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');

  return (
    <SiteLayoutProvider {...props}>
      <Inner>
        <Title>{configTitle}</Title>
      </Inner>
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SiteLayoutProviderInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default Home;
