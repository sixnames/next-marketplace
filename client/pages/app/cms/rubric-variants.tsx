import React from 'react';
import AppLayout from '../../../layout/AppLayout/AppLayout';
import { GetServerSideProps, NextPage } from 'next';
import { UserContextProvider } from '../../../context/userContext';
import RubricVariantsRoute from '../../../routes/RubricVariants/RubricVariantsRoute';
import getAppServerSideProps, { AppPageInterface } from '../../../utils/getAppServerSideProps';

const RubricVariants: NextPage<AppPageInterface> = ({ initialApolloState }) => {
  const myData = initialApolloState ? initialApolloState.me : null;

  return (
    <UserContextProvider me={myData}>
      <AppLayout title={'Типы рубрик'}>
        <RubricVariantsRoute />
      </AppLayout>
    </UserContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = getAppServerSideProps;

// noinspection JSUnusedGlobalSymbols
export default RubricVariants;
