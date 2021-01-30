import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import OptionsGroupsRoute from 'routes/OptionsGroups/OptionsGroupsRoute';

const OptionsGroups: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <OptionsGroupsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default OptionsGroups;
