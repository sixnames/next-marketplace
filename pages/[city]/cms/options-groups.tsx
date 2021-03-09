import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import OptionsGroupsRoute from 'routes/OptionsGroups/OptionsGroupsRoute';

const OptionsGroups: NextPage<PagePropsInterface> = () => {
  return (
    <AppLayout>
      <OptionsGroupsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default OptionsGroups;
