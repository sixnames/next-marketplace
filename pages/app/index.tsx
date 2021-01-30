import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_SIGN_IN } from 'config/common';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

const App: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme} title={'App'}>
      <Inner>
        <Title>App</Title>
      </Inner>
    </AppLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    // Check if user authenticated
    const session = await getSession(context);
    if (!session?.user) {
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_SIGN_IN,
        },
      };
    }

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

export default App;
