import AppLayout from 'layout/AppLayout/AppLayout';
import * as React from 'react';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';
import RubricVariantsRoute from 'routes/RubricVariants/RubricVariantsRoute';

const RubricVariants: NextPage = () => {
  return (
    <AppLayout>
      <RubricVariantsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default RubricVariants;
