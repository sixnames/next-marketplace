import React from 'react';
import AppLayout from '../../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import getAppServerSideProps, { AppPageInterface } from '../../../../utils/getAppServerSideProps';

const Companies: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  return (
    <AppLayout title={'Компании'} initialApolloState={initialApolloState}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad at placeat praesentium
      temporibus? Aliquid eius esse explicabo incidunt magni, modi nihil possimus quae quas
      reiciendis reprehenderit sit temporibus vel! Eveniet.
    </AppLayout>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default Companies;
