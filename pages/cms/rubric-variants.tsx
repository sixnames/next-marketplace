import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import RubricVariantsRoute from 'routes/RubricVariants/RubricVariantsRoute';

const RubricVariants: NextPage<PagePropsInterface> = ({ initialTheme }) => {
  return (
    <AppLayout initialTheme={initialTheme}>
      <RubricVariantsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default RubricVariants;
