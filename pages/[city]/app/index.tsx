import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import AppLayout from 'layout/AppLayout/AppLayout';
import * as React from 'react';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const App: NextPage = () => {
  return (
    <AppLayout title={'App'}>
      <Inner>
        <Title>App</Title>
      </Inner>
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default App;