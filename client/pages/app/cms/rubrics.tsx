import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';
import RubricsRoute from '../../../routes/Rubrics/RubricsRoute';

const Rubrics: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Рубрикатор'} initialApolloState={initialApolloState}>
      <RubricsRoute />
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Rubrics;
