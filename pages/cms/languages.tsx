import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import LanguagesRoute from 'routes/Languages/LanguagesRoute';

const Languages: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <LanguagesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Languages;
