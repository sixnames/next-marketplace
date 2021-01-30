import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import MakeAnOrderRoute from 'routes/MakeAnOrderRoute/MakeAnOrderRoute';
import { PagePropsInterface } from './_app';

const MakeAnOrder: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <SiteLayout initialTheme={initialTheme} title={'Корзина'}>
      <MakeAnOrderRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { initialTheme, isMobileDevice, apolloClient } = await getSiteInitialData(context);

    return {
      props: {
        initialTheme,
        isMobileDevice,
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(JSON.stringify(e, null, 2));
    return { props: {} };
  }
}

export default MakeAnOrder;
