import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import ConfigsRoute from 'routes/ConfigsRoute/ConfigsRoute';

const Config: NextPage = () => {
  return (
    <AppLayout>
      <ConfigsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Config;
