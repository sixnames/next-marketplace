import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import RubricVariantsRoute from '../../../routes/RubricVariants/RubricVariantsRoute';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';

const RubricVariants: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Типы рубрик'} initialApolloState={initialApolloState}>
      <RubricVariantsRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default RubricVariants;
