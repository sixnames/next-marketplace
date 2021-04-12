import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const App: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout title={'Панель управления'} pageUrls={pageUrls}>
      <Inner>
        <Title>Панель управления</Title>
      </Inner>
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const test = await getAppInitialData({ context });
  console.log(JSON.stringify(test, null, 2));
  return getAppInitialData({ context });
};

export default App;
