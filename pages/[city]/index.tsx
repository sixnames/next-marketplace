import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';

const Home: NextPage = () => {
  return (
    <SiteLayout>
      <Inner>
        <Title>Main page</Title>
      </Inner>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { apolloClient } = await getSiteInitialData(context);

    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default Home;
