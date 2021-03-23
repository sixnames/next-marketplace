import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import ConfigsRoute from 'routes/ConfigsRoute/ConfigsRoute';

const Config: NextPage = () => {
  return (
    <AppLayout>
      <ConfigsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Config;
