import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import LanguagesRoute from 'routes/Languages/LanguagesRoute';

const Languages: NextPage = () => {
  return (
    <AppLayout>
      <LanguagesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Languages;
