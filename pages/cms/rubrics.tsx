import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import RubricsRoute from 'routes/Rubrics/RubricsRoute';

const Cms: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <RubricsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Cms;
