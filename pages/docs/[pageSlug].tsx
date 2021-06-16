import Inner from 'components/Inner/Inner';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

const ThankYouRoute: React.FC = () => {
  return (
    <div className='mb-20'>
      <Inner>page</Inner>
    </div>
  );
};

type ThankYouInterface = SiteLayoutProviderInterface;

const ThankYou: NextPage<ThankYouInterface> = (props) => {
  return (
    <SiteLayoutProvider title={'page'} {...props}>
      <ThankYouRoute />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ThankYouInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default ThankYou;
