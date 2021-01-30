import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ThankYouRoute from 'routes/ThankYouRoute/ThankYouRoute';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import { PagePropsInterface } from './_app';

const ThankYou: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <SiteLayout initialTheme={initialTheme} title={'Спасибо за заказ!'}>
      <ThankYouRoute />
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

export default ThankYou;
