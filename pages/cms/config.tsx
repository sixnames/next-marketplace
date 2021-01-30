import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import ConfigsRoute from 'routes/ConfigsRoute/ConfigsRoute';

const Config: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <ConfigsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Config;
